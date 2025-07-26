import stripe
from django.conf import settings
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from courses.models import Course, Enrollment
from .models import Payment

stripe.api_key = settings.STRIPE_SECRET_KEY

@login_required
def create_checkout_session(request, slug):
    if not request.user.is_student():
        messages.error(request, 'Only students can enroll in courses.')
        return redirect('courses:course_detail', slug=slug)
    
    course = get_object_or_404(Course, slug=slug, is_published=True, course_type='paid')
    
    # Check if already enrolled
    if Enrollment.objects.filter(student=request.user, course=course).exists():
        messages.info(request, 'You are already enrolled in this course.')
        return redirect('courses:course_detail', slug=slug)
    
    try:
        # Create success URL without the placeholder
        success_url = request.build_absolute_uri(
            reverse('payments:payment_success')
        ) + f'?course_slug={slug}'
        
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': course.title,
                        'description': f'Enrollment in {course.title} by {course.tutor.username}',
                    },
                    'unit_amount': int(course.price * 100),  # Stripe expects cents
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=success_url + '&session_id={CHECKOUT_SESSION_ID}',  # Stripe will replace this
            cancel_url=request.build_absolute_uri(
                reverse('courses:course_detail', args=[slug])
            ),
            metadata={
                'course_id': course.id,
                'student_id': request.user.id,
            }
        )
        
        return redirect(checkout_session.url, code=303)
        
    except Exception as e:
        messages.error(request, f'Error creating payment session: {str(e)}')
        return redirect('courses:course_detail', slug=slug)

@login_required
def payment_success(request):
    session_id = request.GET.get('session_id')
    course_slug = request.GET.get('course_slug')
    
    if not session_id or not course_slug:
        messages.error(request, 'Invalid payment session.')
        return redirect('courses:dashboard')
    
    try:
        # Retrieve the session from Stripe
        session = stripe.checkout.Session.retrieve(session_id)
        
        if session.payment_status == 'paid':
            course = get_object_or_404(Course, slug=course_slug)
            
            # Check if enrollment already exists (prevent duplicates)
            enrollment, created = Enrollment.objects.get_or_create(
                student=request.user,
                course=course
            )
            
            if created:
                # Create payment record
                Payment.objects.create(
                    student=request.user,
                    course=course,
                    amount=course.price,
                    stripe_payment_intent_id=session.payment_intent,
                    status='completed'
                )
                
                messages.success(request, f'Payment successful! You are now enrolled in {course.title}.')
            else:
                messages.info(request, 'You are already enrolled in this course.')
            
            return redirect('courses:learn_course', slug=course_slug)
        else:
            messages.error(request, 'Payment was not completed.')
            return redirect('courses:course_detail', slug=course_slug)
            
    except stripe.error.StripeError as e:
        messages.error(request, f'Stripe error: {str(e)}')
        return redirect('courses:course_detail', slug=course_slug)
    except Exception as e:
        messages.error(request, f'Error processing payment: {str(e)}')
        return redirect('courses:dashboard')

@login_required
def payment_cancel(request):
    messages.info(request, 'Payment was cancelled.')
    return redirect('courses:dashboard')
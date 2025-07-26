from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q, Count, Avg
from django.http import JsonResponse
from django.urls import reverse
from .models import Course, Category, Enrollment, Module, Lesson, LessonProgress, Review
from .forms import CourseForm, ModuleForm, LessonForm, ReviewForm
from django.utils import timezone

def home(request):
    featured_courses = Course.objects.filter(is_published=True).order_by('-created_at')[:6]
    categories = Category.objects.all()
    context = {
        'featured_courses': featured_courses,
        'categories': categories,
    }
    return render(request, 'courses/home.html', context)

def course_list(request):
    courses = Course.objects.filter(is_published=True)
    categories = Category.objects.all()
    
    # Search functionality
    query = request.GET.get('q')
    if query:
        courses = courses.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(tutor__username__icontains=query)
        )
    
    # Category filter
    category_slug = request.GET.get('category')
    if category_slug:
        category = get_object_or_404(Category, slug=category_slug)
        courses = courses.filter(category=category)
    
    # Price filter
    price_filter = request.GET.get('price')
    if price_filter == 'free':
        courses = courses.filter(course_type='free')
    elif price_filter == 'paid':
        courses = courses.filter(course_type='paid')
    
    context = {
        'courses': courses,
        'categories': categories,
        'query': query,
        'selected_category': category_slug,
        'selected_price': price_filter,
    }
    return render(request, 'courses/course_list.html', context)


def course_detail(request, slug):
    course = get_object_or_404(Course, slug=slug, is_published=True)
    modules = course.modules.all()
    reviews = course.reviews.all()
    
    # Calculate average rating
    avg_rating = course.get_average_rating()
    
    # Check if user is enrolled
    is_enrolled = False
    has_reviewed = False
    
    if request.user.is_authenticated:
        is_enrolled = Enrollment.objects.filter(student=request.user, course=course).exists()
        if request.user.is_student():
            has_reviewed = Review.objects.filter(student=request.user, course=course).exists()
    
    context = {
        'course': course,
        'modules': modules,
        'reviews': reviews,
        'is_enrolled': is_enrolled,
        'avg_rating': avg_rating,
        'has_reviewed': has_reviewed,
    }
    return render(request, 'courses/course_detail.html', context)


@login_required
def dashboard(request):
    if request.user.is_tutor():
        # Tutor dashboard
        courses = Course.objects.filter(tutor=request.user)
        total_students = Enrollment.objects.filter(course__tutor=request.user).count()
        context = {
            'courses': courses,
            'total_students': total_students,
        }
        return render(request, 'courses/tutor_dashboard.html', context)
    else:
        # Student dashboard
        enrollments = Enrollment.objects.filter(student=request.user)
        completed_count = enrollments.filter(completed=True).count()
        in_progress_count = enrollments.filter(completed=False).count()
        
        context = {
            'enrollments': enrollments,
            'completed_count': completed_count,
            'in_progress_count': in_progress_count,
        }
        return render(request, 'courses/student_dashboard.html', context)


@login_required
def create_course(request):
    if not request.user.is_tutor():
        messages.error(request, 'Only tutors can create courses.')
        return redirect('courses:dashboard')
    
    if request.method == 'POST':
        form = CourseForm(request.POST, request.FILES)
        if form.is_valid():
            course = form.save(commit=False)
            course.tutor = request.user
            course.save()
            messages.success(request, 'Course created successfully! Now add modules and lessons.')
            return redirect('courses:manage_course_content', slug=course.slug)
    else:
        form = CourseForm()
    
    return render(request, 'courses/create_course.html', {'form': form})

@login_required
def edit_course(request, slug):
    course = get_object_or_404(Course, slug=slug, tutor=request.user)
    
    if request.method == 'POST':
        form = CourseForm(request.POST, request.FILES, instance=course)
        if form.is_valid():
            form.save()
            messages.success(request, 'Course updated successfully!')
            return redirect('courses:manage_course_content', slug=course.slug)
    else:
        form = CourseForm(instance=course)
    
    return render(request, 'courses/edit_course.html', {'form': form, 'course': course})

@login_required
def manage_course_content(request, slug):
    course = get_object_or_404(Course, slug=slug, tutor=request.user)
    modules = course.modules.all()
    
    return render(request, 'courses/manage_course_content.html', {
        'course': course,
        'modules': modules,
    })

@login_required
def add_module(request, slug):
    course = get_object_or_404(Course, slug=slug, tutor=request.user)
    
    if request.method == 'POST':
        form = ModuleForm(request.POST)
        if form.is_valid():
            module = form.save(commit=False)
            module.course = course
            module.save()
            messages.success(request, 'Module added successfully!')
            return redirect('courses:manage_course_content', slug=course.slug)
    else:
        form = ModuleForm()
    
    return render(request, 'courses/add_module.html', {
        'form': form,
        'course': course,
    })

@login_required
def edit_module(request, slug, module_id):
    course = get_object_or_404(Course, slug=slug, tutor=request.user)
    module = get_object_or_404(Module, id=module_id, course=course)
    
    if request.method == 'POST':
        form = ModuleForm(request.POST, instance=module)
        if form.is_valid():
            form.save()
            messages.success(request, 'Module updated successfully!')
            return redirect('courses:manage_course_content', slug=course.slug)
    else:
        form = ModuleForm(instance=module)
    
    return render(request, 'courses/edit_module.html', {
        'form': form,
        'course': course,
        'module': module,
    })

@login_required
def add_lesson(request, slug, module_id):
    course = get_object_or_404(Course, slug=slug, tutor=request.user)
    module = get_object_or_404(Module, id=module_id, course=course)
    
    if request.method == 'POST':
        form = LessonForm(request.POST)
        if form.is_valid():
            lesson = form.save(commit=False)
            lesson.module = module
            lesson.save()
            messages.success(request, 'Lesson added successfully!')
            return redirect('courses:manage_course_content', slug=course.slug)
    else:
        form = LessonForm()
    
    return render(request, 'courses/add_lesson.html', {
        'form': form,
        'course': course,
        'module': module,
    })

@login_required
def edit_lesson(request, slug, lesson_id):
    course = get_object_or_404(Course, slug=slug, tutor=request.user)
    lesson = get_object_or_404(Lesson, id=lesson_id, module__course=course)
    
    if request.method == 'POST':
        form = LessonForm(request.POST, instance=lesson)
        if form.is_valid():
            form.save()
            messages.success(request, 'Lesson updated successfully!')
            return redirect('courses:manage_course_content', slug=course.slug)
    else:
        form = LessonForm(instance=lesson)
    
    return render(request, 'courses/edit_lesson.html', {
        'form': form,
        'course': course,
        'lesson': lesson,
    })

@login_required
def delete_course(request, slug):
    course = get_object_or_404(Course, slug=slug, tutor=request.user)
    
    if request.method == 'POST':
        course.delete()
        messages.success(request, 'Course deleted successfully!')
        return redirect('courses:dashboard')
    
    return render(request, 'courses/delete_course.html', {'course': course})

@login_required
def publish_course(request, slug):
    course = get_object_or_404(Course, slug=slug, tutor=request.user)
    
    # Check if course has at least one module with at least one lesson
    if not course.modules.exists():
        messages.error(request, 'Please add at least one module before publishing.')
        return redirect('courses:manage_course_content', slug=course.slug)
    
    has_lessons = any(module.lessons.exists() for module in course.modules.all())
    if not has_lessons:
        messages.error(request, 'Please add at least one lesson before publishing.')
        return redirect('courses:manage_course_content', slug=course.slug)
    
    course.is_published = not course.is_published
    course.save()
    
    if course.is_published:
        messages.success(request, 'Course published successfully!')
    else:
        messages.info(request, 'Course unpublished.')
    
    return redirect('courses:manage_course_content', slug=course.slug)

@login_required
def enroll_free_course(request, slug):
    if not request.user.is_student():
        messages.error(request, 'Only students can enroll in courses.')
        return redirect('courses:course_detail', slug=slug)
    
    course = get_object_or_404(Course, slug=slug, is_published=True, course_type='free')
    
    # Check if already enrolled
    if Enrollment.objects.filter(student=request.user, course=course).exists():
        messages.info(request, 'You are already enrolled in this course.')
        return redirect('courses:course_detail', slug=slug)
    
    # Create enrollment
    Enrollment.objects.create(student=request.user, course=course)
    messages.success(request, 'Successfully enrolled in the course!')
    
    return redirect('courses:course_detail', slug=slug)


@login_required
def learn_course(request, slug):
    course = get_object_or_404(Course, slug=slug, is_published=True)
    enrollment = get_object_or_404(Enrollment, student=request.user, course=course)
    
    modules = course.modules.all()
    
    # Get or create progress for all lessons
    for module in modules:
        for lesson in module.lessons.all():
            LessonProgress.objects.get_or_create(
                enrollment=enrollment,
                lesson=lesson
            )
    
    # Get current lesson (first incomplete or first lesson)
    current_lesson = None
    incomplete_progress = LessonProgress.objects.filter(
        enrollment=enrollment,
        completed=False
    ).select_related('lesson__module').order_by('lesson__module__order', 'lesson__order').first()
    
    if incomplete_progress:
        current_lesson = incomplete_progress.lesson
    elif modules.exists() and modules.first().lessons.exists():
        current_lesson = modules.first().lessons.first()
    
    context = {
        'course': course,
        'enrollment': enrollment,
        'modules': modules,
        'current_lesson': current_lesson,
    }
    return render(request, 'courses/learn_course.html', context)



@login_required
def view_lesson(request, slug, lesson_id):
    course = get_object_or_404(Course, slug=slug, is_published=True)
    enrollment = get_object_or_404(Enrollment, student=request.user, course=course)
    lesson = get_object_or_404(Lesson, id=lesson_id, module__course=course)
    
    # Get or create progress
    progress, created = LessonProgress.objects.get_or_create(
        enrollment=enrollment,
        lesson=lesson
    )
    
    # Handle form submission
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action in ['mark_complete_only', 'complete_and_next']:
            # Mark current lesson as complete
            progress.completed = True
            progress.completed_at = timezone.now()
            progress.save()
            
            # Check if course is completed
            total_lessons = Lesson.objects.filter(module__course=course).count()
            completed_lessons = LessonProgress.objects.filter(
                enrollment=enrollment,
                completed=True
            ).count()
            
            if total_lessons == completed_lessons:
                enrollment.completed = True
                enrollment.completed_at = timezone.now()
                enrollment.save()
                messages.success(request, 'Congratulations! You have completed the course!')
            else:
                messages.success(request, 'Lesson marked as complete!')
            
            # If action is complete_and_next, find and redirect to next lesson
            if action == 'complete_and_next':
                next_lesson = None
                found_current = False
                
                for module in course.modules.all().order_by('order'):
                    for l in module.lessons.all().order_by('order'):
                        if found_current:
                            next_lesson = l
                            break
                        if l.id == lesson.id:
                            found_current = True
                    if next_lesson:
                        break
                
                if next_lesson:
                    return redirect('courses:view_lesson', slug=course.slug, lesson_id=next_lesson.id)
                else:
                    messages.info(request, 'You have completed all lessons!')
                    return redirect('courses:learn_course', slug=course.slug)
            
            # For mark_complete_only, stay on the same page
            return redirect('courses:view_lesson', slug=course.slug, lesson_id=lesson.id)
    
    
    # Check if there's any next lesson
    next_lesson = None
    found_current = False

    for module in course.modules.all().order_by('order'):
        for l in module.lessons.all().order_by('order'):
            if found_current:
                next_lesson = l
                break
            if l.id == lesson.id:
                found_current = True
        if next_lesson:
            break


    context = {
        'course': course,
        'enrollment': enrollment,
        'lesson': lesson,
        'progress': progress,
        'modules': course.modules.all().order_by('order'),
        'next_lesson': next_lesson, 
    }
    return render(request, 'courses/view_lesson.html', context)

@login_required
def add_review(request, slug):
    course = get_object_or_404(Course, slug=slug, is_published=True)
    
    # Check if user is enrolled
    if not Enrollment.objects.filter(student=request.user, course=course).exists():
        messages.error(request, 'You must be enrolled to review this course.')
        return redirect('courses:course_detail', slug=slug)
    
    # Check if already reviewed
    if Review.objects.filter(student=request.user, course=course).exists():
        messages.info(request, 'You have already reviewed this course.')
        return redirect('courses:course_detail', slug=slug)
    
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.course = course
            review.student = request.user
            review.save()
            messages.success(request, 'Thank you for your review!')
            return redirect('courses:course_detail', slug=slug)
    else:
        form = ReviewForm()
    
    return render(request, 'courses/add_review.html', {
        'form': form,
        'course': course,
    })

# custom error page
def custom_404(request, exception):
    return render(request, '404.html', status=404)

# custom error page
def custom_500(request):
    return render(request, '500.html', status=500)
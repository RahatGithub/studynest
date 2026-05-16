from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q, Count, Avg
from django.urls import reverse
from .models import Course, Category, Enrollment, Module, Lesson, LessonProgress, Review
from .forms import CourseForm, ModuleForm, LessonForm, ReviewForm
from django.utils import timezone

def home(request):
    featured_courses = Course.objects.filter(is_published=True).select_related('tutor', 'category').order_by('-created_at')[:6]
    categories = Category.objects.annotate(course_count=Count('courses', filter=Q(courses__is_published=True)))

    # Hero card stack: 5 oldest published courses with stats
    hero_qs = (
        Course.objects.filter(is_published=True)
        .select_related('tutor', 'category')
        .annotate(
            student_count=Count('enrollments', distinct=True),
            avg_rating=Avg('reviews__rating'),
            lesson_count=Count('modules__lessons', distinct=True),
        )
        .order_by('created_at')[:5]
    )
    hero_courses_list = list(hero_qs)

    if len(hero_courses_list) >= 5:
        hero_courses = hero_courses_list
        use_real_courses = True
    else:
        use_real_courses = False
        hero_courses = [
            {
                'title': 'Modern JavaScript', 'category_name': 'Web Development',
                'tutor_name': 'Jane Smith', 'tutor_initial': 'J', 'tutor_bio': 'Senior frontend engineer specializing in modern JavaScript ecosystems.',
                'avatar_bg': '#4F46E5', 'img_class': '', 'tag_class': '',
                'student_count': 1240, 'avg_rating': 4.8, 'lesson_count': 12,
                'description': 'Master ES6+, async patterns, closures, and the module system. Build real-world projects using modern tooling and best practices that top companies expect.',
            },
            {
                'title': 'Python for Analytics', 'category_name': 'Data Science',
                'tutor_name': 'K. Rahman', 'tutor_initial': 'K', 'tutor_bio': 'Data scientist and educator with 8 years of industry experience.',
                'avatar_bg': '#F59E0B', 'img_class': 'gradient-green', 'tag_class': 'tag-green',
                'student_count': 890, 'avg_rating': 4.6, 'lesson_count': 18,
                'description': 'Learn pandas, NumPy, and matplotlib from scratch. Explore real datasets, build visualizations, and gain the analytical skills employers are hiring for right now.',
            },
            {
                'title': 'Design Systems', 'category_name': 'UI/UX Design',
                'tutor_name': 'Sarah Chen', 'tutor_initial': 'S', 'tutor_bio': 'Lead product designer at a top SaaS company, design systems advocate.',
                'avatar_bg': '#EC4899', 'img_class': 'gradient-pink', 'tag_class': 'tag-pink',
                'student_count': 670, 'avg_rating': 4.9, 'lesson_count': 15,
                'description': 'Build scalable, consistent UI with tokens, components, and documentation. Learn the workflow used by teams at Figma, Stripe, and Linear to ship polished products faster.',
            },
            {
                'title': 'Cloud Engineering', 'category_name': 'DevOps',
                'tutor_name': 'Arif Hasan', 'tutor_initial': 'A', 'tutor_bio': 'AWS certified architect and cloud infrastructure consultant.',
                'avatar_bg': '#0D9488', 'img_class': 'gradient-teal', 'tag_class': 'tag-teal',
                'student_count': 520, 'avg_rating': 4.7, 'lesson_count': 20,
                'description': 'Deploy, monitor, and scale applications on AWS and GCP. Learn Docker, Kubernetes, CI/CD pipelines, and infrastructure as code from real production scenarios.',
            },
            {
                'title': 'Mobile App Development', 'category_name': 'Programming',
                'tutor_name': 'Priya Sharma', 'tutor_initial': 'P', 'tutor_bio': 'Mobile developer with apps used by millions across iOS and Android.',
                'avatar_bg': '#6366F1', 'img_class': 'gradient-violet', 'tag_class': 'tag-violet',
                'student_count': 980, 'avg_rating': 4.5, 'lesson_count': 24,
                'description': 'Build cross-platform mobile apps with React Native. Cover navigation, state management, native APIs, and publishing to the App Store and Google Play.',
            },
        ]

    context = {
        'featured_courses': featured_courses,
        'categories': categories,
        'hero_courses': hero_courses,
        'use_real_courses': use_real_courses,
    }
    return render(request, 'courses/home.html', context)

def course_list(request):
    courses = Course.objects.filter(is_published=True).select_related('tutor', 'category')
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
    course = get_object_or_404(
        Course.objects.select_related('tutor', 'category').prefetch_related('modules__lessons', 'reviews__student'),
        slug=slug, is_published=True
    )
    modules = course.modules.all()
    reviews = course.reviews.all()
    total_lessons = Lesson.objects.filter(module__course=course).count()

    # Calculate average rating
    avg_rating = course.get_average_rating()

    # Check if user is enrolled
    is_enrolled = False
    has_reviewed = False
    has_completed = False

    if request.user.is_authenticated:
        if request.user.is_student():
            is_enrolled = Enrollment.objects.filter(student=request.user, course=course).exists()
            if is_enrolled:
                has_completed = Enrollment.objects.filter(student=request.user, course=course)[0].completed
                has_reviewed = Review.objects.filter(student=request.user, course=course).exists()

    context = {
        'course': course,
        'modules': modules,
        'reviews': reviews,
        'total_lessons': total_lessons,
        'is_enrolled': is_enrolled,
        'has_completed': has_completed,
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

    modules = course.modules.prefetch_related('lessons').all()

    # Bulk-create progress records for lessons that don't have one yet
    all_lessons = Lesson.objects.filter(module__course=course)
    existing_lesson_ids = set(
        LessonProgress.objects.filter(enrollment=enrollment).values_list('lesson_id', flat=True)
    )
    new_progress = [
        LessonProgress(enrollment=enrollment, lesson=lesson)
        for lesson in all_lessons
        if lesson.id not in existing_lesson_ids
    ]
    if new_progress:
        LessonProgress.objects.bulk_create(new_progress, ignore_conflicts=True)
    
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



def get_next_lesson(course, current_lesson):
    """Find the next lesson in course order after the given lesson."""
    found_current = False
    for module in course.modules.all().order_by('order'):
        for l in module.lessons.all().order_by('order'):
            if found_current:
                return l
            if l.id == current_lesson.id:
                found_current = True
    return None


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
                next_lesson = get_next_lesson(course, lesson)
                if next_lesson:
                    return redirect('courses:view_lesson', slug=course.slug, lesson_id=next_lesson.id)
                else:
                    messages.info(request, 'You have completed all lessons!')
                    return redirect('courses:learn_course', slug=course.slug)

            # For mark_complete_only, stay on the same page
            return redirect('courses:view_lesson', slug=course.slug, lesson_id=lesson.id)

    next_lesson = get_next_lesson(course, lesson)

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
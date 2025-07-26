from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.core.validators import MinValueValidator
from decimal import Decimal

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name

class Course(models.Model):
    COURSE_TYPE_CHOICES = (
        ('free', 'Free'),
        ('paid', 'Paid'),
    )
    
    tutor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='courses_taught')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='courses')
    thumbnail = models.ImageField(upload_to='course_thumbnails/', blank=True, null=True)
    course_type = models.CharField(max_length=10, choices=COURSE_TYPE_CHOICES, default='free')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), 
                               validators=[MinValueValidator(Decimal('0.00'))])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
    def get_enrolled_students_count(self):
        return self.enrollments.count()
    
    def get_average_rating(self):
        reviews = self.reviews.all()
        if reviews:
            return sum([review.rating for review in reviews]) / len(reviews)
        return 0

class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Lesson(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    video_url = models.URLField(help_text="YouTube video URL")
    order = models.PositiveIntegerField(default=0)
    duration_minutes = models.PositiveIntegerField(default=0, help_text="Video duration in minutes")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"{self.module.title} - {self.title}"


    def get_youtube_embed_url(self):
        """Convert YouTube URL to embed format"""
        if not self.video_url:
            return None
            
        # Handle different YouTube URL formats
        if 'youtube.com/watch?v=' in self.video_url:
            video_id = self.video_url.split('v=')[1]
            # Remove any additional parameters
            if '&' in video_id:
                video_id = video_id.split('&')[0]
            return f'https://www.youtube.com/embed/{video_id}'
        elif 'youtu.be/' in self.video_url:
            video_id = self.video_url.split('youtu.be/')[1]
            # Remove any additional parameters
            if '?' in video_id:
                video_id = video_id.split('?')[0]
            return f'https://www.youtube.com/embed/{video_id}'
        elif 'youtube.com/embed/' in self.video_url:
            # Already in embed format
            return self.video_url
        
        # Return original URL if format not recognized
        return self.video_url


class Enrollment(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ['student', 'course']
        ordering = ['-enrolled_at']
    
    def __str__(self):
        return f"{self.student.username} enrolled in {self.course.title}"
    
    def get_progress_percentage(self):
        total_lessons = Lesson.objects.filter(module__course=self.course).count()
        if total_lessons == 0:
            return 0
        completed_lessons = self.progress_records.filter(completed=True).count()
        return int((completed_lessons / total_lessons) * 100)

class LessonProgress(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='progress_records')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ['enrollment', 'lesson']
    
    def __str__(self):
        return f"{self.enrollment.student.username} - {self.lesson.title}"

class Review(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['course', 'student']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.student.username} - {self.course.title} ({self.rating}/5)"
from django.contrib import admin
from .models import Category, Course, Module, Lesson, Enrollment, LessonProgress, Review

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'tutor', 'category', 'course_type', 'price', 'is_published', 'created_at']
    list_filter = ['course_type', 'is_published', 'category', 'created_at']
    search_fields = ['title', 'description', 'tutor__username']
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'created_at']
    list_filter = ['course', 'created_at']
    search_fields = ['title', 'course__title']

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'module', 'order', 'duration_minutes', 'created_at']
    list_filter = ['module__course', 'created_at']
    search_fields = ['title', 'module__title', 'module__course__title']

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'enrolled_at', 'completed']
    list_filter = ['completed', 'enrolled_at']
    search_fields = ['student__username', 'course__title']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['student__username', 'course__title']
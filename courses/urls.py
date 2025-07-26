from django.urls import path
from . import views

app_name = 'courses'

urlpatterns = [
    path('', views.home, name='home'),
    path('courses/', views.course_list, name='course_list'),
    path('course/<slug:slug>/', views.course_detail, name='course_detail'),
    path('dashboard/', views.dashboard, name='dashboard'),
    
    # Course management URLs
    path('create-course/', views.create_course, name='create_course'),
    path('course/<slug:slug>/edit/', views.edit_course, name='edit_course'),
    path('course/<slug:slug>/manage/', views.manage_course_content, name='manage_course_content'),
    path('course/<slug:slug>/delete/', views.delete_course, name='delete_course'),
    path('course/<slug:slug>/publish/', views.publish_course, name='publish_course'),
    
    # Module management URLs
    path('course/<slug:slug>/add-module/', views.add_module, name='add_module'),
    path('course/<slug:slug>/module/<int:module_id>/edit/', views.edit_module, name='edit_module'),
    
    # Lesson management URLs
    path('course/<slug:slug>/module/<int:module_id>/add-lesson/', views.add_lesson, name='add_lesson'),
    path('course/<slug:slug>/lesson/<int:lesson_id>/edit/', views.edit_lesson, name='edit_lesson'),
    
    # Enrollment URLs
    path('course/<slug:slug>/enroll-free/', views.enroll_free_course, name='enroll_free_course'),

    # Learning URLs
    path('course/<slug:slug>/learn/', views.learn_course, name='learn_course'),
    path('course/<slug:slug>/lesson/<int:lesson_id>/', views.view_lesson, name='view_lesson'),

    # Review URLs
    path('course/<slug:slug>/review/', views.add_review, name='add_review'),
]
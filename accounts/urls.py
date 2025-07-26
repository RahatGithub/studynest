from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('login/', views.CustomLoginView.as_view(), name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('signup/student/', views.signup_student, name='signup_student'),
    path('signup/tutor/', views.signup_tutor, name='signup_tutor'),
]
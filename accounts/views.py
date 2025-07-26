from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.views import LoginView
from django.contrib import messages
from django.urls import reverse_lazy
from .forms import StudentSignUpForm, TutorSignUpForm

class CustomLoginView(LoginView):
    template_name = 'accounts/login.html'
    redirect_authenticated_user = True
    
    def get_success_url(self):
        return reverse_lazy('courses:dashboard')
    
    def form_invalid(self, form):
        messages.error(self.request, 'Invalid username or password.')
        return super().form_invalid(form)

def signup_student(request):
    if request.user.is_authenticated:
        return redirect('courses:dashboard')
    
    if request.method == 'POST':
        form = StudentSignUpForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Welcome to StudyNest! Start exploring courses.')
            return redirect('courses:dashboard')
    else:
        form = StudentSignUpForm()
    
    return render(request, 'accounts/signup_student.html', {'form': form})

def signup_tutor(request):
    if request.user.is_authenticated:
        return redirect('courses:dashboard')
    
    if request.method == 'POST':
        form = TutorSignUpForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Welcome to StudyNest! You can now create courses.')
            return redirect('courses:dashboard')
    else:
        form = TutorSignUpForm()
    
    return render(request, 'accounts/signup_tutor.html', {'form': form})

def logout_view(request):
    logout(request)
    messages.info(request, 'You have been logged out successfully.')
    return redirect('courses:home')
from django import forms
from .models import Course, Module, Lesson, Review

class CourseForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = ['title', 'description', 'category', 'course_type', 'price', 'thumbnail']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter course title'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 5,
                'placeholder': 'Describe what students will learn in this course'
            }),
            'category': forms.Select(attrs={
                'class': 'form-select'
            }),
            'course_type': forms.Select(attrs={
                'class': 'form-select',
                'id': 'course-type'
            }),
            'price': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': '0',
                'step': '0.01',
                'placeholder': '0.00'
            }),
            'thumbnail': forms.FileInput(attrs={
                'class': 'form-control'
            })
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['price'].required = False
        
    def clean(self):
        cleaned_data = super().clean()
        course_type = cleaned_data.get('course_type')
        price = cleaned_data.get('price')
        
        if course_type == 'paid' and (not price or price <= 0):
            raise forms.ValidationError('Paid courses must have a price greater than 0')
        
        if course_type == 'free':
            cleaned_data['price'] = 0
            
        return cleaned_data

class ModuleForm(forms.ModelForm):
    class Meta:
        model = Module
        fields = ['title', 'description', 'order']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Module title'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Brief description of this module (optional)'
            }),
            'order': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': '0'
            })
        }

class LessonForm(forms.ModelForm):
    class Meta:
        model = Lesson
        fields = ['title', 'description', 'video_url', 'duration_minutes', 'order']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Lesson title'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'What will students learn in this lesson?'
            }),
            'video_url': forms.URLInput(attrs={
                'class': 'form-control',
                'placeholder': 'https://www.youtube.com/watch?v=...'
            }),
            'duration_minutes': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': '1',
                'placeholder': 'Duration in minutes'
            }),
            'order': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': '0'
            })
        }
    
    def clean_video_url(self):
        url = self.cleaned_data.get('video_url')
        if url and not ('youtube.com' in url or 'youtu.be' in url):
            raise forms.ValidationError('Please enter a valid YouTube URL')
        return url


class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['rating', 'comment']
        widgets = {
            'rating': forms.Select(attrs={
                'class': 'form-select'
            }),
            'comment': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'Share your experience with this course...'
            })
        }
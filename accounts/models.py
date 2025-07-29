from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('tutor', 'Tutor'),
    )
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    bio = models.TextField(blank=True, null=True)
    # profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    profile_picture = CloudinaryField('image', folder='profile_pictures', blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    def is_student(self):
        return self.role == 'student'
    
    def is_tutor(self):
        return self.role == 'tutor'
    
    class Meta:
        db_table = 'users' 
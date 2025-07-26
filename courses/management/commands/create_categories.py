from django.core.management.base import BaseCommand
from courses.models import Category

class Command(BaseCommand):
    help = 'Creates initial categories'

    def handle(self, *args, **kwargs):
        categories = [
            ('Programming', 'Learn various programming languages and frameworks'),
            ('Web Development', 'Master frontend and backend web technologies'),
            ('Data Science', 'Explore data analysis, machine learning, and AI'),
            ('Business', 'Business skills and entrepreneurship'),
            ('Design', 'Graphic design, UI/UX, and creative skills'),
            ('Marketing', 'Digital marketing, SEO, and social media'),
        ]
        
        for name, description in categories:
            Category.objects.get_or_create(
                name=name,
                defaults={'description': description}
            )
        
        self.stdout.write(self.style.SUCCESS('Successfully created categories'))
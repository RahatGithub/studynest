from django.core.management.base import BaseCommand
from django.core.management import call_command
import os
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Load initial data from fixtures'

    def handle(self, *args, **options):
        fixture_file = os.path.join(settings.BASE_DIR, 'initial_data.json')
        
        self.stdout.write(f'Looking for fixture file at: {fixture_file}')
        
        if os.path.exists(fixture_file):
            self.stdout.write('Fixture file found. Loading initial data...')
            
            # Check data before loading
            user_count_before = User.objects.count()
            self.stdout.write(f'Users before loading: {user_count_before}')
            
            try:
                call_command('loaddata', fixture_file, verbosity=2)
                
                # Check data after loading
                user_count_after = User.objects.count()
                self.stdout.write(f'Users after loading: {user_count_after}')
                
                self.stdout.write(self.style.SUCCESS('Successfully loaded initial data'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error loading data: {str(e)}'))
        else:
            self.stdout.write(self.style.WARNING(f'initial_data.json not found at {fixture_file}'))
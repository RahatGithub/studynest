from django.core.management.base import BaseCommand
from django.core.management import call_command
import os
from django.conf import settings

class Command(BaseCommand):
    help = 'Load initial data from fixtures'

    def handle(self, *args, **options):
        fixture_file = os.path.join(settings.BASE_DIR, 'initial_data.json')
        
        if os.path.exists(fixture_file):
            self.stdout.write('Loading initial data...')
            call_command('loaddata', fixture_file)
            self.stdout.write(self.style.SUCCESS('Successfully loaded initial data'))
        else:
            self.stdout.write(self.style.WARNING('initial_data.json not found'))
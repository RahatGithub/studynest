from django.core.management.base import BaseCommand
import cloudinary.uploader
import os
from django.conf import settings

class Command(BaseCommand):
    help = 'Upload media files to Cloudinary'

    def handle(self, *args, **options):
        media_root = os.path.join(settings.BASE_DIR, 'media')
        
        if not os.path.exists(media_root):
            self.stdout.write(self.style.WARNING('Media folder not found'))
            return
            
        self.stdout.write('Starting upload to Cloudinary...')
        uploaded_count = 0
        
        # Walk through all files in media directory
        for root, dirs, files in os.walk(media_root):
            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp')):
                    file_path = os.path.join(root, file)
                    relative_path = os.path.relpath(file_path, media_root)
                    
                    try:
                        # Upload to Cloudinary
                        result = cloudinary.uploader.upload(
                            file_path,
                            public_id=relative_path.replace('\\', '/').replace('.', '_'),
                            folder="studynest"
                        )
                        self.stdout.write(f'Uploaded: {relative_path}')
                        uploaded_count += 1
                        
                    except Exception as e:
                        self.stdout.write(
                            self.style.ERROR(f'Failed to upload {relative_path}: {str(e)}')
                        )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully uploaded {uploaded_count} images to Cloudinary')
        )
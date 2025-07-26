# StudyNest - E-Learning Platform

A Django-based e-learning platform that allows tutors to create and sell courses while students can enroll and track their progress.

## Features

- **User Authentication**: Separate registration for students and tutors
- **Course Management**: Tutors can create, edit, and manage courses with modules and lessons
- **Video Lessons**: YouTube integration for video content
- **Payment Processing**: Stripe integration for paid courses (sandbox mode)
- **Progress Tracking**: Students can track their learning progress
- **Course Reviews**: Students can rate and review courses
- **Search & Filter**: Browse courses by category, price, or search terms

## Tech Stack

- **Backend**: Django (Python)
- **Frontend**: HTML, CSS, Bootstrap 5
- **Database**: SQLite (development) / MySQL (production-ready)
- **Payment**: Stripe API
- **Video Hosting**: YouTube (embedded)

## Installation

1. Clone the repository
2. Create a virtual environment: `python -m venv venv`
3. Activate virtual environment: `venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Create `.env` file with your configuration
6. Run migrations: `python manage.py migrate`
7. Create superuser: `python manage.py createsuperuser`
8. Run server: `python manage.py runserver`

## Test Credentials

For Stripe payments, use test card: 4242 4242 4242 4242

## Notes

- Uses Stripe sandbox for payment demonstration
- Designed for easy migration to AWS S3 for video hosting
- Portfolio project demonstrating Django skills

## Future Enhancements

- Direct video uploads to AWS S3
- Certificate generation
- Discussion forums
- Live sessions
- Mobile app API
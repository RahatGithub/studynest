release: python manage.py migrate && python manage.py collectstatic --noinput
web: gunicorn studynest.wsgi:application
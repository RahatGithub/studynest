from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls', namespace='accounts')),
    path('payments/', include('payments.urls', namespace='payments')),
    path('', include('courses.urls', namespace='courses')),
]

# handling error responses
handler404 = 'courses.views.custom_404'
handler500 = 'courses.views.custom_500'

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
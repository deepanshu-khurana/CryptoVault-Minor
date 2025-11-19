from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

MEDIA_ROOT_ABSOLUTE = settings.MEDIA_ROOT

urlpatterns = [
    # 1. Admin Panel
    path('admin/', admin.site.urls),

    # 2. API Endpoints
    path('api/', include('api.urls')),
    path('api/v1/', include('api.urls')),

    # 3. Root path serves compiled index.html (so / loads React app)
    path('', TemplateView.as_view(template_name='index.html')),

    # 4. Media file serving (absolute MEDIA_ROOT, good for development/debug)
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': MEDIA_ROOT_ABSOLUTE}),

    # 5. React Router catch-all (for deep links like /login or any other frontend route)
    path('<path:resource>', TemplateView.as_view(template_name='index.html')),
    re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name='index.html')),
]

# CRITICAL: Serve media and static files in development mode
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
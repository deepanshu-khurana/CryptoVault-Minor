from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR is the 'backend' folder
BASE_DIR = Path(__file__).resolve().parent.parent
MEDIA_ROOT = BASE_DIR.parent / 'media' 
MEDIA_URL = '/media/'

# --- Path Calculation FIX ---
# Go up two levels to ProjectRoot/
PROJECT_ROOT = BASE_DIR.parent.parent

# The path to the built frontend files
FRONTEND_DIST_DIR = PROJECT_ROOT / 'final_minor_repo' / 'dist'

# 🛑 CRITICAL DEBUG STEP: Check the calculated path
print(f"\n--- DEBUG PATH CHECK ---")
print(f"Project Root (2 up): {PROJECT_ROOT}")
print(f"Frontend Dist Dir: {FRONTEND_DIST_DIR}")
print(f"------------------------\n")

# -------------------------------------------------------------
# 🎯 CORE CONFIGURATION
# -------------------------------------------------------------

SECRET_KEY = 'django-insecure-=b+@@!^crnxvo3#dx(bi_07w@(%3)onzqkffsdl&(-bzk+(3_5'
DEBUG = True
ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party Apps
    'rest_framework',
    'corsheaders', 
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    # Your Apps
    'users',
    'api',
]

# 🛑 CRITICAL DEBUG LINE
print(f"*** DEBUG MEDIA ROOT: {MEDIA_ROOT}")

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware', # MUST be placed high up
    'django.contrib.sessions.middleware.SessionMiddleware', 
    'django.middleware.common.CommonMiddleware', 
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

# -------------------------------------------------------------
# 🎯 TEMPLATES (Serving index.html)
# -------------------------------------------------------------

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        
        # This is where Django looks for index.html
        'DIRS': [FRONTEND_DIST_DIR], 
        
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# -------------------------------------------------------------
# 🎯 STATIC FILES (Serving CSS, JS, Images)
# -------------------------------------------------------------

STATIC_URL = '/static/'

# STATICFILES_DIRS must also point to the 'dist' folder
STATICFILES_DIRS = [
    FRONTEND_DIST_DIR,
]

# -------------------------------------------------------------
# 🎯 DRF & CORS (unchanged)
# -------------------------------------------------------------

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
        'rest_framework.permissions.IsAuthenticated',
    )
}

CORS_ALLOWED_ORIGINS = [
    # Allow the frontend development server
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    
    # You should already have the backend's own loopback addresses here
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

# -------------------------------------------------------------
# 🎯 DATABASE & DEFAULTS (unchanged)
# -------------------------------------------------------------

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# -------------------------------------------------------------
# 🎯 SIMPLE JWT SETTINGS
# -------------------------------------------------------------

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

# -------------------------------------------------------------
# 🛑 MEDIA FILES SERVING
# -------------------------------------------------------------

# During development, ensure Django serves media files
if DEBUG:
    from django.conf.urls.static import static
    urlpatterns = []
    urlpatterns += static(MEDIA_URL, document_root=MEDIA_ROOT)
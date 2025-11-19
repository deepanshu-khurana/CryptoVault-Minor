from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView # For refreshing tokens

urlpatterns = [
    # POST /api/v1/auth/register/
    path('register/', RegisterView.as_view(), name='auth_register'),
    
    # POST /api/v1/auth/login/ (Obtains token + logs user ID)
    path('login/', CustomTokenObtainPairView.as_view(), name='auth_login'),
    
    # POST /api/v1/auth/token/refresh/ (Gets new access token using refresh token)
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
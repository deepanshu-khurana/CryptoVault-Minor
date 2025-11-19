import os
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import RegisterSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

# Define the path to your log file (placed in the project's root directory)
# NOTE: BASE_DIR is two levels up from 'users/' in your structure.
LOGIN_LIST_FILE = os.path.join(settings.BASE_DIR.parent, 'login_list.txt')

# 1. Sign Up View (API Endpoint)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,) # Allow unauthenticated users to register
    serializer_class = RegisterSerializer

# 2. Login View (API Endpoint - Custom SimpleJWT implementation)
class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Overrides the default SimpleJWT login view to add the file logging logic.
    """
    def post(self, request, *args, **kwargs):
        # 1. Authenticate and get tokens via SimpleJWT
        response = super().post(request, *args, **kwargs)

        # 2. If authentication was successful (HTTP 200 OK)
        if response.status_code == status.HTTP_200_OK:
            # The 'username' field is typically the unique ID used for login
            user_id = request.data.get('username') 
            
            # --- YOUR SPECIAL FILE WRITING LOGIC ---
            try:
                # Write the user ID to the file in append mode ('a')
                with open(LOGIN_LIST_FILE, 'a') as f: 
                    f.write(f"{user_id}\n")
                print(f"User {user_id} successfully logged and recorded to file.")

            except IOError as e:
                # Handle file writing errors
                print(f"Error writing to login_list.txt: {e}")
            # --- END OF SPECIAL LOGIC ---
            response.data['username'] = user_id
        return response
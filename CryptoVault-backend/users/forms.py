from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import get_user_model

# Get the active User model (default or custom)
User = get_user_model() 

# 1. Form for Signup (Registration)
class CustomUserCreationForm(UserCreationForm):
    """
    A custom form for user creation that will handle signup.
    It inherits from Django's built-in UserCreationForm.
    """
    class Meta(UserCreationForm.Meta):
        model = User
        # Use 'email' as the field you collect for registration
        # If you are using the default User model, it's better to use 'username' 
        # as it's the required unique identifier. I'll use 'username' here 
        # to align with the default form setup.
        fields = ('username', 'email') 

# 2. Form for Login
class LoginForm(AuthenticationForm):
    """
    A custom form for login that simplifies handling authentication.
    It inherits from Django's built-in AuthenticationForm.
    """
    # No need to specify Meta or fields, as it automatically uses
    # 'username' and 'password' from the base class.
    pass
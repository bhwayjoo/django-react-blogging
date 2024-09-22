from django.contrib.auth.forms import UserChangeForm
from .models import CustomUser

class CustomUserCreationForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model=CustomUser
        fields={'email',}

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model=CustomUser
        fields={'email',}
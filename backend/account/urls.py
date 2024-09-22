from django.urls import path
from .views import (
    UserRegistrationAPIView,
    UserLoginAPIView,
    UserLogoutAPIView,
    UserInfoAPIView,
    RequestPasswordResetEmail,
    SetNewPasswordAPIView,
    EmailVerificationAPIView,
    ChangePasswordView,
    ChangeUsernameView,
    GoogleLoginView,
)

urlpatterns = [
    path('register/', UserRegistrationAPIView.as_view(), name='user_registration'),
    path('login/', UserLoginAPIView.as_view(), name='user_login'),
    path('logout/', UserLogoutAPIView.as_view(), name='logout'),
    path('userinfo/', UserInfoAPIView.as_view(), name='userinfo'),
    path('password/reset/', RequestPasswordResetEmail.as_view(), name='password_reset_request'),
    path('password/reset/confirm/<str:token>/', SetNewPasswordAPIView.as_view(), name='password_reset_confirm'),
    path('verifyEmail/<str:token>/', EmailVerificationAPIView.as_view(), name='email_verification'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('change-username/', ChangeUsernameView.as_view(), name='change_username'),
    path('google-login/', GoogleLoginView.as_view(), name='google_login'),
]


from django.shortcuts import get_object_or_404
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from .serializers import (
    EmailVerificationSerializer,
    PasswordResetRequestSerializer,
    SetNewPasswordSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer,
    CustomUserSerializer,ChangePasswordSerializer, ChangeUsernameSerializer
)
from .models import CustomUser, PasswordResetToken
from datetime import timedelta
from django.utils import timezone
import uuid
import os
from dotenv import load_dotenv
from google.oauth2 import id_token
from google.auth.transport import requests

load_dotenv()

class UserRegistrationAPIView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Send verification email
            verification_link = f"{os.getenv('FRONTEND_URL')}portfolio/verifyEmail/{user.email_verification_token}/"
            send_mail(
                'Verify your email',
                f'Please click the following link to verify your email and activate your account: {verification_link}',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )

            return Response({"success": "User registered. Please check your email to verify your account."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmailVerificationAPIView(APIView):
    def get(self, request, token):
        try:
            user = CustomUser.objects.get(email_verification_token=token)
            if not user.is_email_verified:
                user.is_email_verified = True
                user.is_active = True
                user.save()
                return Response({"success": "Email verified and account activated successfully."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Email already verified."}, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

class UserLoginAPIView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        except ValidationError as e:
            error_details = e.detail
            if isinstance(error_details, dict) and 'non_field_errors' in error_details:
                error_message = error_details['non_field_errors'][0]
            else:
                error_message = str(error_details)
            return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)

class UserLogoutAPIView(GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserInfoAPIView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomUserSerializer

    def get_object(self):
        user = self.request.user
        if user.role != 'userPortfolio':
            raise PermissionDenied({"error": "Access denied"})
        return user

class RequestPasswordResetEmail(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = CustomUser.objects.get(email=email)
                
                # Delete any existing tokens for this user
                PasswordResetToken.objects.filter(user=user).delete()
                
                # Create a new token
                expiration_time = timezone.now() + timedelta(hours=1)  # Token expires in 1 hour
                reset_token = PasswordResetToken.objects.create(
                    user=user,
                    token=uuid.uuid4(),
                    expires_at=expiration_time
                )
                
                reset_url = f"{os.getenv('FRONTEND_URL')}portfolio/resetPasswod/{reset_token.token}/"
                
                send_mail(
                    'Reset your password',
                    f'Use this link to reset your password: {reset_url}\nThis link will expire in 1 hour.',
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=False,
                )
                
                return Response({"success": "Password reset email has been sent."}, status=status.HTTP_200_OK)
            except CustomUser.DoesNotExist:
                return Response({"error": "No user is registered with this email address."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SetNewPasswordAPIView(APIView):
    def post(self, request, token):
        serializer = SetNewPasswordSerializer(data=request.data)
        if serializer.is_valid():
            try:
                reset_token = PasswordResetToken.objects.get(token=token)
                if not reset_token.is_valid():
                    return Response({"error": "The reset link has expired"}, status=status.HTTP_400_BAD_REQUEST)
                
                user = reset_token.user
                user.set_password(serializer.validated_data['password'])
                user.save()

                # Delete the used token
                reset_token.delete()

                return Response({"success": "Password has been reset successfully."}, status=status.HTTP_200_OK)
            except PasswordResetToken.DoesNotExist:
                return Response({"error": "The reset link is invalid"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.data.get('old_password')):
                user.set_password(serializer.data.get('new_password'))
                user.save()
                return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)
            return Response({'error': 'Incorrect old password.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangeUsernameView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangeUsernameSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.data.get('password')):
                new_username = serializer.data.get('new_username')
                if CustomUser.objects.filter(username=new_username).exists():
                    return Response({'error': 'This username is already taken.'}, status=status.HTTP_400_BAD_REQUEST)
                user.username = new_username
                user.save()
                return Response({'message': 'Username changed successfully.'}, status=status.HTTP_200_OK)
            return Response({'error': 'Incorrect password.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class GoogleLoginView(APIView):
    def post(self, request):
        token = request.data.get('token')
        try:
            # Verify the token
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), settings.GOOGLE_CLIENT_ID)

            # Get user info
            email = idinfo['email']
            name = idinfo.get('name', '')

            # Check if user exists, if not create a new one
            user, created = CustomUser.objects.get_or_create(email=email)
            if created:
                user.username = name
                user.is_active = True
                user.is_email_verified = True
                user.save()

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)

        except ValueError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
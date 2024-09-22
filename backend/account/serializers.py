from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser, PasswordResetToken

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = "__all__"

class UserRegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ("id", "username", "email", "password1", "password2", "role")
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        if CustomUser.objects.filter(email=attrs.get('email')).exists():
            raise serializers.ValidationError("Email is already in use!")

        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError("Passwords do not match!")

        password = attrs.get("password1", "")
        if len(password) < 8:
            raise serializers.ValidationError("Passwords must be at least 8 characters long!")

        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password1")
        validated_data.pop("password2")
        role = validated_data.get('role', 'blogger')
        user = CustomUser.objects.create_user(password=password, role=role, **validated_data)
        user.is_active = False  # Set user as inactive until email is verified
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("No account found with this email.")
        
        if not user.check_password(password):
            raise serializers.ValidationError("Incorrect password.")
        
        if not user.is_active:
            raise serializers.ValidationError("Account is not active. Please verify your email.")
        
        if not user.is_email_verified:
            raise serializers.ValidationError("Email is not verified. Please check your email for the verification link.")
        
        return user
class EmailVerificationSerializer(serializers.Serializer):
    token = serializers.UUIDField()

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user found with this email address.")
        return value

class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=8, max_length=68, write_only=True)

    def validate_password(self, value):
        # Add any additional password validation logic here if needed
        return value
    
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)

class ChangeUsernameSerializer(serializers.Serializer):
    new_username = serializers.CharField(required=True, min_length=3, max_length=150)
    password = serializers.CharField(required=True)
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth import get_user_model

from chat.models import Profile


User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    '''JWT serializer that also encodes given user id (default behavior)'''

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token


class UserRegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

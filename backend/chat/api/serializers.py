from rest_framework import serializers
from rest_framework.authtoken.models import Token

from chat.models import Chat, Message, Profile


class TokenSerializer(serializers.ModelSerializer):
    '''Serializer of the rest-auth`s token model with additional user_id field'''

    class Meta:
        model = Token
        fields = ('key', 'user')


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        exclude = ('user', 'friend_list')


class MessageSerializer(serializers.ModelSerializer):
    '''Serializer of the chat.Message model with author field that returns full username rather than user_id'''
    author = serializers.CharField(source='author.username')

    class Meta:
        model = Message
        exclude = ('id',)


class ChatSerializer(serializers.ModelSerializer):
    '''Serializer of the chat.Chat model with last_message field that returns custom represantation of the chat.Message model'''
    last_message = MessageSerializer(many=False, read_only=True)

    class Meta:
        model = Chat
        fields = ('id', 'participant_list', 'last_message')
        read_only = ('id',)

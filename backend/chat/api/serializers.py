from rest_framework import serializers
from rest_framework.authtoken.models import Token

from chat.models import Chat, Message, Profile


class TokenSerializer(serializers.ModelSerializer):
    '''Serializer of the rest-auth`s token model with additional user_id field'''

    class Meta:
        model = Token
        fields = ('key', 'user')


class ParticipantListSerializer(serializers.ModelSerializer):
    '''chat.Profile serializer for ChatDetailSerializer.participant_list'''

    class Meta:
        model = Profile
        exclude = ('user', 'friend_list')


class ProfileSerializerForLastMessage(serializers.ModelSerializer):
    '''chat.Profile serializer for LastMessageSerializer.author'''
    class Meta:
        model = Profile
        fields = ('username', 'avatar_url')


class MessageSerializer(serializers.ModelSerializer):
    '''chat.Message serializer for ChatDetailSerializer.message_list'''
    author = serializers.CharField(source='author.username')

    class Meta:
        model = Message
        exclude = ('chat',)


class LastMessageSerializer(serializers.ModelSerializer):
    '''chat.Message serializer for ChatSerializer.last_message'''
    author = ProfileSerializerForLastMessage(many=False, read_only=True)

    class Meta:
        model = Message
        exclude = ('chat',)


class ChatSerializer(serializers.ModelSerializer):
    '''Serializer of the chat.Chat model with last_message field that returns custom represantation of the chat.Message model'''
    last_message = LastMessageSerializer(many=False, read_only=True)

    class Meta:
        model = Chat
        fields = ('id', 'participant_list', 'last_message')
        read_only = ('id',)


class ChatDetailSerializer(serializers.ModelSerializer):
    message_list = MessageSerializer(many=True, read_only=True)
    participant_list = ParticipantListSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ('participant_list', 'message_list')


class MainProfileSerializer(serializers.ModelSerializer):
    chat_list = ChatSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = ('avatar_url', 'profile_description', 'chat_list')

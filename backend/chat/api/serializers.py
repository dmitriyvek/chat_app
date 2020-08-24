from rest_framework import serializers
from rest_framework.authtoken.models import Token

from chat.models import Chat, Message


class TokenSerializer(serializers.ModelSerializer):

    class Meta:
        model = Token
        fields = ('key', 'user')


class MessageSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username')

    class Meta:
        model = Message
        exclude = ('id',)


class ChatSerializer(serializers.ModelSerializer):
    last_message = MessageSerializer(many=False, read_only=True)

    class Meta:
        model = Chat
        fields = ('id', 'participant_list', 'last_message')
        read_only = ('id',)




from rest_framework import serializers

from chat.models import Chat, Message


class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        exclude = ('id',)


class ChatSerializer(serializers.ModelSerializer):
    last_message = MessageSerializer(many=False, read_only=True)

    class Meta:
        model = Chat
        fields = ('id', 'participant_list', 'last_message')
        read_only = ('id',)


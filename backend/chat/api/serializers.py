from rest_framework import serializers

from chat.models import Chat, Message


class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        exclude = ('id',)


class ChatSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ('id', 'participant_list', 'last_message')
        read_only = ('id',)

    def get_last_message(self, obj):
        return MessageSerializer(obj.message_list.last()).data

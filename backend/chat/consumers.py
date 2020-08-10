import json
from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from .models import Message

User = get_user_model()


class ChatConsumer(WebsocketConsumer):

    def fetch_message_list(self, data):
        massage_list = Message.objects.all()
        content = {
            'command': 'message_list',
            'message_list': self.message_list_to_json(massage_list)
        }
        self.send_message(content)

    def new_message(self, data):
        message = Message.objects.create(
            content=data['message']
        )
        content = {
            'command': 'new_message',
            'message': self.message_to_json(message)
        }
        return self.send_chat_message(content)

    def message_list_to_json(self, message_list):
        result = []
        for message in message_list:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self, message):
        return {
            'content': message.content,
            'timestamp': str(message.timestamp)
        }

    COMMAND_LIST = {
        'fetch_message_list': fetch_message_list,
        'new_message': new_message
    }

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        self.COMMAND_LIST[data['command']](self, data)

    def send_chat_message(self, message):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))

import json
from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from .models import Message
from .services import get_current_chat_by_id, get_last_message_list_from_current_chat, get_profile_by_user_id

User = get_user_model()


class ChatConsumer(WebsocketConsumer):

    def fetch_message_list(self, data):
        message_list = get_last_message_list_from_current_chat(data['chatId'], 30)
        content = {
            'command': 'message_list',
            'message_list': self.message_list_to_json(message_list)
        }
        self.send_message(content)

    def new_message(self, data):
        author_profile = get_profile_by_user_id(data['authorId'])
        chat = get_current_chat_by_id(data['chatId'])
        message = Message.objects.create(
            author=author_profile,
            chat=chat,
            content=data['content']
        )
        chat.last_message = message
        chat.save()

        recipient_id = data['recipientId']
        content = {
            'command': 'new_message',
            'message': self.message_to_json(message)
        }
        self.send_chat_message(content, recipient_id)
        self.send_message(content)

    def message_list_to_json(self, message_list):
        result = []
        for message in message_list:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self, message):
        return {
            'id': message.id,  # for react list id
            'chat_id': message.chat.id,
            'author': message.author.username,
            'content': message.content,
            'timestamp': str(message.timestamp)
        }

    COMMAND_LIST = {
        'fetch_message_list': fetch_message_list,
        'new_message': new_message
    }

    def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.user_group_name = f'user_{self.user_id}'
        async_to_sync(self.channel_layer.group_add)(
            self.user_group_name,
            self.channel_name
        )
        # self.groups.append(self.user_group_name)
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.user_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        self.COMMAND_LIST[data['command']](self, data)

    def send_chat_message(self, message, recipient_id):
        async_to_sync(self.channel_layer.group_send)(
            f'user_{recipient_id}',
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

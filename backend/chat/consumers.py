import json
from django.shortcuts import get_object_or_404

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Message, Chat
from .services import get_current_chat_by_id, get_profile_by_user_id


class ChatConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def get_last_message_list_from_current_chat(self, chat_id, number_of_messages=30):
        # return list(get_object_or_404(Chat, id=chat_id).message_list.prefetch_related('author')[:number_of_messages])
        return list(get_object_or_404(Chat, id=chat_id).message_list.prefetch_related('author'))

    async def fetch_message_list(self, data):
        message_list = await self.get_last_message_list_from_current_chat(data['chatId'], number_of_messages=30)
        content = {
            'command': 'message_list',
            'message_list': self.message_list_to_json(message_list)
        }
        await self.send_message(content)

    @database_sync_to_async
    def create_new_message(self, data):
        author_profile = get_profile_by_user_id(data['authorId'])
        chat = get_current_chat_by_id(data['chatId'])
        message = Message.objects.create(
            author=author_profile,
            chat=chat,
            content=data['content']
        )
        chat.last_message = message
        chat.save()

        return message

    async def new_message(self, data):
        message = await self.create_new_message(data)

        recipient_id = data['recipientId']
        content = {
            'command': 'new_message',
            'message': self.message_to_json(message)
        }
        await self.send_chat_message(content, recipient_id)
        await self.send_message(content)

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

    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.user_group_name = f'user_{self.user_id}'
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )
        # await self.groups.append(self.user_group_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.user_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.COMMAND_LIST[data['command']](self, data)


    async def send_chat_message(self, message, recipient_id):
        await self.channel_layer.group_send(
            f'user_{recipient_id}',
            {
                'type': 'chat_message',
                'message': message
            }
        )

    async def send_message(self, message):
        await self.send(text_data=json.dumps(message))

    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))

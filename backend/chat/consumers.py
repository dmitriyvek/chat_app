from typing import List, Dict, Union
import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .services import create_and_return_new_message, get_last_messages_from_current_chat, message_to_json, message_list_to_json
from .wrappers import generic_error_handling_wrapper, wrapp_all_methods
from .loggers import get_main_logger


logger = get_main_logger()


@wrapp_all_methods(generic_error_handling_wrapper(logger))
class ChatConsumer(AsyncWebsocketConsumer):
    '''Main consumer (websocket requests handler) that can return all messages from given chat or handle new message creation'''

    async def fetch_message_list(self, data: Dict[str, str]) -> None:
        '''Handle message list fetching (getting messages in given chat and send it to client)'''
        message_list = await database_sync_to_async(get_last_messages_from_current_chat)(data['chatId'], number_of_messages=30)
        content = {
            'command': 'message_list',
            'message_list': message_list_to_json(message_list)
        }
        await self.send_message(content)

    async def new_message(self, data: Dict['str', Union[str, int]]) -> None:
        '''Handle new message creation and sending it to client and all participants in given chat'''
        message = await database_sync_to_async(create_and_return_new_message)(data)

        recipient_id = data['recipientId']
        content = {
            'command': 'new_message',
            'message': message_to_json(message)
        }
        await self.send_chat_message(content, recipient_id)
        await self.send_message(content)

    COMMAND_LIST = {
        'fetch_message_list': fetch_message_list,
        'new_message': new_message
    }

    async def connect(self) -> None:
        '''Open a connection with the client'''
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.user_group_name = f'user_{self.user_id}'
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )
        # await self.groups.append(self.user_group_name)
        await self.accept()

    async def disconnect(self, close_code: int) -> None:
        '''Close the connection with the client'''
        await self.channel_layer.group_discard(
            self.user_group_name,
            self.channel_name
        )

    async def receive(self, text_data: str) -> None:
        '''Handle every request from client'''
        data = json.loads(text_data)
        await self.COMMAND_LIST[data['command']](self, data)

    async def send_chat_message(self, message: Dict, recipient_id: int) -> None:
        '''Sending a new message to all chat participants except the client'''
        await self.channel_layer.group_send(
            f'user_{recipient_id}',
            {
                'type': 'chat_message',
                'message': message
            }
        )

    async def chat_message(self, event: Dict) -> None:
        '''Calling on send_chat_message call to actually send the data to all chat participants'''
        message = event['message']
        await self.send(text_data=json.dumps(message))

    async def send_message(self, message: Dict) -> None:
        '''Sending a message or message_list only to client'''
        await self.send(text_data=json.dumps(message))

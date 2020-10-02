from typing import List, Dict, Union
import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .services import create_and_return_new_message, message_to_json, message_list_to_json, get_user_avatar_url, create_and_return_new_chat, chat_to_json, get_user_id_by_token
from .wrappers import generic_error_handling_wrapper, wrapp_all_methods
from .loggers import get_main_logger


logger = get_main_logger()


@wrapp_all_methods(generic_error_handling_wrapper(logger))
class ChatConsumer(AsyncWebsocketConsumer):
    '''Main consumer (websocket requests handler) that can return all messages from given chat or handle new message creation'''

    async def new_message(self, data: Dict['str', Union[str, int]]) -> None:
        '''Handle new message creation and sending it to client and all participants in given chat'''
        message = await database_sync_to_async(create_and_return_new_message)(data)

        content = {
            'command': 'new_message',
            'data': {
                'message': message_to_json(message),
                'author_avatar_url': await database_sync_to_async(get_user_avatar_url)(user_id=data['authorId'])
            }
        }
        await self.send_data_to_companions(content, recipient_id=data['recipientId'])
        await self.send_data_to_client(content)

    async def new_chat(self, data: Dict['str', Union[str, int]]) -> None:
        '''Handle new chat creation and sending it to client and all participants in given chat'''
        chat = await database_sync_to_async(create_and_return_new_chat)(data)

        content = {
            'command': 'new_chat',
            'data': {
                **chat_to_json(chat),
                'participant_list': [data['userId'], data['recipientId']]
            },
        }
        await self.send_data_to_companions(content, recipient_id=data['recipientId'])
        await self.send_data_to_client(content)

    COMMAND_LIST = {
        'new_message': new_message,
        'new_chat': new_chat,
    }

    async def connect(self) -> None:
        '''Open a connection with the client'''
        token = self.scope['url_route']['kwargs']['token']
        self.user_id = await database_sync_to_async(get_user_id_by_token)(token=str(token))
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

    async def send_data_to_companions(self, data: Dict, recipient_id: int) -> None:
        '''Sending a new data to all chat participants except the client'''
        await self.channel_layer.group_send(
            f'user_{recipient_id}',
            {
                'type': 'send_new_data',
                'data': data
            }
        )

    async def send_new_data(self, event: Dict) -> None:
        '''Calling on send_data call to actually send the data to all chat participants'''
        data = event['data']
        await self.send(text_data=json.dumps(data))

    async def send_data_to_client(self, data: Dict) -> None:
        '''Sending a data only to client'''
        await self.send(text_data=json.dumps(data))

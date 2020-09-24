from typing import List, Dict, Union

from django.shortcuts import get_object_or_404

from .models import Chat, Profile, Message


def message_to_json(message: Message) -> Dict[str, Union[str, int]]:
    '''Return dict represantation from chat.Message instanse'''
    return {
        'id': message.id,  # for react list id
        'chat_id': message.chat.id,
        'author': message.author.username,
        'content': message.content,
        'timestamp': str(message.timestamp)
    }


def message_list_to_json(message_list: List[Message]) -> List[Dict[str, str]]:
    '''Return list of dict represantations from list of chat.Message instanses'''
    result = []
    for message in message_list:
        result.append(message_to_json(message))
    return result


def create_and_return_new_message(data: Dict['str', Union[str, int]]) -> Message:
    '''Create and return new chat.Message instanse associated with given chat.Chat and chat.Profile'''
    author_profile = get_object_or_404(Profile, id=data['authorId'])
    chat = get_object_or_404(Chat, id=data['chatId'])
    message = Message.objects.create(
        author=author_profile,
        chat=chat,
        content=data['content']
    )
    chat.last_message = message
    chat.save()

    return message


def get_friend_list_of_given_user(user_id: int, number_of_profiles: Union[int, None] = None):
    '''Returns given amount of friend`s profiles of given user'''
    if number_of_profiles:
        return get_object_or_404(Profile, id=user_id).friend_list.all()[:number_of_profiles]
    return get_object_or_404(Profile, id=user_id).friend_list.all()

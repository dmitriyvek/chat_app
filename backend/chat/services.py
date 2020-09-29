from typing import List, Dict, Union, Any

from django.shortcuts import get_object_or_404

from .models import Chat, Profile, Message


def message_to_json(message: Message) -> Dict[str, Union[str, int]]:
    '''Return dict represantation of chat.Message instanse'''
    return {
        'id': message.id,  # for react list id
        'chat_id': message.chat.id,
        'author': message.author.id,
        'author_username': message.author.username,
        'content': message.content,
        'timestamp': str(message.timestamp)
    }


def chat_to_json(chat: Chat) -> Dict[str, Any]:
    '''Return dict represantation of chat.Chat instanse'''
    return {
        'id': chat.id,
        'last_message': {
            'author': {
                'username': chat.last_message.author.username,
                'avatar_url': chat.last_message.author.avatar_url,
            },
            'content': chat.last_message.content,
            'timestamp': chat.last_message.timestamp.isoformat(),
            'is_service': True,
        },
    }


def message_list_to_json(message_list: List[Message]) -> List[Dict[str, str]]:
    '''Return list of dict represantations of list of chat.Message instanses'''
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


def create_and_return_new_chat(data: Dict['str', Union[str, int]]) -> Chat:
    '''Create and return new chat.Chat instanse associated with given participants'''
    author_profile = get_object_or_404(Profile, pk=data['userId'])

    new_chat = Chat(created_by=author_profile)
    new_chat.save()

    service_start_chat_message = Message(
        author=author_profile, chat=new_chat, content=f'chat started by: {author_profile.username}', is_service=True)
    service_start_chat_message.save()

    new_chat.last_message = service_start_chat_message
    new_chat.save()
    new_chat.participant_list.add(data['userId'], data['recipientId'])

    return new_chat


def get_friend_list_of_given_user(user_id: int, number_of_profiles: Union[int, None] = None) -> Profile:
    '''Returns given amount of friend`s profiles of given user'''
    if number_of_profiles:
        return get_object_or_404(Profile, id=user_id).friend_list.all()[:number_of_profiles]
    return get_object_or_404(Profile, id=user_id).friend_list.all()


def get_user_avatar_url(user_id: int) -> str:
    '''Returns avatar url of given user'''
    return str(get_object_or_404(Profile, id=user_id).avatar_url)

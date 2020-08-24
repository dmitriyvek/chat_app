from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from .models import Chat, Profile


User = get_user_model()


def get_last_message_list_from_current_chat(chat_id, number_of_messages=30):
    chat = get_object_or_404(Chat, id=chat_id)
    # return chat.message_list.prefetch_related('author')[:number_of_messages]
    return chat.message_list.prefetch_related('author')


def get_profile_by_user_id(user_id):
    return get_object_or_404(Profile, id=user_id)


def get_current_chat_by_id(chat_id):
    return get_object_or_404(Chat, id=chat_id)

from django.shortcuts import get_object_or_404

from .models import Chat, Profile


def get_last_message_list_from_current_chat(chat_id, number_of_messages=30):
    # return chat.message_list.prefetch_related('author')[:number_of_messages]
    return get_object_or_404(Chat, id=chat_id).message_list.prefetch_related('author')


def get_profile_by_user_id(user_id):
    return get_object_or_404(Profile, id=user_id)


def get_current_chat_by_id(chat_id):
    return get_object_or_404(Chat, id=chat_id)

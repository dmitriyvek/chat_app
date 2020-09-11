from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions

from chat.models import Chat, Message, Profile
from .serializers import ChatSerializer, MessageSerializer, ProfileSerializer
from chat.services import get_last_messages_from_current_chat, get_friend_list_of_given_user


class FriendListViewSet(ModelViewSet):
    '''A ViewSet that returns profiles of friends of given (from url parameter) user'''
    model = Profile
    serializer_class = ProfileSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return get_friend_list_of_given_user(user_id)


class MessageViewSet(ModelViewSet):
    '''A ViewSet that represent all messages related with the given (from url parameter) chat'''
    model = Message
    serializer_class = MessageSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        chat_id = self.request.query_params.get('chat_id', None)
        if chat_id:
            return get_last_messages_from_current_chat(chat_id, number_of_messages=30)


class ChatViewSet(ModelViewSet):
    '''A ViewSet that represent all chats related with the given (from url parameter) user'''
    model = Chat
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            profile = get_object_or_404(Profile, id=user_id)
            return profile.chat_list.select_related('last_message__author').prefetch_related('participant_list')


# Project.objects.filter(
#     is_main_section=True
#     ).select_related(
#         'project_group'
#     ).prefetch_related(
#         Prefetch(
#             'project_group__project_set',
#             queryset=Project.objects.prefetch_related(
#                 Prefetch(
#                     'projectmember_set',
#                     to_attr='projectmember_list'
#                 )
#             ),
#             to_attr='project_list'
#         )
#     )

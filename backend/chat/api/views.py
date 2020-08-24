from django.db.models import Prefetch
from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions

from chat.models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from chat.services import get_profile_by_user_id, get_last_message_list_from_current_chat


class MessageViewSet(ModelViewSet):
    model = Message
    serializer_class = MessageSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        chat_id = self.request.query_params.get('chat_id', None)
        if chat_id:
            return get_last_message_list_from_current_chat(chat_id, 30)


class ChatViewSet(ModelViewSet):
    model = Chat
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            profile = get_profile_by_user_id(user_id)
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

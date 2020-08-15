from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions

from chat.models import Chat
from .serializers import ChatSerializer
from chat.services import get_profile_by_username


class ChatViewSet(ModelViewSet):
    model = Chat
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        if username:
            profile = get_profile_by_username(username)
            return profile.chat_list.prefetch_related('participant_list')

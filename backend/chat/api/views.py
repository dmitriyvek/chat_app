from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions

from chat.models import Chat
from .serializers import ChatSerializer
from chat.services import get_profile_by_user_id


class ChatViewSet(ModelViewSet):
    model = Chat
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        user_id = self.request.user.id
        profile = get_profile_by_user_id(user_id)
        return profile.chat_list.prefetch_related('participant_list')

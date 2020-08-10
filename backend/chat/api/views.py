from rest_framework.viewsets import ModelViewSet

from chat.models import Message
from .serializers import MessageSerializer


class MessageViewSet(ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

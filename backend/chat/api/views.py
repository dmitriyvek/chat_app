from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveAPIView, CreateAPIView, ListAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions

from chat.models import Chat, Message, Profile
from .serializers import ChatSerializer, MessageSerializer, ParticipantListSerializer, ChatDetailSerializer, MainProfileSerializer
from chat.services import get_friend_list_of_given_user


class FriendListView(ListAPIView):
    '''A ListView that returns profiles of friends of requested user'''
    model = Profile
    serializer_class = ParticipantListSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        user_id = self.request.user.id
        if user_id:
            return get_friend_list_of_given_user(user_id)


class ChatDetailView(RetrieveAPIView):
    model = Chat
    serializer_class = ChatDetailSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        user_id = self.request.user.id
        return Chat.objects.filter(participant_list=user_id).prefetch_related('message_list__author')


class ChatCreateView(CreateAPIView):
    model = Chat
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated, )


class ProfileDetailView(RetrieveAPIView):
    model = Profile
    serializer_class = MainProfileSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        user_id = self.request.user.id
        return Profile.objects.filter(pk=user_id).prefetch_related('chat_list__last_message__author')

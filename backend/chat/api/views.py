from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveAPIView, CreateAPIView, ListAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions

from chat.models import Chat, Message, Profile
from .serializers import MessageSerializer, ParticipantListSerializer, InitialChatDetailSerializer, CommonChatDetailSerializer, MainProfileSerializer
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
    permission_classes = (permissions.IsAuthenticated, )

    def get_serializer_class(self):
        last_message_index = int(
            self.request.query_params.get('last_message_index', 0))
        if last_message_index == 0:
            return InitialChatDetailSerializer
        return CommonChatDetailSerializer

    def get_queryset(self):
        user_id = self.request.user.id
        return Chat.objects.filter(participant_list=user_id)

    def get_serializer_context(self):
        # context = super().get_serializer_context()
        # context.update({'user_id': self.request.user.id})

        return {
            'user_id': self.request.user.id,
            'last_message_index': int(
                self.request.query_params.get('last_message_index', 0)),
        }


class ProfileDetailView(RetrieveAPIView):
    model = Profile
    serializer_class = MainProfileSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        user_id = self.request.user.id
        return Profile.objects.filter(pk=user_id).prefetch_related(
            'chat_list__last_message__author')

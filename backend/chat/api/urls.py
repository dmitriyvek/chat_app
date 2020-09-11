from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ChatViewSet, MessageViewSet, FriendListViewSet

router = DefaultRouter()
router.register('chats', ChatViewSet, 'chat')
router.register('messages', MessageViewSet, 'message')
router.register('friends', FriendListViewSet, 'friend')

app_name = 'chat'
urlpatterns = [
    path('', include(router.urls)),
]

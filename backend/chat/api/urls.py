from django.urls import path, include

from .views import ChatDetailView, ProfileDetailView, FriendListView


app_name = 'chat'
urlpatterns = [
    path('chats/<int:pk>', ChatDetailView.as_view(), name='chat_detail'),
    path('profile/<int:pk>/', ProfileDetailView.as_view(), name='profile_detail'),
    path('friends/', FriendListView.as_view(), name='friend_list'),
]

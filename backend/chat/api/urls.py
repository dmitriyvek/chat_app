from django.urls import path, include

from .views import ChatDetailView, ChatCreateView, ProfileDetailView, FriendListView


app_name = 'chat'
urlpatterns = [
    path('chats/<int:pk>/', ChatDetailView.as_view()),
    path('chats/create/', ChatCreateView.as_view()),
    path('profile/<int:pk>/', ProfileDetailView.as_view()),
    path('friends/', FriendListView.as_view()),
]

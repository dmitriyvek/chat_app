from django.urls import path

from . import views


urlpatterns = [
    path('<str:chat_id>/', views.chat, name='chat'),
]

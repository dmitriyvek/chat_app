from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ChatViewSet

router = DefaultRouter()
router.register('chats', ChatViewSet, 'chat')

app_name = 'chat'
urlpatterns = [
    path('', include(router.urls)),
]

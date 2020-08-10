from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import MessageViewSet

router = DefaultRouter()
router.register('messages', MessageViewSet)

app_name = 'chat'
urlpatterns = [
    path('', include(router.urls)),
]

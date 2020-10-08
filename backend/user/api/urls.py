from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

from .views import UserRegistrationView, CustomTokenObtainPairView


app_name = 'user'
urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/', UserRegistrationView.as_view(), name='signup'),
]

from django.conf import settings
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title='Chat API',
        default_version='0.0.1',
        description='API for my chat applicaion',
        contact=openapi.Contact(email='dmitriyvek@mail.ru'),
        license=openapi.License(name='MIT License'),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # re_path(r'^swagger(?P<format>\.json|\.yaml)$',
    #         schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger',
                                         cache_timeout=0), name='schema-swagger-ui'),
    # path('redoc/', schema_view.with_ui('redoc',
    #                                    cache_timeout=0), name='schema-redoc'),
    path('admin/', admin.site.urls),
    # path('api-auth/', include('rest_framework.urls')),
    path('api-auth/', include('user.api.urls', namespace='user')),
    path('api/', include('chat.api.urls', namespace='chat')),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns

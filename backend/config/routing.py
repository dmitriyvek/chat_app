from channels.routing import ProtocolTypeRouter, URLRouter

import chat.routing
from chat.middlewares import TokenAuthMiddleware


application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': TokenAuthMiddleware(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})

from urllib.parse import parse_qs

from django.db import close_old_connections
from django.conf import settings
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


class TokenAuthMiddleware:
    '''Custom token auth middleware that add user_id in consumer`s scope'''

    def __init__(self, inner):
        # Store the ASGI application we were passed
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # Close old database connections to prevent usage of timed out connections
        await database_sync_to_async(close_old_connections)()
        token = parse_qs(scope["query_string"].decode("utf8"))[
            "token"][0]

        # Try to authenticate the user
        try:
            # This will automatically validate the token and raise an error if token is invalid
            token = UntypedToken(token)
            if token['token_type'] != 'access':
                raise InvalidToken
            user_id = token['sub']
            scope['user_id'] = user_id
        except (InvalidToken, TokenError) as e:
            raise e

        return await self.inner(scope, receive, send)

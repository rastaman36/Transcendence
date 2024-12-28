from django.contrib.auth.models import AnonymousUser
from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from urllib.parse import parse_qs
import requests

class   TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_string = scope['query_string'].decode('utf-8')
        query_dic = parse_qs(query_string)
        if 'token' in query_dic:
            token_key = query_dic['token'][0]
            res = requests.get('https://nginx/auth/verify/', headers={'Authorization': f'JWT {token_key}'}, verify=False)
            if (res.status_code != 200):
                scope['id'] = -1
                return await self.inner(scope, receive, send)
            user_id = res.json()['id']
            scope['id'] = user_id
        return await self.inner(scope, receive, send)

TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))
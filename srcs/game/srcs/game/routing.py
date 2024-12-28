from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'game/localgame/$', consumers.localGameConsumer.as_asgi()),
    re_path(r'game/game/$', consumers.PongConsumer.as_asgi()),
    re_path(r'game/localtournament/$', consumers.localTournamentConsumer.as_asgi()),
]
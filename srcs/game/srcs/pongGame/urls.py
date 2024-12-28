
from game.views import HealthCheckView
from django.urls import path

urlpatterns = [
    path('game/health/', HealthCheckView.as_view(), name='health_check'),
]

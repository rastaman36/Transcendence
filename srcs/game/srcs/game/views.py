from rest_framework import status
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.http import JsonResponse


class HealthCheckView(generics.RetrieveAPIView):
    permission_classes = (AllowAny,)
    http_method_names = ['get']
    
    def get(self, request):
        return JsonResponse({"status": "ok"}, status=status.HTTP_200_OK)
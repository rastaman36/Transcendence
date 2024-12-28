import os
import pyotp
import qrcode
from faker import Faker
from django.conf import settings
from rest_framework import status
from django.core import serializers
from rest_framework import generics
from django.http import JsonResponse
from django.contrib.auth import logout
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

class Enbale2FAView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    http_method_names = ['post']
    
    def post(self, request):
        user = request.user
        user.two_factor_enabled = True
        if not user.two_factor_secret:
            secret = pyotp.random_base32()
            user.two_factor_secret = secret
            user.save()
            totp = pyotp.TOTP(secret)
            provisioning_uri = totp.provisioning_uri(user.email, issuer_name="9oroch_APP")
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(provisioning_uri)
            qr.make(fit=True)
            img = qr.make_image(fill_color="black", back_color="white")
            qr_code_dir = os.path.join(settings.BASE_DIR, 'qrcodes')
            os.makedirs(qr_code_dir, exist_ok=True)
            qr_code_path = os.path.join(qr_code_dir, f'qr_code_{user.username}.png')
            img.save(qr_code_path, format="PNG")
            return JsonResponse({'qr_code_path': qr_code_path}, status=status.HTTP_200_OK)
        return JsonResponse({'error': 'QR code already exists'}, status=status.HTTP_400_BAD_REQUEST)

class Disable2FAView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    http_method_names = ['post']
    
    def post(self, request):
        user = request.user
        user.two_factor_enabled = False
        user.two_factor_secret = None
        user.save()
        return JsonResponse({'message': '2FA has been disabled successfully'}, status=status.HTTP_200_OK)

class Verify2FAView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    http_method_names = ['post']
    
    def post(self, request):
        user = request.user
        code = request.data.get('code')
        totp = pyotp.TOTP(user.two_factor_secret)
        if not code:
            return JsonResponse({'message': 'Please enter the 6-digit code'}, status=status.HTTP_400_BAD_REQUEST)
        if totp.verify(code):
            refresh = RefreshToken.for_user(user)
            return JsonResponse({'message': '2FA verification successful'}, status=status.HTTP_200_OK)
        return JsonResponse({'error': 'Invalid 2FA code'}, status=status.HTTP_401_UNAUTHORIZED)

class DeleteUserDataView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']
    
    def get(self, request):
        user = request.user
        for token in OutstandingToken.objects.filter(user=user):
            _, _ = BlacklistedToken.objects.get_or_create(token=token)
        user.delete()
        logout(request)
        return JsonResponse({'message': 'account deleted'}, status=status.HTTP_200_OK)

class DownloadUserDataView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']
    
    def get(self, request):
        user = request.user
        data = serializers.serialize('json', [user])
        response = JsonResponse(data, content_type='application/json', status=status.HTTP_200_OK, safe=False)
        response['Content-Disposition'] = f'attachment; filename="{user.username}_data.json"'
        return response

class AnonymizeUserDataView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    http_method_names = ['post']
    
    def post(self, request):
        fake = Faker()
        user = request.user
        user.email = fake.email()
        user.save()
        return JsonResponse({'message': 'Your data has been anonymized successfully'}, status=status.HTTP_200_OK)
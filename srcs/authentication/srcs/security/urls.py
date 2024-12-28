from django.urls import path
from .views import Enbale2FAView, Disable2FAView, Verify2FAView, DeleteUserDataView, DownloadUserDataView, AnonymizeUserDataView

urlpatterns = [
    path('2fa/enable/', Enbale2FAView.as_view(), name='enable-2fa'),
    path('2fa/disable/', Disable2FAView.as_view(), name='disable-2fa'),
    path('2fa/verify/', Verify2FAView.as_view(), name='verify-2fa'),
    path('delete/', DeleteUserDataView.as_view(), name='delete-user-data'),
    path('download/', DownloadUserDataView.as_view(), name='download-user-data'),
    path('anonymize/', AnonymizeUserDataView.as_view(), name='anonymize-user-data'),
] 

from django.urls import path, include

from rest_framework import routers

from .api.views import FileMetaViewSet, FileViewSet

app_name = 'file_management'

router = routers.DefaultRouter()
router.register('files', FileViewSet)
router.register('file-form', FileMetaViewSet)


urlpatterns = [
    path('api/', include(router.urls)),
]

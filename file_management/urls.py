
from django.urls import path, include

from rest_framework import routers

from .api.views import FileMetaViewSet, FileViewSet
from . import views

app_name = 'file_management'

router = routers.DefaultRouter()
router.register('files', FileViewSet)
router.register('file-form', FileMetaViewSet)


urlpatterns = [
    path(
        'api/',
        include(router.urls)
    ),
    path(
        '',
        views.index,
        name='index',
    ),
    path(
        'upload/',
        views.CustomTusUpload.as_view(),
        name='upload',
    ),
    path(
        'upload/<slug:resource_id>',
        views.CustomTusUpload.as_view(),
        name='tus_upload_chunks',
    ),

]

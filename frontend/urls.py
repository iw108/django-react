
from django.urls import path
from . import views

app_name = 'frontend'

urlpatterns = [
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


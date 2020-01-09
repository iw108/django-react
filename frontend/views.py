
from django.shortcuts import render

from django_file_form.views.tus import TusUpload


def index(request):
    return render(request, 'frontend/index.html')


class CustomTusUpload(TusUpload):

    def post(self, request, *args, **kwargs):
        upload_metadata = request.META.get("HTTP_UPLOAD_METADATA", None)
        print(upload_metadata)
        return super().post(request, *args, **kwargs)

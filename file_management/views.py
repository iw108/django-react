
from django.shortcuts import render

from django_file_form.views.tus import TusUpload


def index(request):
    return render(request, 'frontend/index.html')


class CustomTusUpload(TusUpload):

    def create_uploaded_file_in_db(self, field_name, file_id, form_id, original_filename, uploaded_file):
        return super().create_uploaded_file_in_db(field_name, file_id, form_id, original_filename, uploaded_file)
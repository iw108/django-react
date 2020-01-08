from django.shortcuts import render


def index(request):
    return render(request, 'frontend/index.html')


from django_file_form.views.tus import TusUpload


class CustomTusUpload(TusUpload):
    pass
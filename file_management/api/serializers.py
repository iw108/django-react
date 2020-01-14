
from django.core.exceptions import ObjectDoesNotExist

from rest_framework import serializers

from django_file_form.models import UploadedFile

from ..models import File, FileMeta


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = "__all__"


class FileMetaSerializer(serializers.ModelSerializer):

    def validate_form_id(self, value):
        form_id_exists = UploadedFile.objects.filter(form_id=value).exists()
        if not form_id_exists:
            raise serializers.ValidationError("Invalid form id provided")
        return value


    def validate(self, data):
        form_id = data.get('form_id')
        upload_count = data.get('upload_count')

        if form_id:
            expected_file_count = UploadedFile.objects.filter(form_id=form_id).count()
            if not expected_file_count == upload_count:
                raise serializers.ValidationError("Not correct")
        return data

    class Meta:
        model = FileMeta
        fields = "__all__"
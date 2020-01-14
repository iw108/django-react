
from uuid import uuid4

from django.db import models


class File(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid4,
        editable=False
    )

    upload = models.FileField(upload_to='uploads/%Y/%m/%d/')

    description = models.CharField(max_length=128)

    def __str__(self):
        return self.upload.name


class FileMeta(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid4,
        editable=False
    )

    form_id = models.UUIDField()

    description = models.CharField(max_length=128)

    upload_count = models.PositiveIntegerField()

    created = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return str(self.id)

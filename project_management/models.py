
from uuid import uuid4

from django.db import models


class Organization(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid4,
        editable=False
    )
    name = models.CharField(max_length=128)


class Project(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid4,
        editable=False
    )
    name = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

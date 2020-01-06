
from rest_framework import viewsets
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.views import APIView
from rest_framework.response import Response

from ..models import File, Organization, Project
from .serializers import FileSerializer, OrganizationSerializer, ProjectSerializer


class OrganizationViewSet(viewsets.ModelViewSet):

    serializer_class = OrganizationSerializer
    queryset = Organization.objects.all()


class ProjectViewSet(viewsets.ModelViewSet):

    serializer_class = ProjectSerializer
    queryset = Project.objects.all()


class FileViewSet(viewsets.ModelViewSet):

    parser_classes = (FormParser, MultiPartParser,)
    serializer_class = FileSerializer
    queryset = File.objects.all()



from rest_framework import viewsets

from ..models import Organization, Project
from .serializers import OrganizationSerializer, ProjectSerializer


class OrganizationViewSet(viewsets.ModelViewSet):

    serializer_class = OrganizationSerializer
    queryset = Organization.objects.all()


class ProjectViewSet(viewsets.ModelViewSet):

    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

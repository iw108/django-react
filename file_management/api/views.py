
from rest_framework import viewsets
from rest_framework.parsers import FormParser, MultiPartParser

from ..models import File, FileMeta
from .serializers import FileSerializer, FileMetaSerializer


class FileViewSet(viewsets.ModelViewSet):

    parser_classes = (FormParser, MultiPartParser,)
    serializer_class = FileSerializer
    queryset = File.objects.all()


class FileMetaViewSet(viewsets.ModelViewSet):

    serializer_class = FileMetaSerializer
    queryset = FileMeta.objects.all()


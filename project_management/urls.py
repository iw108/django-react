
from django.urls import path, include

from rest_framework import routers

from .api.views import OrganizationViewSet, ProjectViewSet


app_name = 'project_management'

router = routers.DefaultRouter()
router.register('organizations', OrganizationViewSet)
router.register('projects', ProjectViewSet)

urlpatterns = [
    path('api/', include(router.urls))
]

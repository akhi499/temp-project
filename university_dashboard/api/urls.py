# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, ProfessorViewSet

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'professors', ProfessorViewSet, basename='professor')
urlpatterns = [
    path('', include(router.urls)),
]
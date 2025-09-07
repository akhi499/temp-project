from django.shortcuts import render
# api/views.py
from rest_framework import viewsets
from .models import Student, Professor
from .serializers import StudentSerializer, ProfessorSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class ProfessorViewSet(viewsets.ModelViewSet):
    serializer_class = ProfessorSerializer

    def get_queryset(self):
        """
        This method defines the data that the viewset should manage.
        It also includes the filtering logic from our earlier step.
        """
        queryset = Professor.objects.all().prefetch_related('academics', 'publications')
        
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        #if start_date and end_date:
            #queryset = queryset.filter(
                #publications__publication_date__range=[start_date, end_date]
            #).distinct()
            
        return queryset
# Create your views here.

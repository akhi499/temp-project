# api/serializers.py
from rest_framework import serializers
from .models import Student, Professor, Academic, Publication

# We use nested serializers to show related data directly
class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = ['title', 'publication_type', 'publication_date', 'venue_name']

class AcademicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Academic
        fields = ['degree_type', 'university', 'year']

class ProfessorSerializer(serializers.ModelSerializer):
    # This tells the serializer to include the list of publications and academics
    publications = PublicationSerializer(many=True, read_only=True)
    academics = AcademicSerializer(many=True, read_only=True)

    class Meta:
        model = Professor
        fields = ['employee_code', 'name', 'email', 'department', 'academics', 'publications']

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__' # Include all fields
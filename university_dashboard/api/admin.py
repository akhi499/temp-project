# api/admin.py
from django.contrib import admin
from .models import Student, Professor, Academic, Publication

# This creates an inline editor for Publications
class PublicationInline(admin.TabularInline):
    model = Publication
    extra = 1 # Shows one extra blank row for adding a new publication

# This creates an inline editor for Academics
class AcademicInline(admin.TabularInline):
    model = Academic
    extra = 1 # Shows one extra blank row

# This defines the custom admin page for the Professor model
class ProfessorAdmin(admin.ModelAdmin):
    inlines = [AcademicInline, PublicationInline] # Adds the inlines to the page

# Register your models here. This is the crucial step.
admin.site.register(Student)
admin.site.register(Professor, ProfessorAdmin) # Use the custom ProfessorAdmin
admin.site.register(Academic)
admin.site.register(Publication)
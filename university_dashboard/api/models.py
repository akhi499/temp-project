from django.db import models

class Student(models.Model):
    roll_number = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    branch_code = models.CharField(max_length=10)

    def __str__(self):
        return self.name

class Professor(models.Model):
    employee_code = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Academic(models.Model):
    DEGREE_CHOICES = [('UG', 'Undergraduate'), ('PG', 'Postgraduate'), ('PHD', 'PhD')]
    professor = models.ForeignKey(Professor, related_name='academics', on_delete=models.CASCADE)
    degree_type = models.CharField(max_length=3, choices=DEGREE_CHOICES)
    university = models.CharField(max_length=150)
    year = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.professor.name} - {self.get_degree_type_display()}"

class Publication(models.Model):
    PUBLICATION_CHOICES = [('Journal', 'Journal'), ('Conference', 'Conference')]
    professor = models.ForeignKey(Professor, related_name='publications', on_delete=models.CASCADE)
    title = models.CharField(max_length=250)
    publication_type = models.CharField(max_length=10, choices=PUBLICATION_CHOICES)
    publication_date = models.DateField()
    venue_name = models.CharField(max_length=200) # e.g., "IEEE Transactions" or "NeurIPS 2024"

    def __str__(self):
        return self.title
# Create your models here.

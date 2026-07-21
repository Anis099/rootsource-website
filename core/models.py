from django.db import models


class Course(models.Model):
    CATEGORY_CHOICES = [
        ('IT', 'IT'),
        ('NON_IT', 'Non-IT'),
    ]

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='IT')
    tags = models.CharField(max_length=300, help_text="Comma-separated, e.g. Java, Spring Boot, SQL")
    icon = models.URLField(help_text="URL to course icon/logo image")
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    offer_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def tag_list(self):
        return [tag.strip() for tag in self.tags.split(',') if tag.strip()]


class Job(models.Model):
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    description = models.TextField()
    salary = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    posted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company}"


class Application(models.Model):
    APPLICATION_TYPE_CHOICES = [
        ('COURSE', 'Course Enrollment'),
        ('JOB', 'Job Application'),
        ('GENERAL', 'General Enquiry'),
    ]
    
    application_type = models.CharField(max_length=10, choices=APPLICATION_TYPE_CHOICES)
    course = models.ForeignKey(Course, null=True, blank=True, on_delete=models.SET_NULL)
    job = models.ForeignKey(Job, null=True, blank=True, on_delete=models.SET_NULL)

    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    college_or_degree = models.CharField(max_length=200, blank=True)
    address = models.CharField(max_length=300, blank=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)

    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.get_application_type_display()}"
from django.contrib import admin
from .models import Course, Job, Application


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'original_price', 'offer_price', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('title', 'tags')


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'location', 'is_active', 'posted_at')
    list_filter = ('is_active',)
    search_fields = ('title', 'company')


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('name', 'application_type', 'email', 'phone', 'submitted_at')
    list_filter = ('application_type', 'submitted_at')
    search_fields = ('name', 'email', 'phone')
    readonly_fields = ('submitted_at',)
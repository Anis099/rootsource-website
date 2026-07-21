from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('courses/', views.courses, name='courses'),
    path('placements/', views.placements, name='placements'),
    path('careers/', views.careers, name='careers'),
    path('contact/', views.contact, name='contact'),
    path('apply/', views.submit_application, name='submit_application'),
]
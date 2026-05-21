from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('projects/<slug:slug>/', views.project_detail, name='project_detail'),
    path('city/<int:city_id>/', views.city_chapter, name='city_chapter'),
    path('contact/', views.contact_submit, name='contact_submit'),
]

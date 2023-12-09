from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name="index"),
    path('login/', views.login_page, name="login"),
    path('logout/', views.logout_page, name="logout"),
    path('register/', views.register_page, name="register")
]
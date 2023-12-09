from django.urls import path
from . import views

urlpatterns = [
    path('get-tasks/<str:username>/', views.tasks_list, name="get-tasks"),
    path('create-task/<str:task_text>/<str:username>/', views.create_task, name="create-task"),
    path('edit-task/<str:task_id>/<str:task_text>/', views.edit_task, name="edit-task"),
    path('delete-task/<str:task_id>/', views.delete_task, name="delete-task"),
    path('finish-task/<str:task_id>/', views.finish_task, name="finish-task"),
    path('unfinish-task/<str:task_id>/', views.unfinish_task, name="unfinish-task")
]
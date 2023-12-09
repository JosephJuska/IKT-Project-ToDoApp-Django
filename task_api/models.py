from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class TaskModel(models.Model):
    task = models.TextField(name="task", max_length=100, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created = models.DateTimeField(name="created_at", auto_now_add=True)
    finished = models.BooleanField(name="finished", default=False)

    def __str__(self):
        return self.task
    
    class Meta:
        verbose_name_plural = "Tasks"
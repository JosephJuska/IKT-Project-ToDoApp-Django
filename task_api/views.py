from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import TaskModel
from .serializers import TaskSerializer
from django.contrib.auth.models import User
# Create your views here.

@api_view(['GET'])
def tasks_list(request, username):
    try:
        user_id = User.objects.get(username=username)
    
    except User.DoesNotExist:
        return Response([])
    
    tasks = TaskModel.objects.filter(user=user_id).order_by('-finished');
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def create_task(request, task_text, username):
    try:
        user_id = User.objects.get(username=username)
    
    except User.DoesNotExist:
        return Response({'success' : False, 'message' : 'User does not exist'})
    
    if len(task_text) > 100:
        return Response({'success' : False, 'message' : 'Task text is too long'})
    
    if len(task_text) <= 0:
        return Response({'success' : False, 'message' : 'Task text is empty'})
    
    task_count = TaskModel.objects.filter(user=user_id);
    if task_count.count() > 20:
        return Response({'success' : False, 'message' : 'You can\'t have more than 20 tasks'})
    
    new_task = TaskModel.objects.create(task=task_text, user=user_id)
    new_task.save()
    return Response({'success' : True})

@api_view(['GET'])
def edit_task(request, task_text, task_id):
    try:
        task = TaskModel.objects.get(id=task_id)
    
    except TaskModel.DoesNotExist:
        return Response({'success' : False, 'message' : 'Task does not exist'})
    
    if not task_text or len(task_text) == 0:
        return Response({'success' : False, 'message' : 'Task must be filled'})
    
    if len(task_text) > 100:
        return Response({'success' : False, 'message' : 'Task text is too long'})
    
    task.task = task_text
    task.save()
    return Response({'success' : True})

@api_view(['GET'])
def delete_task(request, task_id):
    try:
        task = TaskModel.objects.get(id=task_id)
    
    except TaskModel.DoesNotExist:
        return Response({'success' : False, 'message' : 'Task does not exist'})
    
    task.delete()
    return Response({'success' : True})

@api_view(['GET'])
def finish_task(request, task_id):
    try:
        task = TaskModel.objects.get(id=task_id)
    
    except TaskModel.DoesNotExist:
        return Response({'success' : False, 'message' : 'Task does not exist'})
    
    task.finished = True
    task.save()
    return Response({'success' : True})

@api_view(['GET'])
def unfinish_task(request, task_id):
    try:
        task = TaskModel.objects.get(id=task_id)
    
    except TaskModel.DoesNotExist:
        return Response({'success' : False, 'message' : 'Task does not exist'})
    
    task.finished = False
    task.save()
    return Response({'success' : True})
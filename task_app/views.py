from django.shortcuts import render, redirect, reverse
from django.contrib.auth import authenticate, login, logout
from .forms import RegisterForm
from django.contrib import messages

# Create your views here.
def main(request):
    content = {
        'is_auth' : request.user.is_authenticated,
        'username': request.user.username
    }
    return render(request, 'index.html', content)

def login_page(request):
    if request.user.is_authenticated:
        return redirect(reverse('index'))
    
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('index')

        else:
            messages.error(request, 'Invalid username or password')

    return render(request, 'login.html')

def register_page(request):
    if request.user.is_authenticated:
        return redirect(reverse('index'))
    
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data['username']
            messages.success(request, f'{username} has been created succesfully')
            return redirect('login')
    
    else:
        form = RegisterForm()
    
    return render(request, 'register.html', {'form' : form})

def logout_page(request):
    logout(request)
    return redirect('index')
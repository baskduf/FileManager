from django.shortcuts import render
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.http import JsonResponse
import json

# Create your views here.
def index(request):
    if request.user.is_authenticated:
        return render(request, 'index.html')
    else:
        return render(request, 'login.html')
    
def logout_process(request):
    logout(request)
    return redirect('/')

    

def signup_process(request):
    # POST 요청에서 데이터 추출
    if request.method == 'POST':
        username = request.POST['signup-username']
        password = request.POST['signup-password']
        email = request.POST['signup-email']

        # 간단한 유효성 검사
        if not (email and username and password):
            return JsonResponse({'success': False, 'message': '모든 필드를 입력해주세요.'}, status=400)

        
        # 사용자 생성
        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            return JsonResponse({'success': True, 'message': '회원가입이 완료되었습니다.'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'회원가입 중 오류가 발생했습니다: {str(e)}'}, status=500)
    

def login_process(request):
    if request.method == 'POST':
        try:
            username = request.POST['login-username']
            password = request.POST['login-password']
            # 로그인 처리 로직
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({'success': True, 'message': 'Logged in successfully'},status=200)
            else:
                return JsonResponse({'success': False, 'message': 'Invalid credentials'}, status=400)
        except KeyError as e:
            return JsonResponse({'success': False, 'message': f'Missing field: {e}'}, status=400)
    else:
        return JsonResponse({'success': False, 'message': 'POST 요청이 필요합니다'}, status=400)


def login_success(request):
    return render(request, 'login_success.html')
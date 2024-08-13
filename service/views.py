from django.shortcuts import render
import os
from google.cloud import storage
from django.shortcuts import redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google.cloud import storage
from django.conf import settings

os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="C:/Users/my/Desktop/FileManager/key.json"

def index(request):
    if request.user.is_authenticated:
        try:
            # Google Cloud Storage 클라이언트 설정
            storage_client = storage.Client()
            bucket = storage_client.bucket(settings.GS_BUCKET_NAME)
            
            # 버킷에서 객체 목록 가져오기
            blobs = list(bucket.list_blobs())
            
            # 객체 이름을 리스트로 변환
            object_names = [blob.name for blob in blobs]
            
            # 템플릿으로 객체 목록 전달
            return render(request, 'index.html', {'object_names': object_names})
        except Exception as e:
            # 오류 처리
            return render(request, 'index.html', {'error': str(e)})
    else:
        return render(request, 'login.html')
    
@csrf_exempt
def delete_file(request, file_name):
    if request.method == 'DELETE':
        if request.user.is_authenticated:
            if request.user.is_superuser:
                try:
                    # Google Cloud Storage 클라이언트 설정
                    storage_client = storage.Client()
                    bucket = storage_client.bucket(settings.GS_BUCKET_NAME)
                    
                    # 파일 삭제
                    blob = bucket.blob(file_name)
                    blob.delete()
                    
                    return JsonResponse({'status': 'success'})
                except Exception as e:
                    return JsonResponse({'error': str(e)}, status=500)
            else:
                return JsonResponse({'error': 'user is not admin'}, status=403)
        else:
            return JsonResponse({'error': 'Not authenticated'}, status=403)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
    
def generate_download_url(request, file_name):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                # Google Cloud Storage 클라이언트 설정
                storage_client = storage.Client()
                bucket = storage_client.bucket(settings.GS_BUCKET_NAME)
                
                # 파일의 다운로드 URL 생성
                blob = bucket.blob(file_name)
                url = blob.generate_signed_url(
                    version="v4",
                    method="GET",
                    expiration=3600  # URL validity duration in seconds
                )
                
                return JsonResponse({'url': url})
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
        else:
            return JsonResponse({'error': 'Not authenticated'}, status=403)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def upload_files(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            if request.user.is_superuser:
                try:
                    # Google Cloud Storage 클라이언트 설정
                    storage_client = storage.Client()
                    bucket = storage_client.bucket(settings.GS_BUCKET_NAME)
                    
                    file_names = []
                    for file in request.FILES.getlist('files'):
                        # 업로드할 파일 이름 지정
                        blob = bucket.blob(file.name)
                        blob.upload_from_file(file)
                        file_names.append(file.name)
                    
                    return JsonResponse({'files': file_names})
                except Exception as e:
                    return JsonResponse({'error': str(e)}, status=500)
            else:
                return JsonResponse({'error': 'user is not admin'}, status=403)
        else:
            return JsonResponse({'error': 'Not authenticated'}, status=403)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
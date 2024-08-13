document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', async (event) => {
        const fileName = event.target.getAttribute('data-file-name');
        
        if (confirm(`Are you sure you want to delete ${fileName}?`)) {
            try {
                // 서버에 DELETE 요청 보내기
                const response = await fetch(`/service/delete-file/${fileName}/`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': '{{ csrf_token }}'
                    }
                });
                
                if (response.ok) {
                    // 성공적으로 삭제된 경우, DOM에서 해당 파일 항목 제거
                    event.target.parentElement.remove();
                } else {
                    alert('Failed to delete file.');
                }
            } catch (error) {
                console.error('Error deleting file:', error);
                alert('Error deleting file.');
            }
        }
    });
});
document.querySelectorAll('.download-btn').forEach(button => {
    button.addEventListener('click', async (event) => {
        const fileName = event.target.getAttribute('data-file-name');
        
        try {
            // 요청하여 다운로드 URL 받기
            const response = await fetch(`/service/generate-download-url/${fileName}/`);
            
            if (!response.ok) {
                throw new Error('Failed to get download URL');
            }
            
            const result = await response.json();
            const downloadUrl = result.url;
            
            // 파일 다운로드
            window.location.href = downloadUrl;
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Error downloading file.');
        }
    });
});
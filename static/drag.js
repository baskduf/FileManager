const dropZone = document.getElementById('drop-zone');
const fileList = document.getElementById('upload-list');

// 현재 파일 목록을 추적하기 위한 배열
let fileNames = [];

// 드래그 오버 이벤트
dropZone.addEventListener('dragover', (event) => {
    event.preventDefault(); // 기본 동작 방지
    dropZone.classList.add('drag-over'); // 드래그 오버 시 스타일 변경
});

// 드래그 리브 이벤트
dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over'); // 드래그 떠날 때 스타일 원래대로
});

// 파일 드롭 이벤트
dropZone.addEventListener('drop', (event) => {
    event.preventDefault(); // 기본 동작 방지
    dropZone.classList.remove('drag-over'); // 스타일 원래대로

    const files = event.dataTransfer.files;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop(); // 확장자 추출

        // 중복 파일 확인
        if (!fileNames.includes(fileName)) {
            fileNames.push(fileName); // 새 파일 이름 추가
            const listItem = document.createElement('li');
            listItem.innerHTML = `<span class="upload-name">${fileName} <small>(${fileExtension})</small></span>`;
            fileList.appendChild(listItem);
        }
    }
});
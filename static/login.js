

    document.addEventListener("DOMContentLoaded", function() {
        $('.message a').click(function(){
            $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
         });
        // 폼 제출 이벤트 처리
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault(); // 기본 동작 취소
            const actionUrl = loginForm.action;
            const url = new URL(actionUrl);
            const path = url.pathname;
            if(path === "/login_process")
                handleSubmit(loginForm, "login");
            else
                handleSubmit(loginForm, "signup");
        });

        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    // 쿠키 이름으로 시작하는 경우
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }   
    
        function handleSubmit(form, type) {
            const formData = new FormData();
            formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));
            if(type === "login"){
                formData.append('login-username', document.getElementById('login-username').value);
                formData.append('login-password', document.getElementById('login-password').value);
            }else{
                formData.append('signup-username', document.getElementById('signup-username').value);
                formData.append('signup-password', document.getElementById('signup-password').value);
                formData.append('signup-email', document.getElementById('signup-email').value);
            }
           
            console.log(formData);
            
            

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken') // CSRF 토큰 설정 (쿠키에서 가져옴)
                }
            }).then(response => {
                return response.json()
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            }).then(data => {
                if (data.success) {
                    console.log('Success:', data);
                    window.location.href = "/";
                    // 성공 처리 로직
                } else {
                    console.error('Error:', data);
                    
                    errorMessage.classList.remove("hidden");
                    errorMessage.textContent = data.message;
                    // 에러 처리 로직
                }
            }).catch(error => {
                console.error('Error:', error);
                
                errorMessage.classList.remove("hidden");
                errorMessage.textContent = error.message;
                // 에러 처리 로직
            });
        
        }
    });
    
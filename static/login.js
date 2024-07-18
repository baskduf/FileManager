$(document).ready(function(){

    //--------- change color value of the form text/password inputs -----
    
      const textInputs =  $("input[type='textbox']");
      const passwordsInputs =  $("input[type='password']");
      //--------- Login screen swicth -----
    
        $("button").click(function(event){  //  prevent buttons in form to reload
            event.preventDefault();
        });
        
        $("a").click(function(event){  //  prevent 'a' links in form to reload
            event.preventDefault();
        });
    
        $("#sign_up").click(function(){ // when click Sign Up button, hide the Log In elements, and display the Sign Up elements
            $("#title-login").toggleClass("hidden",true);
            $("#login-fieldset").toggleClass("hidden",true);
            $("#login-form-submit").toggleClass("hidden",true);
            $("#lost-password-link").toggleClass("hidden",true);
            $("#sign_up").toggleClass("active-button",false);
            $("#log_in").removeAttr("disabled");

            $("#error-message").toggleClass("hidden",true);
            
            $("#title-signup").toggleClass("hidden",false);
            $("#signup-fieldset").toggleClass("hidden",false);
            $("#signup-form-submit").toggleClass("hidden",false);
            $("#log_in").toggleClass("active-button",true);
            $("#sign_up").prop('disabled', true);
        });
        
        $("#log_in").click(function(){ // when click Log In button, hide the Sign Up elements, and display the Log In elements
            $("#title-login").toggleClass("hidden",false);
            $("#login-fieldset").toggleClass("hidden",false);
            $("#login-form-submit").toggleClass("hidden",false);
            $("#lost-password-link").toggleClass("hidden",false);
            $("#sign_up").toggleClass("active-button",true);
            $("#log_in").prop('disabled', true);

            $("#error-message").toggleClass("hidden",true);
            
            $("#title-signup").toggleClass("hidden",true);
            $("#signup-fieldset").toggleClass("hidden",true);
            $("#signup-form-submit").toggleClass("hidden",true);
            $("#log_in").toggleClass("active-button",false);
            $("#sign_up").removeAttr("disabled");
            
        });
    });

    document.addEventListener("DOMContentLoaded", function() {
        const signUpButton = document.getElementById("sign_up");
        const logInButton = document.getElementById("log_in");
        const loginFieldset = document.getElementById("login-fieldset");
        const signupFieldset = document.getElementById("signup-fieldset");
        const loginForm = document.getElementById("login-form");
        const errorMessage = document.getElementById("error-message");
    
        // 초기 설정
        let loginAction = "/login_process"; // 로그인 처리 경로
        let signUpAction = "/signup_process"; // 회원가입 처리 경로
        loginForm.action = loginAction;
    
        // Sign Up 버튼 클릭 시
        signUpButton.addEventListener("click", function() {
            loginFieldset.classList.add("hidden");
            signupFieldset.classList.remove("hidden");
            loginForm.action = signUpAction; // 회원가입 처리 경로로 설정
        });
    
        // Log In 버튼 클릭 시
        logInButton.addEventListener("click", function() {
            signupFieldset.classList.add("hidden");
            loginFieldset.classList.remove("hidden");
            loginForm.action = loginAction; // 로그인 처리 경로로 설정
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
    
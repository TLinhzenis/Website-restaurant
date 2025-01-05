
(function ($) {
    "use strict";


    /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
  
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).find('i').removeClass('zmdi-eye');
            $(this).find('i').addClass('zmdi-eye-off');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).find('i').addClass('zmdi-eye');
            $(this).find('i').removeClass('zmdi-eye-off');
            showPass = 0;
        }
        
    });


})(jQuery);

/*============================ Xử lý đăng nhập ======================================*/
document.querySelector('.login100-form-btn').addEventListener('click', function (e) {
    e.preventDefault();
    const usernameInput = document.querySelector('input[name="username"]');
    const passwordInput = document.querySelector('input[name="pass"]');
    const username = usernameInput.value;
    const password = passwordInput.value;
    

    const loadingIcon = document.querySelector('.loading-icon');
    loadingIcon.style.display = 'inline'; 
    document.querySelector('.error-message').style.display = 'none'; 

    // Kiểm tra ô tài khoản và mật khẩu
    if (!username) {
        usernameInput.focus(); 
        document.querySelector('.error-message').innerText = "Tài khoản không được để trống"; 
        document.querySelector('.error-message').style.display = 'block'; 
        loadingIcon.style.display = 'none'; 
        return; 
    }

    if (!password) {
        passwordInput.focus(); 
        document.querySelector('.error-message').innerText = "Mật khẩu không được để trống"; 
        document.querySelector('.error-message').style.display = 'block'; 
        loadingIcon.style.display = 'none'; 
        return; 
    }

    fetch(`https://resmant11111-001-site1.anytempurl.com/Customer/Login?username=${username}&password=${password}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        loadingIcon.style.display = 'none'; 
        if (data.message === "Đăng nhập thành công") {
            localStorage.setItem('fullNameU', data.fullName);
            localStorage.setItem('customerId', data.customerId);
            localStorage.setItem('point', data.point);
            window.location.href = 'index.html';
        } else {
            
            document.querySelector('.error-message').innerText = "Sai tài khoản hoặc mật khẩu"; 
            document.querySelector('.error-message').style.display = 'block'; 
        }
    })
    .catch(error => {
        loadingIcon.style.display = 'none'; 
        console.error('Error:', error);
    });


});


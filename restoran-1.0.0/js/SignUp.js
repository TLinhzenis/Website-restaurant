

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

// Xử lý đăng kí
$(document).ready(function () {
    $("#saveCustomerBtn").click(function (event) {
        event.preventDefault();
        
        var fullName = $("#fullName").val().trim();
        var username = $("#username").val().trim();
        var password = $("#password").val().trim();
        var rppassword = $("#RPpassword").val().trim();
        var email = $("#email").val().trim();
        var phone = $("#phone").val().trim();

        if (!fullName || !username || !password || !rppassword || !email || !phone) {
            $(".error-message").text("Không được để trống thông tin").show();
            return;
        }

        if (password !== rppassword) {
            $(".error-message").text("Mật khẩu không khớp").show();
            return;
        }

        var newCustomerItem = {
            FullName: fullName,
            Username: username,
            Password: password,
            Email: email,
            PhoneNumber: phone,
            Point: 0,
            DateJoined: new Date()
        };

        $(".loading-icon").show();
        $(".error-message").hide();

        $.ajax({
            url: "https://resmant1111-001-site1.jtempurl.com/Customer/Insert",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(newCustomerItem),
            success: function (response) {
                $(".loading-icon").hide();
                $(".success-message").text("Đăng kí tài khoản thành công").show();
                setTimeout(function () {
                    window.location.href = "LoginUser.html";
                }, 2000);
            },
            error: function (xhr, status, error) {
                $(".loading-icon").hide();
                const errorMessage = JSON.parse(xhr.responseText).message || "Có lỗi xảy ra khi đăng kí.";
                $(".error-message").text(errorMessage).show();
            }
        });
    });
});

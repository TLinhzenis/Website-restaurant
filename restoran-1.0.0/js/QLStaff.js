$(document).ready(function () {
    var table = $('#StaffTable').DataTable({
        columns: [
            { title: "Tên", width: "200px" },
            { title: "Username" },
            { title: "Password", width: "200px" },
            { title: "Chức vụ" },
            { title: "Ảnh" },
            { title: "Chức năng", width: "100px" }
        ]
    });

    $(document).ready(function () {
        // Chặn ký tự không phải chữ trong ô nhập Tên
        $("#staffName, #staffNameEdit").on("input", function () {
            // Xóa tất cả các ký tự không phải chữ cái và khoảng trắng
            $(this).val($(this).val().replace(/[^a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẰẮẲẶÂẦẤẨẪẬÊỀếỂễệỳỵỷỹý\s]/g, ''));
        });
    });
    
    // Hạn chế quyền truy cập
    const userRole = localStorage.getItem('role'); 

    // Kiểm tra vai trò người dùng
    if (userRole !== 'admin') {
        // Ẩn hoặc vô hiệu hóa liên kết "Quản lý nhân viên"
        $('#manageStaff').css('pointer-events', 'none').css('color', 'gray'); // Vô hiệu hóa liên kết
        $('#manageStaff').on('click', function (e) {
            e.preventDefault(); // Ngăn chặn hành động mặc định
        });
    }

    /*-------------------------------------------------Animation & ovelay------------------------------------------------*/
    function closeModal2() {
    
        $("#notificationModal").addClass("closing");
        $("#confirmDeleteModal3").addClass("closing");
        setTimeout(function () {
    
            $("#notificationModal").hide();;
            $("#confirmDeleteModal3").hide();
            $("#overlay").hide(); 

            $("#notificationModal").removeClass("closing");
            $("#confirmDeleteModal3").removeClass("closing");
        }, 500); 
    }
    function closeModal() {
        $("#editStaffModal").addClass("closing");
        $("#addStaffModal").addClass("closing");
        
        setTimeout(function () {
            $("#editStaffModal").hide();
            $("#addStaffModal").hide();
            $("#overlay").hide();
            resetStaffModal();
            $("#addStaffModal").removeClass("closing");
            $("#editStaffModal").removeClass("closing");
        }, 900); 
    }
    $("#overlay").click(function (e) {
        if ($(e.target).is("#overlay")) {
            closeModal();
            closeModal2()
        }
    });

    function resetStaffModal() {
        $("#staffName").val(""); 
        $("#usernameStaff").val(""); 
        $("#passwordStaff").val(""); 
        $("#role").val(""); 
        $("#image1").val(""); 
        const imagePreview = $("#imagePreview1");
        imagePreview.attr("src", ""); 
        
    }
    


/*-------------------------------------------------Hiển thị danh sách------------------------------------------------*/
    function loadStaffs() {
        $.ajax({
            url: "https://resmant11111-001-site1.anytempurl.com/staff/List",
            method: "GET",
            success: function (response) {
                console.log(response); 
                table.clear(); 

                response.forEach(function (item) {
                    var imageUrl = item.image ? `https://resmant11111-001-site1.anytempurl.com/uploads/${item.image}` : '';

                    var row = [
                        item.fullName,
                        item.username,
                        item.password,
                        item.role,
                        imageUrl ? `<img src="${imageUrl}" alt="Hình ảnh" style="width: 100px; height: 100px;" />` : 'Không có ảnh',
                        `<a id="btn-edit" class="btn-edit3" data-id="${item.staffId}"><i class="fa-solid fa-eye"></i></a>
                        
                        <div class="divider"></div>

                         <a id="btn-delete" class="btn-delete3" data-id="${item.staffId}"><i class="fa-solid fa-trash"></i></a>`
                    ];
                    table.row.add(row).draw(); 
                });
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải danh sách nhân viên:", error);
            }
        });
    }

    // Gọi hàm loadStaffs khi trang được tải
    loadStaffs();


/*-------------------------------------------------Thêm------------------------------------------------*/

    $("#addStaffBtn").click(function () {
        $("#addStaffModal").show(); 
        $("#overlay").show();
    });

    $("#cancelStaffBtn").click(function () {
        closeModal();
    });
    $("#image1").change(function () {
        var imageFile = $("#image1")[0].files[0];

        if (imageFile) {
            // Hiển thị tên file ảnh
            $("#imageName1").text("Tên file: " + imageFile.name);

            // Hiển thị ảnh preview
            var reader = new FileReader();
            reader.onload = function (e) {
                $("#imagePreview1").attr("src", e.target.result);
            };
            reader.readAsDataURL(imageFile);
        } else {
            $("#imageName1").text("");
            $("#imagePreview1").attr("src", "");
        }
    });

    $("#saveStaffBtn").click(function () {
        var staffName = $("#staffName").val().trim();
        
        var usernameStaff = $("#usernameStaff").val().trim();

        var passwordStaff = $("#passwordStaff").val().trim();

        var role = $("#role").val().trim();

        var imageFile = $("#image1")[0].files[0];

        // Kiểm tra các điều kiện
        if (!staffName || !role) {
            document.querySelector('.error-message5').innerText = "Vui lòng điền đầy đủ tên và chức vụ"; 
            document.querySelector('.error-message5').style.display = 'block'; 
            $("#staffName").focus();
            return; 
        }
        if (!usernameStaff) {
            document.querySelector('.error-message5').innerText = "Tên tài khoản không được để trống"; 
            document.querySelector('.error-message5').style.display = 'block'; 
            $("#usernamedStaff").focus(); 
            return; 
        }
        if (!passwordStaff || passwordStaff.length < 6) {
            document.querySelector('.error-message5').innerText = "Mật khẩu phải có ít nhất 6 kí tự"; 
            document.querySelector('.error-message5').style.display = 'block'; 
            $("#passwordStaff").focus(); 
            return; 
        }

        if (!imageFile) {
            document.querySelector('.error-message5').innerText = "Vui lòng chọn ảnh"; 
            document.querySelector('.error-message5').style.display = 'block'; 
            loadingIcon.style.display = 'none'; 
            return; 
        }
        // Tạo form data để gửi ảnh lên API
        var formData = new FormData();
        formData.append("file", imageFile);
        
        $.ajax({
            url: "https://resmant11111-001-site1.anytempurl.com/controller/upload-image", 
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var imageName1 = response.imagePath.split('/').pop(); 

            var newStaffItem = {
                FullName: staffName,   
                Username: usernameStaff,  
                Password: passwordStaff,   
                Role: role, 
                Image: imageName1,
                
            };

            $.ajax({
                url: "https://resmant11111-001-site1.anytempurl.com/Staff/Insert",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(newStaffItem),
                success: function (response) {
                    loadStaffs();
                    $("#addStaffModal").hide(); 
                    
                    showNotification("Nhân viên đã được thêm thành công!");

                                        // Reset form thêm nhân viên
                                        $("#staffName").val('');
                                        $("#usernameStaff").val('');
                                        $("#passwordStaff").val('');
                                        $("#role").val('');
                                        $("#image1").val('');
                                        $("#imageName1").text('');
                                        $("#imagePreview1").attr("src", '');
                                        $(".error-message5").hide();
                },
                error: function (xhr, status, error) {
                    const errorMessage =
                    JSON.parse(xhr.responseText).message || "Có lỗi xảy ra khi đăng kí.";
                  $(".error-message5").text(errorMessage).show();
                    
                        
                    
                }
            });
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải ảnh lên:", error);
                alert("Có lỗi xảy ra khi tải ảnh.");
            }
        });
    });
    /*-------------------------------------------------Xóa------------------------------------------------*/
    let staffIdToDelete;

    $(document).on('click', '.btn-delete3', function () {
        staffIdToDelete = $(this).data('id');
        $("#confirmDeleteModal3").show(); 
        $("#overlay").show();
        
    });

    $("#confirmDeleteBtn3").on("click", function () {
        $.ajax({
            url: `https://resmant11111-001-site1.anytempurl.com/staff/Delete?id=${staffIdToDelete}`,
            method: "POST",
            success: function (response) {
                loadStaffs();
                showNotification("Nhân viên đã được xóa thành công!");
                $("#confirmDeleteModal3").hide(); 
            },
            error: function (xhr, status, error) {
                console.error("Không thể xóa nhân viên:", error);
                alert("Có lỗi xảy ra khi xóa nhân viên.");
            }
        });
    });

    function deleteImage(imageName1) {
        $.ajax({
            url: `https://resmant11111-001-site1.anytempurl.com/controller/delete-image`,
            method: "POST",
            data: { imageName1: imageName1 },
            success: function (response) {
                alert(response);
            },
            error: function (xhr, status, error) {
                console.error("Không thể xóa hình ảnh:", error);
                alert("Có lỗi xảy ra khi xóa hình ảnh.");
            }
        });
    }
    

    $("#cancelDeleteBtn3").on("click", function () {
        closeModal2();
    });

    /*-------------------------------------------------Sửa------------------------------------------------*/


    let StaffId;

$("#imageUpload1").change(function () {
    var imageFile1 = $("#imageUpload1")[0].files[0]; 

    if (imageFile1) {
        
        $("#imageNameEdit1").text("Tên file: " + imageFile1.name);

        
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#currentImage1").attr("src", e.target.result).show();
        };
        reader.readAsDataURL(imageFile1);
    } else {
        $("#imageNameEdit1").text("Không có ảnh");
        $("#currentImage1").hide(); 
    }
});

    $(document).on('click', '.btn-edit3', function () {
        StaffId = $(this).data('id'); 
        $.ajax({
            url: `https://resmant11111-001-site1.anytempurl.com/Staff/GetById?id=${StaffId}`,
            method: "GET",
            success: function (staff) {
                $("#staffNameEdit").val(staff.fullName);
                $("#usernameStaffEdit").val(staff.username);
                $("#passwordStaffEdit").val(staff.password);
                $("#roleEdit").val(staff.role);

            // Kiểm tra vai trò của nhân viên và vô hiệu hóa trường mật khẩu nếu không phải "admin" hoặc "Quản lý"
            if (staff.role !== "admin" && staff.role !== "Quản lý") {
                $("#passwordStaffEdit").prop('disabled', true);
            } else {
                $("#passwordStaffEdit").prop('disabled', false);
            }
    
                $("#editStaffModal").show(); 
                
                // Nếu nhân viên có ảnh
            if (staff.image) {
                $("#imageNameEdit1").text(staff.image); 
                $("#currentImage1").attr("src", `https://resmant11111-001-site1.anytempurl.com/uploads/${staff.image}`).show();
            } else {
                $("#imageNameEdit1").text("Không có ảnh");
                $("#currentImage1").hide();
            }

            // Reset input file cho hình ảnh mới
            $("#imageUpload1").val(''); 
            $("#editStaffModal").show();
            $("#overlay").show();
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải thông tin nhân viên:", error);
            }
        });
    });
    
    $("#cancelEditStaffBtn").click(function () {
        closeModal();
    });
    
    $("#saveEditStaffBtn").click(function () {
        var staffName = $("#staffNameEdit").val().trim();
        var usernameStaff = $("#usernameStaffEdit").val().trim();
        var passwordStaff = $("#passwordStaffEdit").val().trim();
        var role = $("#roleEdit").val().trim();
        var imageInput1 = $("#imageUpload1")[0];  
        var imageFile1 = imageInput1.files.length > 0 ? imageInput1.files[0] : null;  
        var currentImage1 = $("#currentImage1").attr("src").split('/').pop(); 
    
        // Kiểm tra các điều kiện
        if (!staffName || !role) {
            document.querySelector('.error-message6').innerText = "Vui lòng điền đầy đủ tên và chức vụ"; 
            document.querySelector('.error-message6').style.display = 'block'; 
            $("#staffName").focus();
            return; 
        }
        if (!passwordStaff || passwordStaff.length < 6) {
            document.querySelector('.error-message6').innerText = "Mật khẩu phải có ít nhất 6 kí tự"; 
            document.querySelector('.error-message6').style.display = 'block'; 
            $("#passwordStaffEdit").focus(); 
            return; 
        }
        if (!usernameStaff) {
            document.querySelector('.error-message5').innerText = "Tên tài khoản không được để trống"; 
            document.querySelector('.error-message5').style.display = 'block'; 
            $("#usernameStaff").focus(); 
            return; 
        }
        if (imageFile1) {
            var formData = new FormData();
            formData.append('file', imageFile1);
    
            // Upload ảnh mới
            $.ajax({
                url: "https://resmant11111-001-site1.anytempurl.com/controller/upload-image",
                method: "POST",
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    var updatedStaff = {
                        StaffId: StaffId, 
                        FullName: staffName,
                        Username: usernameStaff,
                        Password: passwordStaff,
                        Role: role,
                        image: response.imagePath.split('/').pop() 
                    };
    
                    updatedStaff1(updatedStaff);
                },
                error: function () {
                    alert("Có lỗi xảy ra khi tải ảnh.");
                }
            });
        } else {
            // Nếu không có ảnh mới, giữ lại tên ảnh hiện tại
            var updatedStaff = {
                StaffId: StaffId, 
                FullName: staffName,
                Username: usernameStaff,
                Password: passwordStaff,
                Role: role,
                image: currentImage1 
            };
    
            updatedStaff1(updatedStaff);
        }

        function updatedStaff1(updatedStaff) {
        $.ajax({
            url: "https://resmant11111-001-site1.anytempurl.com/Staff/Update",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updatedStaff),
            success: function (response) {
                loadStaffs(); 
                $("#editStaffModal").hide();
                
                showNotification("Nhân viên đã được cập nhật thành công!");
            },
            error: function (xhr, status, error) {
                console.error("Không thể cập nhật Nhân viên:", error);
                alert("Có lỗi xảy ra khi cập nhật Nhân viên.");
            }
            
        });
    }
    });
    function showNotification(message) {
        $("#notificationMessage").text(message);
        $("#notificationModal").show(); 
    }

    // Khi nhấn nút Đóng trong modal thông báo
    $("#closeNotificationBtn").click(function () {
        closeModal2(); 
    });

    $(document).ready(function () {
        $('#role').change(function () {
            const role = $(this).val();
            if (role === "admin" || role === "Quản lý") {
                $('#usernamePasswordGroup').show();
                // Xóa giá trị "Unavailable" nếu chuyển về admin hoặc Quản lý
                $('#usernameStaff').val('');
                $('#passwordStaff').val('');
            } else {
                $('#usernamePasswordGroup').hide();
                // Đặt "Unavailable" vào các trường username và password
                $('#usernameStaff').val('Unavailable');
                $('#passwordStaff').val('Unavailable');
            }
        });
    });
    
    
    
    
});

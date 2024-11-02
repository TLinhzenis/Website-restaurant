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
    // Hạn chế quyền truy cập
    const userRole = localStorage.getItem('role'); // 'admin' hoặc 'user', tùy thuộc vào hệ thống của bạn

    // Kiểm tra vai trò người dùng
    if (userRole !== 'admin') {
        // Ẩn hoặc vô hiệu hóa liên kết "Quản lý nhân viên"
        $('#manageStaff').css('pointer-events', 'none').css('color', 'gray'); // Vô hiệu hóa liên kết
        $('#manageStaff').on('click', function (e) {
            e.preventDefault(); // Ngăn chặn hành động mặc định
        });
    }

    // Hàm load danh sách Nhân viên từ API
    function loadStaffs() {
        $.ajax({
            url: "https://resmant1111-001-site1.jtempurl.com/staff/List",
            method: "GET",
            success: function (response) {
                console.log(response); // Kiểm tra phản hồi API
                table.clear(); // Xóa dữ liệu cũ

                response.forEach(function (item) {
                    var imageUrl = item.image ? `https://resmant1111-001-site1.jtempurl.com/uploads/${item.image}` : '';

                    var row = [
                        item.fullName,
                        item.username,
                        item.password,
                        item.role,
                        imageUrl ? `<img src="${imageUrl}" alt="Hình ảnh" style="width: 100px; height: 100px;" />` : 'Không có ảnh',
                        `<button class="btn-edit3" data-id="${item.staffId}">Sửa</button>
                         <button class="btn-delete3" data-id="${item.staffId}">Xóa</button>`
                    ];
                    table.row.add(row).draw(); // Thêm hàng mới
                });
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải danh sách nhân viên:", error);
            }
        });
    }

    // Gọi hàm loadStaffs khi trang được tải
    loadStaffs();


    //Thêm

    $("#addStaffBtn").click(function () {
        $("#addStaffModal").show(); // Hiển thị modal thêm món ăn
    });

    $("#cancelStaffBtn").click(function () {
        $("#addStaffModal").hide(); // Ẩn modal
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
            document.querySelector('.error-message5').innerText = "Vui lòng điền đầy đủ tên và chức vụ"; // Thông báo cho ô username
            document.querySelector('.error-message5').style.display = 'block'; // Hiển thị phần tử thông báo
            loadingIcon.style.display = 'none'; // Ẩn biểu tượng loading
            return; // Ngừng thực hiện nếu tài khoản trống
        }

        if (!imageFile) {
            document.querySelector('.error-message5').innerText = "Vui lòng chọn ảnh"; // Thông báo cho ô username
            document.querySelector('.error-message5').style.display = 'block'; // Hiển thị phần tử thông báo
            loadingIcon.style.display = 'none'; // Ẩn biểu tượng loading
            return; // Ngừng thực hiện nếu tài khoản trống
        }
        // Tạo form data để gửi ảnh lên API
        var formData = new FormData();
        formData.append("file", imageFile);
        
        $.ajax({
            url: "https://resmant1111-001-site1.jtempurl.com/controller/upload-image", // URL đến API upload ảnh
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var imageName1 = response.imagePath.split('/').pop(); // Lấy tên file ảnh từ đường dẫn

            var newStaffItem = {
                FullName: staffName,   
                Username: usernameStaff,  
                Password: passwordStaff,   
                Role: role, 
                Image: imageName1,
                
            };

            $.ajax({
                url: "https://resmant1111-001-site1.jtempurl.com/Staff/Insert",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(newStaffItem),
                success: function (response) {
                    loadStaffs();
                    $("#addStaffModal").hide(); // Ẩn modal
                    
                    showNotification("Nhân viên đã được thêm thành công!");
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
    // Xử lý sự kiện cho nút "Xóa"
    let staffIdToDelete;

    $(document).on('click', '.btn-delete3', function () {
        staffIdToDelete = $(this).data('id');
        $("#confirmDeleteModal3").show(); // Hiện modal xác nhận
    });

    $("#confirmDeleteBtn3").on("click", function () {
        $.ajax({
            url: `https://resmant1111-001-site1.jtempurl.com/staff/Delete?id=${staffIdToDelete}`,
            method: "POST",
            success: function (response) {
                loadStaffs();
                showNotification("Nhân viên đã được xóa thành công!");
                $("#confirmDeleteModal3").hide(); // Ẩn modal xác nhận
            },
            error: function (xhr, status, error) {
                console.error("Không thể xóa nhân viên:", error);
                alert("Có lỗi xảy ra khi xóa nhân viên.");
            }
        });
    });

    function deleteImage(imageName1) {
        $.ajax({
            url: `https://resmant1111-001-site1.jtempurl.com/controller/delete-image`,
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
        $("#confirmDeleteModal3").hide(); // Ẩn modal xác nhận
    });

    // Xử lý sự kiện cho nút "Sửa"


    let StaffId;
// Khi người dùng chọn file ảnh mới
$("#imageUpload1").change(function () {
    var imageFile1 = $("#imageUpload1")[0].files[0]; // Lấy file ảnh mới

    if (imageFile1) {
        // Hiển thị tên file ảnh
        $("#imageNameEdit1").text("Tên file: " + imageFile1.name);

        // Hiển thị ảnh preview
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#currentImage1").attr("src", e.target.result).show(); // Hiện ảnh mới
        };
        reader.readAsDataURL(imageFile1);
    } else {
        $("#imageNameEdit1").text("Không có ảnh");
        $("#currentImage1").hide(); // Ẩn ảnh nếu không có file nào được chọn
    }
});

    $(document).on('click', '.btn-edit3', function () {
        StaffId = $(this).data('id'); // Lưu ID nhân viên cần sửa
        $.ajax({
            url: `https://resmant1111-001-site1.jtempurl.com/Staff/GetById?id=${StaffId}`,
            method: "GET",
            success: function (staff) {
                $("#staffNameEdit").val(staff.fullName);
                $("#usernameStaffEdit").val(staff.username);
                $("#passwordStaffEdit").val(staff.password);
                $("#roleEdit").val(staff.role);
    
                $("#editStaffModal").show(); // Hiện modal sửa nhân viên
                
                // Nếu món ăn có ảnh
            if (staff.image) {
                $("#imageNameEdit1").text(staff.image); // Cập nhật tên file ảnh
                $("#currentImage1").attr("src", `https://resmant1111-001-site1.jtempurl.com/uploads/${staff.image}`).show();
            } else {
                $("#imageNameEdit1").text("Không có ảnh");
                $("#currentImage1").hide();
            }

            // Reset input file cho hình ảnh mới
            $("#imageUpload1").val(''); // Đặt lại input file để không giữ file trước đó

            $("#editStaffModal").show(); // Hiện modal sửa nhân viên
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải thông tin nhân viên:", error);
            }
        });
    });
    
    $("#cancelEditStaffBtn").click(function () {
        $("#editStaffModal").hide(); // Ẩn modal sửa nhân viên
    });
    
    $("#saveEditStaffBtn").click(function () {
        var staffName = $("#staffNameEdit").val().trim();
        var usernameStaff = $("#usernameStaffEdit").val().trim();
        var passwordStaff = $("#passwordStaffEdit").val().trim();
        var role = $("#roleEdit").val().trim();
        var imageInput1 = $("#imageUpload1")[0];  // Đối tượng input file
        var imageFile1 = imageInput1.files.length > 0 ? imageInput1.files[0] : null;  // Kiểm tra xem có file nào được chọn không
        var currentImage1 = $("#currentImage1").attr("src").split('/').pop(); // Lấy tên ảnh hiện tại
    
        // Kiểm tra các điều kiện
        if (!staffName || !role) {
            document.querySelector('.error-message6').innerText = "Vui lòng điền đầy đủ tên và chức vụ"; // Thông báo cho ô username
            document.querySelector('.error-message6').style.display = 'block'; // Hiển thị phần tử thông báo
            loadingIcon.style.display = 'none'; // Ẩn biểu tượng loading
            return; // Ngừng thực hiện nếu tài khoản trống
        }
        if (imageFile1) {
            var formData = new FormData();
            formData.append('file', imageFile1);
    
            // Upload ảnh mới
            $.ajax({
                url: "https://resmant1111-001-site1.jtempurl.com/controller/upload-image",
                method: "POST",
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    var updatedStaff = {
                        StaffId: StaffId, // Thêm StaffId vào dữ liệu gửi
                        FullName: staffName,
                        Username: usernameStaff,
                        Password: passwordStaff,
                        Role: role,
                        image: response.imagePath.split('/').pop() // Chỉ lấy tên file ảnh mới
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
                StaffId: StaffId, // Thêm StaffId vào dữ liệu gửi
                FullName: staffName,
                Username: usernameStaff,
                Password: passwordStaff,
                Role: role,
                image: currentImage1 // Giữ lại ảnh cũ
            };
    
            updatedStaff1(updatedStaff);
        }

        function updatedStaff1(updatedStaff) {
        $.ajax({
            url: "https://resmant1111-001-site1.jtempurl.com/Staff/Update",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updatedStaff),
            success: function (response) {
                loadStaffs(); // Giả sử đây là hàm tải lại danh sách nhân viên
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
        $("#notificationModal").show(); // Hiển thị modal thông báo
    }

    // Khi nhấn nút Đóng trong modal thông báo
    $("#closeNotificationBtn").click(function () {
        $("#notificationModal").hide(); // Ẩn modal thông báo
    });

    $(document).ready(function () {
        $('#role').change(function () {
            const role = $(this).val();
            if (role === "admin" || role === "Quản lý") {
                $('#usernamePasswordGroup').show();
            } else {
                $('#usernamePasswordGroup').hide();
                // Xóa nội dung của ô username và password
                $('#usernameStaff').val('');  // Xóa ô username
                $('#passwordStaff').val('');  // Xóa ô password
            }
        });
    });
    
    
    
});

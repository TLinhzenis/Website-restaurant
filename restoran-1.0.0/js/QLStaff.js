$(document).ready(function () {
    var table = $('#StaffTable').DataTable({
        columns: [
            { title: "Tên", width: "200px" },
            { title: "Username" },
            { title: "Password", width: "200px" },
            { title: "Chức vụ" },
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
                    var row = [
                        item.fullName,
                        item.username,
                        item.password,
                        item.role,
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
                alert("Nhân viên đã được xóa thành công!");
                $("#confirmDeleteModal3").hide(); // Ẩn modal xác nhận
            },
            error: function (xhr, status, error) {
                console.error("Không thể xóa nhân viên:", error);
                alert("Có lỗi xảy ra khi xóa nhân viên.");
            }
        });
    });

    $("#cancelDeleteBtn3").on("click", function () {
        $("#confirmDeleteModal3").hide(); // Ẩn modal xác nhận
    });

    //Thêm

    $("#addStaffBtn").click(function () {
        $("#addStaffModal").show(); // Hiển thị modal thêm món ăn
    });

    $("#cancelStaffBtn").click(function () {
        $("#addStaffModal").hide(); // Ẩn modal
    });

    $("#saveStaffBtn").click(function () {
        var staffName = $("#staffName").val().trim();
        
        var usernameStaff = $("#usernameStaff").val().trim();

        var passwordStaff = $("#passwordStaff").val().trim();

        var role = $("#role").val().trim();

        // Kiểm tra các điều kiện
        if (!staffName || !role) {
            alert("Không được để trống tên và chức vụ.");
            return;
        }

            var newStaffItem = {
                FullName: staffName,   
                Username: usernameStaff,  
                Password: passwordStaff,   
                Role: role, 
                
            };

            $.ajax({
                url: "https://resmant1111-001-site1.jtempurl.com/Staff/Insert",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(newStaffItem),
                success: function (response) {
                    loadStaffs();
                    $("#addStaffModal").hide(); // Ẩn modal
                    alert("Nhân viên đã được thêm thành công!");
                },
                error: function (xhr, status, error) {
                    console.error("Không thể thêm Nhân viên:", error);
                    alert("Có lỗi xảy ra khi thêm Nhân viên.");
                }
            });
        
    });

    // Xử lý sự kiện cho nút "Sửa"


    let StaffId;

    $(document).on('click', '.btn-edit3', function () {
        StaffId = $(this).data('id'); // Lưu ID món ăn cần sửa
        $.ajax({
            url: `https://resmant1111-001-site1.jtempurl.com/Staff/GetById?id=${StaffId}`,
            method: "GET",
            success: function (staff) {
                $("#staffNameEdit").val(staff.fullName);
                $("#usernameStaffEdit").val(voucher.username);
                $("#passwordStaffEdit").val(voucher.password);
                $("#roleEdit").val(voucher.role);

                
                $("#editStaffModal").show(); // Hiện modal sửa món ăn
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải thông tin nhân viên:", error);
            }
        });
    });

    $("#cancelEditVoucherBtn").click(function () {
        $("#editVoucherModal").hide(); // Ẩn modal sửa món ăn
    });

    $("#saveEditVoucherBtn").click(function () {
        var voucherType = $("#voucherTypeEdit").val().trim();
        var voucherPoint = parseFloat($("#voucherPoint").val());
        
    
        // Kiểm tra các điều kiện
        if (!voucherType) {
            alert("Loại voucher không được để trống.");
            return;
        }
        if (!voucherPoint || !Number.isInteger(voucherPoint) || voucherPoint <= 0) {
            alert("Điểm số phải là số nguyên và lớn hơn 0.");
            return;
        }

    
        
    
        var updatedVoucher = {
            VoucherId: VoucherId,
            voucherType: voucherType,
            voucherPoint: voucherPoint,
           
        };
    
        $.ajax({
            url: "https://resmant1111-001-site1.jtempurl.com/Voucher/Update",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updatedVoucher),
            success: function (response) {
                loadVouchers();
                $("#editVoucherModal").hide();
                alert("Voucher đã được cập nhật thành công!");
            },
            error: function (xhr, status, error) {
                console.error("Không thể cập nhật Voucher:", error);
                alert("Có lỗi xảy ra khi cập nhật Voucher.");
            }
        });
    });
});

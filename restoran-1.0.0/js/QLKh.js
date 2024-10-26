$(document).ready(function () {
    var table = $('#CustomerTable').DataTable({
        columns: [
            { title: "Username" },
            { title: "Tên", width: "200px" },
            { title: "Password", width: "200px" },
            { title: "Email", width: "200px" },
            { title: "Số điện thoại" },
            { title: "Ngày tạo" },
            { title: "Điểm thưởng" },
            { title: "Chức năng", width: "100px" }
        ]
    });

    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Định dạng số
    }

    // Hàm load danh sách khách hàng từ API
    function loadCustomers() {
        $.ajax({
            url: "https://resmant1111-001-site1.jtempurl.com/Customer/List",
            method: "GET",
            success: function (response) {
                table.clear(); // Xóa dữ liệu cũ

                response.forEach(function (item) {
                    var row = [
                        item.username,
                        item.fullName,
                        item.password,
                        item.email,
                        item.phoneNumber,
                        item.dateJoined,
                        formatPrice(item.point),
                        `<button class="btn-edit1" data-id="${item.customerId}">Sửa</button>
                         <button class="btn-delete1" data-id="${item.customerId}">Xóa</button>`
                    ];
                    table.row.add(row).draw(); // Thêm hàng mới
                });

            },
            error: function (xhr, status, error) {
                console.error("Không thể tải danh sách khách hàng:", error);
            }
        });
    }

    // Gọi hàm loadCustomers khi trang được tải
    loadCustomers();


    // Xử lý sự kiện cho nút "Xóa"
    let customerIdToDelete;

    $(document).on('click', '.btn-delete1', function () {
        customerIdToDelete = $(this).data('id');
        $("#confirmDeleteModal1").show(); // Hiện modal xác nhận
    });

    $("#confirmDeleteBtn1").on("click", function () {
        $.ajax({
            url: `https://resmant1111-001-site1.jtempurl.com/Customer/Delete?id=${customerIdToDelete}`,
            method: "POST",
            success: function (response) {
                loadCustomers();
                alert("Tài khoản đã được xóa thành công!");
                $("#confirmDeleteModal1").hide(); // Ẩn modal xác nhận
            },
            error: function (xhr, status, error) {
                console.error("Không thể xóa tài khoản:", error);
                alert("Có lỗi xảy ra khi xóa tài khoản.");
            }
        });
    });

    $("#cancelDeleteBtn1").on("click", function () {
        $("#confirmDeleteModal1").hide(); // Ẩn modal xác nhận
    });
    // Xử lý sự kiện cho nút "Sửa"


    let CustomerId;

    $(document).on('click', '.btn-edit1', function () {
        CustomerId = $(this).data('id'); // Lưu ID món ăn cần sửa
        $.ajax({
            url: `https://resmant1111-001-site1.jtempurl.com/Customer/GetById?id=${CustomerId}`,
            method: "GET",
            success: function (customer) {
                $("#UsernameEdit").val(customer.username);
                $("#NameEdit").val(customer.fullName);
                $("#PasswordEdit").val(customer.password);
                $("#EmailEdit").val(customer.email);
                $("#PhoneEdit").val(customer.phoneNumber);
                $("#PointEdit").val(customer.point);
                $("#DayEdit").val(customer.dateJoined);
                $("#editCustomerModal").show(); // Hiện modal sửa món ăn
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải thông tin tài khoản:", error);
            }
        });
    });

    $("#cancelEditCustomerBtn").click(function () {
        $("#editCustomerModal").hide(); // Ẩn modal sửa món ăn
    });

    $("#saveEditCustomerBtn").click(function () {
        var username = $("#UsernameEdit").val().trim();
        var fullName = $("#NameEdit").val();
        var password = $("#PasswordEdit").val();
        var email = $("#EmailEdit").val();
        var phoneNumber = $("#PhoneEdit").val();
        var point = parseFloat($("#PointEdit").val(), 10);
        var dayJoined = $("#DayEdit").val(); // Lấy giá trị hiển thị của dayJoined
    
        // Kiểm tra các điều kiện
        if (!password) {
            alert("Password không được để trống.");
            return;
        }
    
        if (!email) {
            alert("Email không được để trống.");
            return;
        }
    
        if (!fullName) {
            alert("Name không được để trống.");
            return;
        }
        if (!point || point < 0 || !Number.isInteger(point)) {
            alert("Số điểm phải là số nguyên không âm.");
            return;
        }
    
        if (!phoneNumber) {
            alert("Phone không được để trống.");
            return;
        }
    
        var updatedCustomer = {
            CustomerId: CustomerId,
            username: username,
            password: password,
            fullName: fullName,
            phoneNumber: phoneNumber,
            email: email,
            point: point,
            dayJoined: dayJoined, // Giữ nguyên giá trị dayJoined từ input
        };
    
        $.ajax({
            url: "https://resmant1111-001-site1.jtempurl.com/Customer/Update",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updatedCustomer),
            success: function (response) {
                loadCustomers();
                $("#editCustomerModal").hide();
                alert("Tài khoản đã được cập nhật thành công!");
            },
            error: function (xhr, status, error) {
                console.error("Không thể cập nhật tài khoản:", error);
                alert("Có lỗi xảy ra khi cập nhật tài khoản.");
            }
        });
    });
    
});
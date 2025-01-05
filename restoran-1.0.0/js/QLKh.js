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
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function formatDateToVietnameseTimezone(utcDateString) {
        const utcDate = new Date(utcDateString);
        const vietnamTime = new Date(utcDate.getTime() + 6 * 60 * 60 * 1000);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Ho_Chi_Minh' };
        return vietnamTime.toLocaleString('vi-VN', options);
    }
/*-------------------------------------------------Animation & ovelay------------------------------------------------*/
    function closeModal2() {
    
        $("#notificationModal").addClass("closing");
        $("#confirmDeleteModal1").addClass("closing");
        setTimeout(function () {
    
            $("#notificationModal").hide();;
            $("#confirmDeleteModal1").hide();
            $("#overlay").hide(); 

            $("#notificationModal").removeClass("closing");
            $("#confirmDeleteModal1").removeClass("closing");
        }, 500); 
    }
    function closeModal() {
        $("#editCustomerModal").addClass("closing");
        
        setTimeout(function () {
            $("#editCustomerModal").hide();
            $("#overlay").hide();
             
            $("#editCustomerModal").removeClass("closing");
        }, 900); 
    }

/*-------------------------------------------------Hiển thị danh sách------------------------------------------------*/
    function loadCustomers() {
        $.ajax({
            url: "https://resmant11111-001-site1.anytempurl.com/Customer/List",
            method: "GET",
            success: function (response) {
                table.clear(); 

                response.forEach(function (item) {
                    var row = [
                        item.username,
                        item.fullName,
                        '*'.repeat(item.password.length),
                        item.email,
                        item.phoneNumber,
                        formatDateToVietnameseTimezone(item.dateJoined),
                        formatPrice(item.point),
                        `<a id="btn-edit" class="btn-edit1" data-id="${item.customerId}"><i class="fa-solid fa-eye"></i></a>
                        
                        <div class="divider"></div>
                        
                        <a id="btn-delete" class="btn-delete1" data-id="${item.customerId}"><i class="fa-solid fa-trash"></i></a>`
                    ];
                    table.row.add(row) 
                });
                table.draw(); 
                // Hạn chế quyền truy cập
                const userRole = localStorage.getItem('role'); 

                if (userRole !== 'admin') {
                    
                    $('.btn-edit1').attr('disabled', true).css('color', 'gray').css('pointer-events', 'none');
                }
                
            

            },
            error: function (xhr, status, error) {
                console.error("Không thể tải danh sách khách hàng:", error);
            }
        });
    }
    // Lắng nghe sự kiện vẽ lại của DataTables
    table.on('draw.dt', function () {
        const userRole = localStorage.getItem('role');
        if (userRole !== 'admin') {
            // Vô hiệu hóa các nút "Sửa" trên mỗi trang
            $('.btn-edit1').attr('disabled', true).css('color', 'gray').css('pointer-events', 'none');
        }
    });



    loadCustomers();

    /*-------------------------------------------------Xóa------------------------------------------------*/

    let customerIdToDelete;

    $(document).on('click', '.btn-delete1', function () {
        customerIdToDelete = $(this).data('id');
        $("#confirmDeleteModal1").show(); 
        $("#overlay").show();
    });

    $("#confirmDeleteBtn1").on("click", function () {
        $.ajax({
            url: `https://resmant11111-001-site1.anytempurl.com/Customer/Delete?id=${customerIdToDelete}`,
            method: "POST",
            success: function (response) {
                loadCustomers();
                showNotification("Tài khoản đã được xóa thành công!");
                $("#confirmDeleteModal1").hide(); 
            },
            error: function (xhr, status, error) {
                console.error("Không thể xóa tài khoản:", error);
                alert("Có lỗi xảy ra khi xóa tài khoản.");
            }
        });
    });

    $("#cancelDeleteBtn1").on("click", function () {
        closeModal2();
    });



    
    /*-------------------------------------------------Sửa------------------------------------------------*/

    let CustomerId;

    $(document).on('click', '.btn-edit1', function () {
        CustomerId = $(this).data('id'); 
        $.ajax({
            url: `https://resmant11111-001-site1.anytempurl.com/Customer/GetById?id=${CustomerId}`,
            method: "GET",
            success: function (customer) {
                $("#UsernameEdit").val(customer.username);
                $("#NameEdit").val(customer.fullName);
                $("#PasswordEdit").val(customer.password);
                $("#EmailEdit").val(customer.email);
                $("#PhoneEdit").val(customer.phoneNumber);
                $("#PointEdit").val(customer.point);
                $("#DayEdit").val(formatDateToVietnameseTimezone(customer.dateJoined)); 
                $("#editCustomerModal").show(); 
                $("#overlay").show();
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải thông tin tài khoản:", error);
            }
        });
    });

    $("#cancelEditCustomerBtn").click(function () {
        closeModal(); 

    });

    $("#saveEditCustomerBtn").click(function () {
        var username = $("#UsernameEdit").val().trim();
        var fullName = $("#NameEdit").val();
        var password = $("#PasswordEdit").val();
        var email = $("#EmailEdit").val();
        var phoneNumber = $("#PhoneEdit").val();
        var point = parseFloat($("#PointEdit").val(), 10);
        var dayJoined = $("#DayEdit").val(); 

        const validateEmail = (email) => {
            return email.match(
              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
          };
    
        // Kiểm tra các điều kiện
        if (!password) {
            document.querySelector('.error-message1').innerText = "Vui lòng nhập password"; 
            document.querySelector('.error-message1').style.display = 'block'; 
            loadingIcon.style.display = 'none';
            return; 
        }
    
        if (!email || !validateEmail(email)) {
            document.querySelector('.error-message1').innerText = "Vui lòng nhập email đúng định dạng"; 
            document.querySelector('.error-message1').style.display = 'block'; 
            loadingIcon.style.display = 'none'; 
            return; 
        }
    
        if (!fullName) {
            document.querySelector('.error-message1').innerText = "Vui lòng điền đầy đủ tên"; 
            document.querySelector('.error-message1').style.display = 'block'; 
            loadingIcon.style.display = 'none';
            return; 
        }
        if (point < 0 || !Number.isInteger(point)) {
            document.querySelector('.error-message1').innerText = "Điểm phải là số nguyên dương "; 
            document.querySelector('.error-message1').style.display = 'block'; 
            loadingIcon.style.display = 'none'; 
            return; 
        }
    
        if (!phoneNumber) {
            document.querySelector('.error-message').innerText = "Vui lòng nhập số điện thoại"; 
            document.querySelector('.error-message').style.display = 'block'; 
            loadingIcon.style.display = 'none'; 
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
            dayJoined: dayJoined,
        };
    
        $.ajax({
            url: "https://resmant11111-001-site1.anytempurl.com/Customer/Update",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updatedCustomer),
            success: function (response) {
                loadCustomers();
                $("#editCustomerModal").hide();
                
                showNotification("Tài khoản đã được cập nhật thành công!");
            },
            error: function (xhr, status, error) {
                console.error("Không thể cập nhật tài khoản:", error);
                alert("Có lỗi xảy ra khi cập nhật tài khoản.");
            }
        });
    });

    function showNotification(message) {
        $("#notificationMessage").text(message);
        $("#notificationModal").show(); 
    }

    // Khi nhấn nút Đóng trong modal thông báo
    $("#closeNotificationBtn").click(function () {
        closeModal2(); 
    });
});

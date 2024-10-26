$(document).ready(function() {
    // Ẩn bảng Quản lý khách hàng khi trang được tải lần đầu
    $('#CustomerContent').hide();
    $('#VoucherContent').hide();
    $('#StaffContent').hide();
    
    // Hàm làm nổi bật mục menu hiện tại
    function setActiveMenu(selectedMenu) {
        // Xóa lớp 'active' khỏi tất cả các mục
        $('.sidebar a').removeClass('active');
        // Thêm lớp 'active' vào mục được chọn
        $(selectedMenu).addClass('active');
    }

    // Xử lý sự kiện khi nhấn vào "Quản lý Menu"
    $('#manageMenu').click(function() {
        $('#MenuContent').show(); 
        $('#CustomerContent').hide();
        $('#VoucherContent').hide();
        $('#StaffContent').hide();
        setActiveMenu(this); // Làm nổi bật mục được chọn
    });

    // Xử lý sự kiện khi nhấn vào "Quản lý khách hàng"
    $('#manageCustomer').click(function() {
        $('#MenuContent').hide(); // Hiển thị bảng Menu
        $('#CustomerContent').show(); // Ẩn bảng Khách hàng
        $('#VoucherContent').hide();
        $('#StaffContent').hide();
        setActiveMenu(this); // Làm nổi bật mục được chọn
    });

    $('#manageVoucher').click(function() {
        $('#MenuContent').hide(); // Hiển thị bảng Menu
        $('#CustomerContent').hide(); // Ẩn bảng Khách hàng
        $('#VoucherContent').show();
        $('#StaffContent').hide();
        setActiveMenu(this); // Làm nổi bật mục được chọn
    });
    $('#manageStaff').click(function() {
        $('#MenuContent').hide(); // Hiển thị bảng Menu
        $('#CustomerContent').hide(); // Ẩn bảng Khách hàng
        $('#VoucherContent').hide();
        $('#StaffContent').show();
        setActiveMenu(this); // Làm nổi bật mục được chọn
    });
    // Lấy fullname từ localStorage và hiển thị
    const fullName = localStorage.getItem('fullName');  
    document.getElementById('welcomeMessage').innerText = `Welcome: ${fullName}`;
    
    // ngăn người dùng quay lại sau khi đăng xuất

    $(document).ready(function () {
        $('#logoutButton').on('click', function (e) {
            e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
    
            // Xóa toàn bộ bộ nhớ cache
            sessionStorage.clear(); // Xóa dữ liệu trong session storage (nếu bạn sử dụng session storage)
            localStorage.clear(); // Xóa dữ liệu trong local storage (nếu bạn sử dụng local storage)
    
            // Chuyển hướng về trang đăng nhập
            window.location.href = 'LoginAdmin.html';
        });

        // Kiểm tra xem người dùng đã đăng nhập chưa
        const fullName = localStorage.getItem('fullName');
        if (!fullName) {
            // Nếu không có fullname, chuyển hướng về trang đăng nhập
            window.location.href = 'LoginAdmin.html';
        }
        
        $('#logoutButton').on('click', function (e) {
            e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
    
            // Xóa toàn bộ bộ nhớ cache
            sessionStorage.clear(); // Xóa dữ liệu trong session storage (nếu bạn sử dụng session storage)
            localStorage.clear(); // Xóa dữ liệu trong local storage (nếu bạn sử dụng local storage)
    
            // Chuyển hướng về trang đăng nhập
            window.location.href = 'LoginAdmin.html';
        });
    });
    

});

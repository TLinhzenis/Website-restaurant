$(document).ready(function() {
    // Hàm làm nổi bật mục menu hiện tại
    function setActiveMenu(selectedMenu) {
        // Xóa lớp 'active' khỏi tất cả các mục
        $('.sidebar a').removeClass('active');
        // Thêm lớp 'active' vào mục được chọn
        $(selectedMenu).addClass('active');
    }

    // Ẩn bảng Quản lý khách hàng khi trang được tải lần đầu
    $('#CustomerContent').hide();
    $('#VoucherContent').hide();
    $('#StaffContent').hide();


    // Xử lý sự kiện khi nhấn vào "Quản lý Menu"
    $('#manageMenu').click(function() {
        $('#MenuContent').show(); 
        $('#CustomerContent').hide();
        $('#VoucherContent').hide();
        $('#StaffContent').hide();
        setActiveMenu(this); // Làm nổi bật mục được chọn
    });
    $('#manageMenu').click();

    // Xử lý sự kiện khi nhấn vào "Quản lý khách hàng"
    $('#manageCustomer').click(function() {
        $('#MenuContent').hide(); // Ẩn bảng Menu
        $('#CustomerContent').show(); // Hiển thị bảng Khách hàng
        $('#VoucherContent').hide();
        $('#StaffContent').hide();
        setActiveMenu(this); // Làm nổi bật mục được chọn
    });

    // Xử lý sự kiện khi nhấn vào "Quản lý Voucher"
    $('#manageVoucher').click(function() {
        $('#MenuContent').hide();
        $('#CustomerContent').hide();
        $('#VoucherContent').show();
        $('#StaffContent').hide();
        setActiveMenu(this); // Làm nổi bật mục được chọn
    });

    // Xử lý sự kiện khi nhấn vào "Quản lý Nhân viên"
    $('#manageStaff').click(function() {
        $('#MenuContent').hide();
        $('#CustomerContent').hide();
        $('#VoucherContent').hide();
        $('#StaffContent').show();
        setActiveMenu(this); // Làm nổi bật mục được chọn
    });

    // Lấy fullname từ localStorage và hiển thị
    const fullName = localStorage.getItem('fullName');  
    document.getElementById('welcomeMessage').innerText = `Welcome: ${fullName}`;

    // Ngăn người dùng quay lại sau khi đăng xuất
    $('#logoutButton').on('click', function (e) {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
        // Xóa toàn bộ bộ nhớ cache
        sessionStorage.clear();
        localStorage.clear();
        // Chuyển hướng về trang đăng nhập
        window.location.href = 'LoginAdmin.html';
    });

    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!fullName) {
        // Nếu không có fullname, chuyển hướng về trang đăng nhập
        window.location.href = 'LoginAdmin.html';
    }
});

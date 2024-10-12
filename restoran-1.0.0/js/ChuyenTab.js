$(document).ready(function() {
    // Ẩn bảng Quản lý khách hàng khi trang được tải lần đầu
    $('#CustomerContent').hide();
    $('#VoucherContent').hide();
    
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
        setActiveMenu(this); // Làm nổi bật mục được chọn
    });

    // Xử lý sự kiện khi nhấn vào "Quản lý khách hàng"
    $('#manageCustomer').click(function() {
        $('#MenuContent').hide(); // Hiển thị bảng Menu
        $('#CustomerContent').show(); // Ẩn bảng Khách hàng
        $('#VoucherContent').hide();
        setActiveMenu(this); // Làm nổi bật mục được chọn
    });

    $('#manageVoucher').click(function() {
        $('#MenuContent').hide(); // Hiển thị bảng Menu
        $('#CustomerContent').hide(); // Ẩn bảng Khách hàng
        $('#VoucherContent').show();
        setActiveMenu(this); // Làm nổi bật mục được chọn
    });
});

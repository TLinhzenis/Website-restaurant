$(document).ready(function() {

    function formatPrice(price) {
        return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
    }
    

    function fetchStaffs() {
        $.ajax({
            url: 'https://resmant1111-001-site1.jtempurl.com/Staff/List', // API lấy danh sách voucher
            method: 'GET',
            success: function(data) {
                renderVoucherList(data);
            },
            error: function(error) {
                console.error("Lỗi khi lấy danh sách nhân viên:", error);
            }
        });
    }

    function renderVoucherList(staffs) {
        const container = $('#staffContainer');
        container.empty(); // Xóa nội dung cũ nếu có

        staffs.forEach(function(staff) {
            if(staff.role == 'Bếp trưởng'){
            const staffHtml = `
                    <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                        <div class="team-item text-center rounded overflow-hidden">
                            <div class="rounded-circle overflow-hidden m-4">
                                <img class="img-fluid" src="https://resmant1111-001-site1.jtempurl.com/uploads/${staff.image}" alt="${staff.fullName}" style="height: 252px;">
                            </div>
                            <h5 class="mb-0">${staff.fullName}</h5>
                            <small>${staff.role}</small>
                            <div class="d-flex justify-content-center mt-3">
                                <a class="btn btn-square btn-primary mx-1" href=""><i class="fab fa-facebook-f"></i></a>
                                <a class="btn btn-square btn-primary mx-1" href=""><i class="fab fa-twitter"></i></a>
                                <a class="btn btn-square btn-primary mx-1" href=""><i class="fab fa-instagram"></i></a>
                            </div>
                        </div>
                    </div>
                
            `;
            container.append(staffHtml);
    }});
        
    }

    fetchStaffs(); // Gọi hàm để lấy và hiển thị voucher
});

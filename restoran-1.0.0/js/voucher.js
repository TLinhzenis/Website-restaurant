$(document).ready(function() {

    function formatPrice(price) {
        return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
    }
    

    function fetchVouchers() {
        $.ajax({
            url: 'https://resmant11111-001-site1.anytempurl.com/Voucher/List', // API lấy danh sách voucher
            method: 'GET',
            success: function(data) {
                renderVoucherList(data);
            },
            error: function(error) {
                console.error("Lỗi khi lấy danh sách voucher:", error);
            }
        });
    }

    function renderVoucherList(vouchers) {
        const container = $('#menuContainer');
        container.empty(); // Xóa nội dung cũ nếu có

        vouchers.forEach(function(voucher) {
            const voucherHtml = `
                <div class="col-lg-3 col-md-6">
                    <div class="card h-100">
                        
                        <div class="card-body">
                            <h5 class="card-title"><i class="fa fa-3x fa-solid fa-ticket text-primary"></i></h5>
                            <h5 class="card-title"> ${voucher.voucherType} %</h5>
                            <p class="card-text">${formatPrice(voucher.voucherPoint)} điểm</p>

                        </div>
                    </div>
                </div>
            `;
            container.append(voucherHtml);
        });
    }

    fetchVouchers(); // Gọi hàm để lấy và hiển thị voucher
});

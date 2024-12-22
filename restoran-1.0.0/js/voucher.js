$(document).ready(function () {
    // Hàm định dạng giá trị điểm
    function formatPrice(price) {
        return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
    }

    // Hàm lấy danh sách voucher từ API
    function fetchVouchers() {
        $.ajax({
            url: 'https://resmant11111-001-site1.anytempurl.com/Voucher/List', // URL API
            method: 'GET',
            success: function (data) {
                renderVoucherList(data); // Hiển thị danh sách voucher
            },
            error: function (error) {
                console.error("Lỗi khi lấy danh sách voucher:", error);
            }
        });
    }

    // Hàm hiển thị danh sách voucher
    function renderVoucherList(vouchers) {
        const container = $('#menuContainer');
        container.empty();

        vouchers.forEach(function (voucher) {
            const voucherHtml = `
                <div class="col-lg-3 col-md-6">
                    <div class="card h-100" data-voucher-id="${voucher.voucherId}" data-voucher-price="${voucher.voucherPoint}">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="fa fa-3x fa-solid fa-ticket text-primary"></i> 
                            </h5>
                            <h5 class="card-title">${voucher.voucherType} %</h5>
                            <p class="card-text">${formatPrice(voucher.voucherPoint)} điểm</p>
                        </div>
                    </div>
                </div>
            `;
            container.append(voucherHtml);
        });

        // Gắn sự kiện click cho các card voucher
        $('#menuContainer').on('click', '.card', function () {
            const voucherId = $(this).data('voucher-id');
            const voucherPrice = $(this).data('voucher-price');
            showConfirmModal(voucherId, voucherPrice);
        });
    }

    // Hiển thị modal xác nhận
    function showConfirmModal(voucherId, voucherPrice) {
        $('#overlay').show();
        $('#confirmModal').show();

        // Xử lý sự kiện khi nhấn "Có"
        $('#confirmBtn').off('click').on('click', function () {
            buyVoucher(voucherId, voucherPrice);
            closeConfirmModal();
        });

        // Xử lý sự kiện khi nhấn "Không"
        $('#cancelBtn').off('click').on('click', function () {
            closeConfirmModal();
        });
    }

    // Đóng modal
    function closeConfirmModal() {
        closeModal2();
    }

    // Hàm mua voucher
    function buyVoucher(voucherId, voucherPrice) {
        const customerId = localStorage.getItem('customerId');
        if (!customerId) {
            showNotification("Bạn cần đăng nhập để mua voucher");
            return;
        }

        $.ajax({
            url: 'https://resmant11111-001-site1.anytempurl.com/Voucher/Buy',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                CustomerId: customerId,
                VoucherId: voucherId,
                VoucherPrice: voucherPrice
            }),
            success: function (response) {
                showNotification2("Mua voucher thành công!");
                
                const remainingPoints = response.pointsRemaining;

                // Lưu số điểm còn lại vào localStorage
                localStorage.setItem('point', remainingPoints);
                
            },
            error: function (error) {
                const errorMessage = error.responseJSON?.message;
    
                if (errorMessage === "Bạn không đủ điểm để mua voucher") {
                    showNotification("Bạn không đủ điểm để đổi voucher này");
                } else {
                    console.error("Lỗi khi mua voucher:", error);
                    showNotification("Có lỗi xảy ra khi mua voucher. Vui lòng thử lại.");
                }
            }
        });
    }



    // Lấy danh sách voucher khi trang tải
    fetchVouchers();
});

function closeModal2() {
    $("#notificationModal").addClass("closing");
    $("#notificationModal2").addClass("closing");
    $("#confirmModal").addClass("closing");

    // Đảm bảo thời gian khớp với animation trong CSS
    setTimeout(function () {
        $("#notificationModal").hide();
        $("#notificationModal2").hide();
        $("#confirmModal").hide();
        $("#overlay").hide();
        $("#notificationModal").removeClass("closing");
        $("#notificationModal2").removeClass("closing");
        $("#confirmModal").removeClass("closing");
        
    }, 500); // Thời gian trùng với slideDown
}

$("#overlay").click(function (e) {
    if ($(e.target).is("#overlay")) {
        closeModal2();
    }
});

function showNotification(message) {
    $("#notificationMessage").text(message);
    $("#overlay").show();
    $("#notificationModal").show(); // Hiển thị modal
}

// Đóng modal khi nhấn nút
$("#closeNotificationBtn").click(function () {
    closeModal2();
});

function showNotification2(message) {
    $("#notificationMessage2").text(message);
    $("#overlay").show();
    $("#notificationModal2").show(); // Hiển thị modal
}

// Đóng modal khi nhấn nút
$("#closeNotificationBtn2").click(function () {
    closeModal2();
    setTimeout(function () {
        location.reload(); // Tải lại trang sau 0.5 giây
    }, 600); 
});



const point = localStorage.getItem('point');
document.getElementById('pointLabel').innerText = 'Điểm của bạn:';
document.getElementById('pointValue').innerText = formatPrice(point);


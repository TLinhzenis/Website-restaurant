document.addEventListener('DOMContentLoaded', async function () {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
        alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        window.location.href = 'LoginUser.html'; // Điều hướng đến trang đăng nhập
        return;
    }

    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Định dạng số
    }

    // Lấy thông tin khách hàng từ API
    try {
        const response = await fetch(`https://resmant11111-001-site1.anytempurl.com/Customer/GetById?id=${customerId}`);
        if (!response.ok) {
            throw new Error('Không thể tải thông tin khách hàng.');
        }
        const customer = await response.json();

        // Hiển thị thông tin lên form
        document.getElementById('UserName').value = customer.username;
        document.getElementById('FullName').value = customer.fullName;
        document.getElementById('Email').value = customer.email;
        document.getElementById('PhoneNumber').value = customer.phoneNumber;
        
        document.getElementById('point').innerText = formatPrice(customer.point);

        currentPassword = customer.password;
        currentPoint = customer.point;
    } catch (error) {
        console.error(error);
        alert('Đã xảy ra lỗi khi tải thông tin khách hàng.');
    }

    // Xử lý sự kiện lưu thông tin
    document.querySelector('form').addEventListener('submit', async function (event) {
        event.preventDefault(); // Ngăn chặn form gửi yêu cầu mặc định

        if ( !FullName || !Email || !PhoneNumber) {
            document.querySelector('.error-message1').innerText = "Vui lòng nhập đầy đủ thông tin."; // Thông báo cho ô username
            document.querySelector('.error-message1').style.display = 'block'; // Hiển thị phần tử thông báo
            return;
        }


        const updatedFullName = document.getElementById('FullName').value;

        const updatedCustomer = {
            customerId: customerId,
            username: document.getElementById('UserName').value,
            fullName: document.getElementById('FullName').value,
            email: document.getElementById('Email').value,
            phoneNumber: document.getElementById('PhoneNumber').value,
            password: currentPassword,
            point:currentPoint
        };

        try {
            const response = await fetch('https://resmant11111-001-site1.anytempurl.com/Customer/Update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedCustomer)
            });

            if (!response.ok) {
                throw new Error('Không thể cập nhật thông tin.');
            }
            // Lưu fullName mới vào LocalStorage
            localStorage.setItem('fullNameU', updatedFullName);

            // Cập nhật welcomeMessage
            document.getElementById('welcomeMessage').innerText = updatedFullName;
            
            showNotification("Cập nhật thông tin thành công!");
        } catch (error) {
            console.error(error);
            alert('Đã xảy ra lỗi khi cập nhật thông tin.');
        }
    });

    document.getElementById('saveMK').addEventListener('click', async function () {
        const currentPassword = document.getElementById('Password').value.trim();
        const newPassword = document.getElementById('NewPassword').value.trim();

        if (!currentPassword || !newPassword) {
            document.querySelector('.error-message').innerText = "Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới."; // Thông báo cho ô username
            document.querySelector('.error-message').style.display = 'block'; // Hiển thị phần tử thông báo
            return;
        }

        if (newPassword.length < 6) {
            document.querySelector('.error-message').innerText = "Mật khẩu phải từ 6 kí tự trở lên"; // Thông báo cho ô username
            document.querySelector('.error-message').style.display = 'block'; // Hiển thị phần tử thông báo
            return;
        }

        try {
            // Gọi API để lấy thông tin khách hàng
            const response = await fetch(`https://resmant11111-001-site1.anytempurl.com/Customer/GetById?id=${customerId}`);
            if (!response.ok) {
                throw new Error('Không thể tải thông tin khách hàng.');
            }

            const customer = await response.json();

            // So sánh mật khẩu hiện tại
            if (customer.password !== currentPassword) {
                document.querySelector('.error-message').innerText = "Mật khẩu hiện tại không chính xác."; // Thông báo cho ô username
                document.querySelector('.error-message').style.display = 'block'; // Hiển thị phần tử thông báo
                return;
            }

            // Cập nhật mật khẩu mới
            customer.password = newPassword;

            const updateResponse = await fetch('https://resmant11111-001-site1.anytempurl.com/Customer/Update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customer)
            });

            if (!updateResponse.ok) {
                throw new Error('Không thể cập nhật mật khẩu.');
            }

            showNotification("Đổi mật khẩu thành công!");
            document.getElementById('Password').value = '';
            document.getElementById('NewPassword').value = '';
        } catch (error) {
            console.error(error);
            alert('Đã xảy ra lỗi khi đổi mật khẩu.');
        }
    });

});
// Lấy CustomerId từ localStorage
const customerId = localStorage.getItem('customerId');

if (customerId) {
    
    fetch("https://resmant11111-001-site1.anytempurl.com/VoucherWallet/List")
        .then(response => response.json())
        .then(data => {
            // Lọc danh sách voucher theo CustomerId
            const customerVouchers = data.filter(voucher => voucher.customerId == customerId);

            
            const voucherPromises = customerVouchers.map(voucher =>
                fetch(`https://resmant11111-001-site1.anytempurl.com/Voucher/GetById?id=${voucher.voucherId}`)
                    .then(response => response.json())
                    .then(voucherDetails => ({
                        ...voucher,
                        voucherType: voucherDetails.voucherType 
                    }))
            );

            // Chờ tất cả các yêu cầu API hoàn thành
            Promise.all(voucherPromises)
                .then(vouchersWithDetails => {
                    // Hiển thị danh sách voucher
                    renderVoucherList(vouchersWithDetails);
                })
                .catch(error => {
                    console.error("Lỗi khi lấy thông tin VoucherType:", error);
                });
        })
        .catch(error => {
            console.error("Lỗi khi lấy danh sách voucher:", error);
        });
} else {
    console.error("CustomerId không tồn tại trong localStorage.");
}

// Hàm hiển thị danh sách voucher
function renderVoucherList(vouchers) {
    const voucherContainer = document.getElementById("settings");
    const voucherListHtml = vouchers.map(voucher => `
        <div class="voucher-item d-flex align-items-center mb-3">
            <i class="fa fa-3x fa-solid fa-ticket text-primary me-3"></i>
            <div>
                <h5>Loại Voucher: ${voucher.voucherType} %</h5>
                <p>Số lượng: ${voucher.quantity}</p>
            </div>
        </div>
        <hr>
    `).join("");

    voucherContainer.innerHTML += `
        <div class="voucher-list">
            ${voucherListHtml}
        </div>
    `;
}

function closeModal2() {
    $("#notificationModal").addClass("closing");

    
    setTimeout(function () {
        $("#notificationModal").hide();
        $("#overlay").hide();
        $("#notificationModal").removeClass("closing");
        location.reload(); 
    }, 500); 
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





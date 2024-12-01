$(function () {
    $('#datetime').datetimepicker({
        format: 'L'  // Chỉ hiển thị ngày
    });
});

document.getElementById("datetime").addEventListener("change", checkAvailableTables);
document.getElementById("timeSelect").addEventListener("change", checkAvailableTables);

function checkAvailableTables() {
    const date = document.getElementById("datetime").value;
    const time = document.getElementById("timeSelect").value;

    if (date && time) {
        const reservationDateTime = `${date}T${time}:00`;
        const url = `https://resmant11111-001-site1.anytempurl.com/Reservation/AvailableTables?reservationDateTime=${encodeURIComponent(reservationDateTime)}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const tableSelect = document.getElementById("tableSelect");
                tableSelect.innerHTML = ''; // Xóa các tùy chọn cũ

                const defaultOption = document.createElement("option");
                defaultOption.value = "";
                defaultOption.text = "Select Table";
                tableSelect.appendChild(defaultOption);

                data.forEach(table => {
                    const option = document.createElement("option");
                    option.value = table.tableId;
                    option.text = `Bàn ${table.tableNumber} - Loại bàn: ${table.capacity} người`;
                    tableSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching available tables:', error));
    }
}
document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault();  // Ngăn chặn gửi form
});

document.addEventListener("DOMContentLoaded", function() {
    const now = new Date();
    document.getElementById("datetime").min = now.toISOString().split("T")[0];
});

document.getElementById("bookNowBtn").addEventListener("click", function(event) {
    event.preventDefault();

    const customerId = localStorage.getItem("customerId");
    const reservationDateTime = `${document.getElementById("datetime").value}T${document.getElementById("timeSelect").value}:00`;
    const tableId = document.getElementById("tableSelect").value;
    const specialRequest = document.getElementById("message").value;

    const now = new Date();
    const reservationDate = new Date(reservationDateTime);

    if (!customerId) {
        showNotification(
            "Bạn chưa đăng nhập, vui lòng đăng nhập để tiếp tục.",
            "Đăng nhập",  // Text của đường dẫn
            "LoginUser.html"       // Địa chỉ trang đích
        );
        return;
    }
    

    if ( !reservationDateTime || !tableId) {
        showNotification("Vui lòng điền đầy đủ thông tin.");
        return;
    }


    if (reservationDate < now) {
        showNotification("Vui lòng đặt bàn trước ít nhất 2 giờ.");
        return;
    }

    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    if (reservationDate < twoHoursLater) {
        showNotification("Vui lòng đặt bàn trước ít nhất 2 giờ.");
        return;
    }

    const reservation = {
        CustomerId: customerId,
        ReservationTime: reservationDateTime,
        TableId: tableId,
        SpecialRequest: specialRequest
    };

    fetch('https://resmant11111-001-site1.anytempurl.com/Reservation/Insert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservation)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        showNotification("Đặt bàn thành công!");
        $("#closeNotificationBtn").off('click').on('click', function () {
            $("#notificationModal").hide();
            location.reload(); // Tải lại trang
        });
    })
    .catch(error => console.error('Error:', error));
});

function showNotification(message, linkText = null, linkHref = null) {
    // Nếu có liên kết, hiển thị nó
    if (linkText && linkHref) {
        $("#notificationLink")
            .text(linkText) // Nội dung liên kết
            .attr("href", linkHref) // Địa chỉ liên kết
            .show(); // Hiển thị liên kết
    } else {
        $("#notificationLink").hide(); // Ẩn nếu không có liên kết
    }

    // Hiển thị thông báo
    $("#notificationMessage").text(message);
    $("#notificationModal").show();
}

// Ẩn modal khi đóng
$("#closeNotificationBtn").click(function () {
    $("#notificationModal").hide();
});


$(document).ready(function () {
    var table = $('#VoucherTable').DataTable({
        columns: [
            { title: "Loại voucher" },
            { title: "Số điểm cần", width: "200px" },
            { title: "Chức năng", width: "100px" }
        ]
        
    });

    function formatPrice(price) {
        return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0";
    }

    /*-------------------------------------------------Animation & ovelay------------------------------------------------*/
    function closeModal2() {
    
        $("#notificationModal").addClass("closing");
        $("#confirmDeleteModal2").addClass("closing");
        setTimeout(function () {
    
            $("#notificationModal").hide();;
            $("#confirmDeleteModal2").hide();
            $("#overlay").hide(); 

            $("#notificationModal").removeClass("closing");
            $("#confirmDeleteModal2").removeClass("closing");
        }, 500); 
    }
    function closeModal() {
        $("#editVoucherModal").addClass("closing");
        $("#addVoucherModal").addClass("closing");
        
        setTimeout(function () {
            $("#editVoucherModal").hide();
            $("#addVoucherModal").hide();
            $("#overlay").hide();
            resetVoucherModal();
            $("#addVoucherModal").removeClass("closing");
            $("#editVoucherModal").removeClass("closing");
        }, 900); 
    }
    $("#overlay").click(function (e) {
        if ($(e.target).is("#overlay")) {
            closeModal();
            closeModal2()
        }
    });

    function resetVoucherModal() {
        $("#voucherType").val(""); // Xóa tên món ăn
        $("#voucherPoint").val(""); // Reset phân loại
        
        
    }
    /*-------------------------------------------------Hiển thị danh sách------------------------------------------------*/

    function loadVouchers() {
        $.ajax({
            url: "https://resmant11111-001-site1.anytempurl.com/Voucher/List",
            method: "GET",
            success: function (response) {
                table.clear();

                response.forEach(function (item) {
                    var row = [
                        item.voucherType + " %",
                        formatPrice(item.voucherPoint),
                        `<a id="btn-edit" class="btn-edit2" data-id="${item.voucherId}"><i class="fa-solid fa-eye"></i></a>

                        <div class="divider"></div>

                         <a id="btn-delete" class="btn-delete2" data-id="${item.voucherId}"><i class="fa-solid fa-trash"></i></a>`
                    ];
                    table.row.add(row).draw();
                });
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải danh sách voucher:", error);
            }
        });
    }
    loadVouchers();

    /*-------------------------------------------------Xóa------------------------------------------------*/
    let voucherIdToDelete;

    $(document).on('click', '.btn-delete2', function () {
        voucherIdToDelete = $(this).data('id');
        $("#confirmDeleteModal2").show();
        $("#overlay").show();
    });

    $("#confirmDeleteBtn2").on("click", function () {
        $.ajax({
            url: `https://resmant11111-001-site1.anytempurl.com/Voucher/Delete?id=${voucherIdToDelete}`,
            method: "POST",
            success: function (response) {
                loadVouchers();
                showNotification("Voucher đã được xóa thành công!");
                $("#confirmDeleteModal2").hide();
            },
            error: function (xhr, status, error) {
                console.error("Không thể xóa voucher:", error);
                alert("Có lỗi xảy ra khi xóa voucher.");
            }
        });
    });

    $("#cancelDeleteBtn2").on("click", function () {
        closeModal2();
    });

/*-------------------------------------------------Thêm------------------------------------------------*/
    $("#addVoucherBtn").click(function () {
        $("#addVoucherModal").show();
        $("#overlay").show();
    });

    $("#cancelVoucherBtn").click(function () {
        closeModal();
    });

    $("#saveVoucherBtn").click(function () {
        var voucherType = $("#voucherType").val().trim();
        var voucherPoint = parseFloat($("#voucherPoint").val());

        if (!voucherType || !voucherPoint) {
            document.querySelector('.error-message3').innerText = "Vui lòng điền đầy đủ thông tin"; // Thông báo cho ô username
            document.querySelector('.error-message3').style.display = 'block'; // Hiển thị phần tử thông báo
            loadingIcon.style.display = 'none'; // Ẩn biểu tượng loading
            return; // Ngừng thực hiện nếu tài khoản trống
        }
        if (!voucherPoint || !Number.isInteger(voucherPoint) || voucherPoint <= 0) {
            document.querySelector('.error-message3').innerText = "Điểm cần là 1 số nguyên lớn hơn 0"; // Thông báo cho ô username
            document.querySelector('.error-message3').style.display = 'block'; // Hiển thị phần tử thông báo
            loadingIcon.style.display = 'none'; // Ẩn biểu tượng loading
            return; // Ngừng thực hiện nếu tài khoản trống
        }

        var newVoucherItem = {
            voucherType: voucherType,
            voucherPoint: voucherPoint
        };

        $.ajax({
            url: "https://resmant11111-001-site1.anytempurl.com/Voucher/Insert",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(newVoucherItem),
            success: function (response) {
                loadVouchers();
                $("#addVoucherModal").hide();
                showNotification("Voucher đã được thêm thành công!");
            },
            error: function (xhr, status, error) {
                console.error("Không thể thêm Voucher:", error);
                alert("Có lỗi xảy ra khi thêm Voucher.");
            }
        });
    });

    /*-------------------------------------------------Sửa------------------------------------------------*/
    let VoucherId;

    $(document).on('click', '.btn-edit2', function () {
        VoucherId = $(this).data('id');
        $.ajax({
            url: `https://resmant11111-001-site1.anytempurl.com/Voucher/GetById?id=${VoucherId}`,
            method: "GET",
            success: function (voucher) {
                $("#voucherTypeEdit").val(voucher.voucherType);
                $("#voucherPointEdit").val(voucher.voucherPoint);
                $("#editVoucherModal").show();
                $("#overlay").show();
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải thông tin voucher:", error);
            }
        });
    });

    $("#cancelEditVoucherBtn").click(function () {
        closeModal();
    });

    $("#saveEditVoucherBtn").click(function () {
        var voucherType = $("#voucherTypeEdit").val().trim();
        var voucherPoint = parseFloat($("#voucherPointEdit").val());

        if (!voucherType || !voucherPoint) {
            document.querySelector('.error-message4').innerText = "Vui lòng điền đầy đủ thông tin"; // Thông báo cho ô username
            document.querySelector('.error-message4').style.display = 'block'; // Hiển thị phần tử thông báo
            loadingIcon.style.display = 'none'; // Ẩn biểu tượng loading
            return; // Ngừng thực hiện nếu tài khoản trống
        }
        if (!voucherPoint || !Number.isInteger(voucherPoint) || voucherPoint <= 0) {
            document.querySelector('.error-message4').innerText = "Điểm cần là 1 số nguyên lớn hơn 0"; // Thông báo cho ô username
            document.querySelector('.error-message4').style.display = 'block'; // Hiển thị phần tử thông báo
            loadingIcon.style.display = 'none'; // Ẩn biểu tượng loading
            return; // Ngừng thực hiện nếu tài khoản trống
        }

        var updatedVoucher = {
            voucherId: VoucherId,
            voucherType: voucherType,
            voucherPoint: voucherPoint
        };

        $.ajax({
            url: "https://resmant11111-001-site1.anytempurl.com/Voucher/Update",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updatedVoucher),
            success: function (response) {
                loadVouchers();
                $("#editVoucherModal").hide();
                showNotification("Voucher đã được cập nhật thành công!");
            },
            error: function (xhr, status, error) {
                console.error("Không thể cập nhật Voucher:", error);
                alert("Có lỗi xảy ra khi cập nhật Voucher.");
            }
        });
    });
    function showNotification(message) {
        $("#notificationMessage").text(message);
        $("#notificationModal").show(); // Hiển thị modal thông báo
    }

    // Khi nhấn nút Đóng trong modal thông báo
    $("#closeNotificationBtn").click(function () {
        closeModal2(); 
    });
});

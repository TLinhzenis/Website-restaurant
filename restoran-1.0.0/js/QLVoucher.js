$(document).ready(function () {
    var table = $('#VoucherTable').DataTable({
        columns: [
            { title: "Loại voucher" },
            { title: "Số điểm cần", width: "200px" },
            { title: "Chức năng", width: "100px" }
        ]
    });
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Định dạng số
    }
    function loadVouchers() {
        $.ajax({
            url: "https://resmant1111-001-site1.jtempurl.com/Voucher/List",
            method: "GET",
            success: function (response) {
                table.clear(); // Xóa dữ liệu cũ

                response.forEach(function (item) {
                    var row = [
                        item.voucherType + " %",
                        formatPrice(item.voucherPoint),
                        `<button class="btn-edit2" data-id="${item.voucherId}">Sửa</button>
                         <button class="btn-delete2" data-id="${item.voucherId}">Xóa</button>`
                    ];
                    table.row.add(row).draw(); // Thêm hàng mới
                });

            },
            error: function (xhr, status, error) {
                console.error("Không thể tải danh sách voucher:", error);
            }
        });
    }
    loadVouchers();

    //Xóa

    let voucherIdToDelete;

    $(document).on('click', '.btn-delete2', function () {
        voucherIdToDelete = $(this).data('id');
        $("#confirmDeleteModal2").show(); // Hiện modal xác nhận
    });

    $("#confirmDeleteBtn2").on("click", function () {
        $.ajax({
            url: `https://resmant1111-001-site1.jtempurl.com/Voucher/Delete?id=${voucherIdToDelete}`,
            method: "POST",
            success: function (response) {
                loadVouchers();
                alert("Voucher đã được xóa thành công!");
                $("#confirmDeleteModal2").hide(); // Ẩn modal xác nhận
            },
            error: function (xhr, status, error) {
                console.error("Không thể xóa voucher:", error);
                alert("Có lỗi xảy ra khi xóa voucher.");
            }
        });
    });

    $("#cancelDeleteBtn2").on("click", function () {
        $("#confirmDeleteModal2").hide(); // Ẩn modal xác nhận
    });

    //Thêm
    $("#addVoucherBtn").click(function () {
        $("#addVoucherModal").show(); // Hiển thị modal thêm món ăn
    });

    $("#cancelVoucherBtn").click(function () {
        $("#addVoucherModal").hide(); // Ẩn modal
    });

    $("#saveVoucherBtn").click(function () {
        var voucherType = $("#voucherType").val().trim();
        
        var voucherPoint = parseFloat($("#voucherPoint").val());

        // Kiểm tra các điều kiện
        if (!voucherType) {
            alert("Loại voucher không được để trống.");
            return;
        }
        if (!voucherPoint || !Number.isInteger(voucherPoint) || voucherPoint <= 0) {
            alert("Điểm số phải là số nguyên và lớn hơn 0.");
            return;
        }

        

        
            var newVoucherItem = {
                voucherType: voucherType,
                voucherPoint: voucherPoint, 
                
            };

            $.ajax({
                url: "https://resmant1111-001-site1.jtempurl.com/Voucher/Insert",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(newVoucherItem),
                success: function (response) {
                    loadVouchers();
                    $("#addVoucherModal").hide(); // Ẩn modal
                    alert("Voucher đã được thêm thành công!");
                },
                error: function (xhr, status, error) {
                    console.error("Không thể thêm Voucher:", error);
                    alert("Có lỗi xảy ra khi thêm Voucher.");
                }
            });
        
    });

    // Xử lý sự kiện cho nút "Sửa"


    let VoucherId;

    $(document).on('click', '.btn-edit2', function () {
        VoucherId = $(this).data('id'); // Lưu ID món ăn cần sửa
        $.ajax({
            url: `https://resmant1111-001-site1.jtempurl.com/Voucher/GetById?id=${VoucherId}`,
            method: "GET",
            success: function (voucher) {
                $("#voucherTypeEdit").val(voucher.voucherType);
                $("#voucherPointEdit").val(voucher.voucherPoint);
                
                $("#editVoucherModal").show(); // Hiện modal sửa món ăn
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải thông tin voucher:", error);
            }
        });
    });

    $("#cancelEditVoucherBtn").click(function () {
        $("#editVoucherModal").hide(); // Ẩn modal sửa món ăn
    });

    $("#saveEditVoucherBtn").click(function () {
        var voucherType = $("#voucherTypeEdit").val().trim();
        var voucherPoint = parseFloat($("#voucherPoint").val());
        
    
        // Kiểm tra các điều kiện
        if (!voucherType) {
            alert("Loại voucher không được để trống.");
            return;
        }
        if (!voucherPoint || !Number.isInteger(voucherPoint) || voucherPoint <= 0) {
            alert("Điểm số phải là số nguyên và lớn hơn 0.");
            return;
        }

    
        
    
        var updatedVoucher = {
            VoucherId: VoucherId,
            voucherType: voucherType,
            voucherPoint: voucherPoint,
           
        };
    
        $.ajax({
            url: "https://resmant1111-001-site1.jtempurl.com/Voucher/Update",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updatedVoucher),
            success: function (response) {
                loadVouchers();
                $("#editVoucherModal").hide();
                alert("Voucher đã được cập nhật thành công!");
            },
            error: function (xhr, status, error) {
                console.error("Không thể cập nhật Voucher:", error);
                alert("Có lỗi xảy ra khi cập nhật Voucher.");
            }
        });
    });

});
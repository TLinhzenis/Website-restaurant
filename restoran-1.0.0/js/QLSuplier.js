$(document).ready(function () {
    var table = $('#SupplierTable').DataTable({
        columns: [
            { title: "Tên nhà cung cấp" },
            { title: "Thông tin liên hệ", width: "200px" },
            { title: "Chức năng", width: "100px" }
        ],
        autoWidth: false
        
    });


    /*-------------------------------------------------Animation & ovelay------------------------------------------------*/
    function closeModal2() {
    
        $("#notificationModal").addClass("closing");
        $("#confirmDeleteModalSupplier").addClass("closing");
        setTimeout(function () {
    
            $("#notificationModal").hide();;
            $("#confirmDeleteModalSupplier").hide();
            $("#overlay").hide(); 

            $("#notificationModal").removeClass("closing");
            $("#confirmDeleteModalSupplier").removeClass("closing");
        }, 500); 
    }
    function closeModal() {
        $("#editSupplierModal").addClass("closing");
        $("#addSupplierModal").addClass("closing");
        
        setTimeout(function () {
            $("#editSupplierModal").hide();
            $("#addSupplierModal").hide();
            $("#overlay").hide();
            resetSuppModal();
            $("#addSupplierModal").removeClass("closing");
            $("#editSupplierModal").removeClass("closing");
        }, 900); 
    }
    $("#overlay").click(function (e) {
        if ($(e.target).is("#overlay")) {
            closeModal();
            closeModal2()
        }
    });

    function resetSuppModal() {
        $("#supplierName").val(""); // Xóa tên món ăn
        $("#contactInfo").val(""); // Reset phân loại
        
        
    }
    /*-------------------------------------------------Hiển thị danh sách------------------------------------------------*/

    function loadSuppliers() {
        $.ajax({
            url: "https://resmant11111-001-site1.anytempurl.com/Supplier/List",
            method: "GET",
            success: function (response) {
                table.clear();

                response.forEach(function (item) {
                    var row = [
                        item.supplierName,
                        item.contactInfo,
                        `<a id="btn-edit" class="btn-edit-supplier" data-id="${item.supplierId}"><i class="fa-solid fa-eye"></i></a>

                        <div class="divider"></div>

                         <a id="btn-delete" class="btn-delete-supplier" data-id="${item.supplierId}"><i class="fa-solid fa-trash"></i></a>`
                    ];
                    table.row.add(row).draw();
                });
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải danh sách supplier:", error);
            }
        });
    }
    loadSuppliers();

    /*-------------------------------------------------Xóa------------------------------------------------*/
    let supplierIdToDelete;

    $(document).on('click', '.btn-delete-supplier', function () {
        supplierIdToDelete = $(this).data('id');
        $("#confirmDeleteModalSupplier").show();
        $("#overlay").show();
    });

    $("#confirmDeleteBtnSupplier").on("click", function () {
        $.ajax({
            url: `https://resmant11111-001-site1.anytempurl.com/Supplier/Delete?id=${supplierIdToDelete}`,
            method: "POST",
            success: function (response) {
                loadSuppliers();
                showNotification("Nhà cung cấp đã được xóa thành công!");
                $("#confirmDeleteModalSupplier").hide();
            },
            error: function (xhr, status, error) {
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    // Hiển thị thông báo lỗi trả về từ API
                    $("#confirmDeleteModalSupplier").hide();
                    showNotification(xhr.responseJSON.message);
                } else {
                    console.error("Không thể xóa Nhà cung cấp:", error);
                    alert("Có lỗi xảy ra khi xóa Nhà cung cấp.");
                }
            }
        });
    });

    $("#cancelDeleteBtnSupplier").on("click", function () {
        closeModal2();
    });

/*-------------------------------------------------Thêm------------------------------------------------*/
    $("#addSupplierBtn").click(function () {
        $("#addSupplierModal").show();
        $("#overlay").show();
    });

    $("#cancelSupplierBtn").click(function () {
        closeModal();
    });

    $("#saveSupplierBtn").click(function () {
        var supplierName = $("#supplierName").val().trim();
        var contactInfo = $("#contactInfo").val().trim();

        if (!supplierName || !contactInfo) {
            document.querySelector('.error-messageSupplier').innerText = "Vui lòng điền đầy đủ thông tin"; // Thông báo cho ô username
            document.querySelector('.error-messageSupplier').style.display = 'block'; // Hiển thị phần tử thông báo
            loadingIcon.style.display = 'none'; // Ẩn biểu tượng loading
            return; // Ngừng thực hiện nếu tài khoản trống
        }
        

        var newSupplierItem = {
            supplierName: supplierName,
            contactInfo: contactInfo
        };

        $.ajax({
            url: "https://resmant11111-001-site1.anytempurl.com/Supplier/Insert",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(newSupplierItem),
            success: function (response) {
                loadSuppliers();
                $("#addSupplierModal").hide();
                showNotification("Nhà cung cấp đã được thêm thành công!");
            },
            error: function (xhr, status, error) {
                console.error("Không thể thêm Nhà cung cấp:", error);
                alert("Có lỗi xảy ra khi thêm Nhà cung cấp.");
            }
        });
    });

    /*-------------------------------------------------Sửa------------------------------------------------*/
    let SupplierId;

    $(document).on('click', '.btn-edit-supplier', function () {
        SupplierId = $(this).data('id');
        $.ajax({
            url: `https://resmant11111-001-site1.anytempurl.com/Supplier/GetById?id=${SupplierId}`,
            method: "GET",
            success: function (item) {
                $("#supplierNameEdit").val(item.supplierName);
                $("#contactInfoEdit").val(item.contactInfo);
                $("#editSupplierModal").show();
                $("#overlay").show();
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải thông tin Supplier:", error);
            }
        });
    });

    $("#cancelEditSupplierBtn").click(function () {
        closeModal();
    });

    $("#saveEditSupplierBtn").click(function () {
        var supplierName = $("#supplierNameEdit").val().trim();
        var contactInfo = $("#contactInfoEdit").val().trim();

        if (!supplierName || !contactInfo) {
            document.querySelector('.error-messageSupplier2').innerText = "Vui lòng điền đầy đủ thông tin"; // Thông báo cho ô username
            document.querySelector('.error-messageSupplier2').style.display = 'block'; // Hiển thị phần tử thông báo
            loadingIcon.style.display = 'none'; // Ẩn biểu tượng loading
            return; // Ngừng thực hiện nếu tài khoản trống
        }
        

        var updatedSupplier = {
            SupplierId: SupplierId,
            supplierName: supplierName,
            contactInfo: contactInfo
        };

        $.ajax({
            url: "https://resmant11111-001-site1.anytempurl.com/Supplier/Update",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updatedSupplier),
            success: function (response) {
                loadSuppliers();
                $("#editSupplierModal").hide();
                showNotification("Nhà cung cấp đã được cập nhật thành công!");
            },
            error: function (xhr, status, error) {
                console.error("Không thể cập nhật Supplier:", error);
                alert("Có lỗi xảy ra khi cập nhật Supplier.");
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

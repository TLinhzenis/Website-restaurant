$(document).ready(function () {
    var table = $('#InventoryTable').DataTable({
        columns: [
            { title: "Loại hàng hóa" },
            { title: "Số lượng", width: "200px" },
            { title: "Nhà cung cấp", width: "200px" },
            { title: "Chức năng", width: "100px" }
        ],autoWidth: false
    });

    function formatPrice(price) {
        return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0";
    }

    /*-------------------------------------------------Animation & ovelay------------------------------------------------*/
    function closeModal2() {
    
        $("#notificationModal").addClass("closing");
        $("#confirmDeleteModalInven").addClass("closing");
        setTimeout(function () {
    
            $("#notificationModal").hide();;
            $("#confirmDeleteModalInven").hide();
            $("#overlay").hide(); 

            $("#notificationModal").removeClass("closing");
            $("#confirmDeleteModalInven").removeClass("closing");
        }, 500); 
    }
    function closeModal() {
        $("#editInvenModal").addClass("closing");
        $("#addInvenModal").addClass("closing");
        
        setTimeout(function () {
            $("#editInvenModal").hide();
            $("#addInvenModal").hide();
            $("#overlay").hide();
            resetInvenModal();
            $("#addInvenModal").removeClass("closing");
            $("#editInvenModal").removeClass("closing");
        }, 900); 
    }
    $("#overlay").click(function (e) {
        if ($(e.target).is("#overlay")) {
            closeModal();
            closeModal2()
        }
    });

    function resetInvenModal() {
        $("#itemType").val(""); 
        $("#itemQuantity").val(""); 
        $("#suplierInven").val(""); 
        $("#error-message-inven").val("");
        document.querySelector('.error-message-inven').style.display = 'none';

        
    }
    /*-------------------------------------------------Hiển thị danh sách------------------------------------------------*/

    function loadInventory() {
        $.ajax({
            url: "https://resmant11111-001-site1.anytempurl.com/Inventory/List",
            method: "GET",
            success: function (response) {
                table.clear();

                response.forEach(function (item) {
                    var row = [
                        item.itemName,
                        formatPrice(item.quantity),
                        item.supplierName,
                        `<a id="btn-edit" class="btn-edit-Inven" data-id="${item.itemId}"><i class="fa-solid fa-eye"></i></a>

                        <div class="divider"></div>

                         <a id="btn-delete" class="btn-delete-Inven" data-id="${item.itemId}"><i class="fa-solid fa-trash"></i></a>`
                    ];
                    table.row.add(row).draw();
                });
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải danh sách:", error);
            }
        });
    }
    loadInventory();

    /*-------------------------------------------------Xóa------------------------------------------------*/
    let InvenIdToDelete;

    $(document).on('click', '.btn-delete-Inven', function () {
        InvenIdToDelete = $(this).data('id');
        $("#confirmDeleteModalInven").show();
        $("#overlay").show();
    });

    $("#confirmDeleteBtnInven").on("click", function () {
        $.ajax({
            url: `https://resmant11111-001-site1.anytempurl.com/Inventory/Delete?id=${InvenIdToDelete}`,
            method: "POST",
            success: function (response) {
                loadInventory();
                showNotification("Hàng đã được xóa thành công!");
                $("#confirmDeleteModalInven").hide();
            },
            error: function (xhr, status, error) {
                console.error("Không thể xóa :", error);
                alert("Có lỗi xảy ra khi xóa .");
            }
        });
    });

    $("#cancelDeleteBtnInven").on("click", function () {
        closeModal2();
    });

/*-------------------------------------------------Thêm------------------------------------------------*/

// Hàm load danh sách nhà cung cấp vào dropdown
function loadSuppliers() {
    $.ajax({
        url: "https://resmant11111-001-site1.anytempurl.com/Supplier/List", 
        method: "GET",
        success: function (response) {
            var supplierDropdown = $("#suplierInven");
            supplierDropdown.empty(); 

            // Thêm tùy chọn mặc định
            supplierDropdown.append('<option value="">-- Chọn nhà cung cấp --</option>');

            // Duyệt qua danh sách nhà cung cấp và thêm vào dropdown
            response.forEach(function (supplier) {
                supplierDropdown.append(
                    `<option value="${supplier.supplierId}">${supplier.supplierName}</option>`
                );
            });
        },
        error: function (xhr, status, error) {
            console.error("Không thể tải danh sách nhà cung cấp:", error);
        }
    });
}

// Gọi hàm load danh sách nhà cung cấp khi mở modal
$("#addInvenBtn").click(function () {
    loadSuppliers();
    $("#addInvenModal").show();
    $("#overlay").show(); 
});

// Đóng modal
$("#cancelInvenBtn").click(function () {
    closeModal(); 
});

// Lưu thông tin thêm hàng hóa
$("#saveInvenBtn").click(function () {
    var itemType = $("#itemType").val().trim();
    var itemQuantity = parseFloat($("#itemQuantity").val());
    var suplierInven = $("#suplierInven").val().trim();

    
    if (!itemType || !itemQuantity || !suplierInven) {
        document.querySelector('.error-message-inven').innerText = "Vui lòng điền đầy đủ thông tin"; 
        document.querySelector('.error-message-inven').style.display = 'block';
        return; 
    }
    if (!itemQuantity || !Number.isInteger(itemQuantity) || itemQuantity <= 0) {
        document.querySelector('.error-message-inven').innerText = "Số lượng phải là một số nguyên lớn hơn 0";
        document.querySelector('.error-message-inven').style.display = 'block'; 
        return; 
    }

    var newInvenItem = {
        itemName: itemType,
        quantity: itemQuantity,
        supplierId: suplierInven
    };

    
    $.ajax({
        url: "https://resmant11111-001-site1.anytempurl.com/Inventory/Insert",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(newInvenItem),
        success: function (response) {
            loadInventory(); 
            $("#addInvenModal").hide(); 
            
            showNotification("Hàng hóa đã được thêm thành công!");
        },
        error: function (xhr, status, error) {
            console.error("Không thể thêm hàng hóa:", error);
            alert("Có lỗi xảy ra khi thêm hàng hóa.");
        }
    });
});




    /*-------------------------------------------------Sửa------------------------------------------------*/
    let ItemId;

    // Mở Modal chỉnh sửa khi nhấn vào nút Sửa
    $(document).on('click', '.btn-edit-Inven', function () {
        ItemId = $(this).data('id');
        $.ajax({
            url: `https://resmant11111-001-site1.anytempurl.com/Inventory/GetById?id=${ItemId}`,
            method: "GET",
            success: function (inventory) {
                
                $("#itemTypeEdit").val(inventory.itemName);
                $("#itemQuantityEdit").val(inventory.quantity);
               
                loadSuppliersForEdit(inventory.supplierId);
                $("#editInvenModal").show();
                $("#overlay").show();
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải thông tin hàng hóa:", error);
            }
        });
    });
    
    // Hàm load danh sách nhà cung cấp vào dropdown cho modal sửa
    function loadSuppliersForEdit(selectedSupplierId) {
        $.ajax({
            url: "https://resmant11111-001-site1.anytempurl.com/Supplier/List", 
            method: "GET",
            success: function (response) {
                var supplierDropdown = $("#suplierInvenEdit");
                supplierDropdown.empty(); 
                supplierDropdown.append('<option value="">-- Chọn nhà cung cấp --</option>');
    
                response.forEach(function (supplier) {
                    var selected = supplier.supplierId === selectedSupplierId ? "selected" : "";
                    supplierDropdown.append(
                        `<option value="${supplier.supplierId}" ${selected}>${supplier.supplierName}</option>`
                    );
                });
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải danh sách nhà cung cấp:", error);
            }
        });
    }
    

    $("#cancelEditInvenBtn").click(function () {
        closeModal();
    });
    
    // Lưu thay đổi khi nhấn nút Lưu
    $("#saveEditInvenBtn").click(function () {
        var itemType = $("#itemTypeEdit").val().trim();
        var itemQuantity = parseFloat($("#itemQuantityEdit").val());
        var supplierId = $("#suplierInvenEdit").val().trim();
    
        if (!itemType || !itemQuantity || !supplierId) {
            document.querySelector('.error-message-inven-edit').innerText = "Vui lòng điền đầy đủ thông tin";
            document.querySelector('.error-message-inven-edit').style.display = 'block';
            return;
        }
    
        if (!itemQuantity || itemQuantity <= 0) {
            document.querySelector('.error-message-inven-edit').innerText = "Số lượng phải là một số nguyên lớn hơn 0";
            document.querySelector('.error-message-inven-edit').style.display = 'block';
            return;
        }
    
        var updatedInvenItem = {
            itemId: ItemId,
            itemName: itemType,
            quantity: itemQuantity,
            supplierId: supplierId
        };
    
        $.ajax({
            url: "https://resmant11111-001-site1.anytempurl.com/Inventory/Update",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updatedInvenItem),
            success: function (response) {
                loadInventory();  
                $("#editInvenModal").hide();
                showNotification("Hàng hóa đã được cập nhật thành công!");
            },
            error: function (xhr, status, error) {
                console.error("Không thể cập nhật hàng hóa:", error);
                alert("Có lỗi xảy ra khi cập nhật hàng hóa.");
            }
        });
    });
    
    function showNotification(message) {
        $("#notificationMessage").text(message);
        $("#notificationModal").show(); 
    }

    // Khi nhấn nút Đóng trong modal thông báo
    $("#closeNotificationBtn").click(function () {
        closeModal2(); 
    });
});

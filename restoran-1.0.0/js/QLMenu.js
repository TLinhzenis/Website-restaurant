$(document).ready(function () {
    var table = $('#MenuTable').DataTable({
        columns: [
            { title: "Tên món ăn" },
            { title: "Phân loại" },
            { title: "Giá", width: "200px" },
            { title: "Mô tả", width: "200px" },
            { title: "Hình ảnh" },
            { title: "Chức năng", width: "100px" }
        ]
    });
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Định dạng số
    }
    function loadMenuItems() {
        $.ajax({
            url: "https://resmant1111-001-site1.jtempurl.com/Menu/List",
            method: "GET",
            success: function (response) {
                table.clear(); // Xóa dữ liệu cũ
    
                response.forEach(function (item) {
                    // Kiểm tra nếu có hình ảnh thì hiển thị, nếu không thì để trống
                    var imageUrl = item.image ? `https://resmant1111-001-site1.jtempurl.com/uploads/${item.image}` : '';
    
                    var row = [
                        item.itemName,
                        item.category,
                        formatPrice(item.price) + " VND",
                        item.description,
                        imageUrl ? `<img src="${imageUrl}" alt="Hình ảnh" style="width: 100px; height: 100px;" />` : 'Không có ảnh',
                        `<button class="btn-edit" data-id="${item.menuItemId}">Sửa</button>
                         <button class="btn-delete" data-id="${item.menuItemId}">Xóa</button>`
                    ];
                    table.row.add(row).draw(); // Thêm hàng mới
                });
    
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải danh sách món ăn:", error);
            }
        });
    }
    

    loadMenuItems();

    $("#addMenuBtn").click(function () {
        $("#addMenuModal").show(); // Hiển thị modal thêm món ăn
    });

    // Hủy modal thêm món ăn
    $("#cancelMenuBtn").click(function () {
        $("#addMenuModal").hide(); // Ẩn modal
    });

    // Khi người dùng chọn file ảnh
    $("#image").change(function () {
        var imageFile = $("#image")[0].files[0];

        if (imageFile) {
            // Hiển thị tên file ảnh
            $("#imageName").text("Tên file: " + imageFile.name);

            // Hiển thị ảnh preview
            var reader = new FileReader();
            reader.onload = function (e) {
                $("#imagePreview").attr("src", e.target.result);
            };
            reader.readAsDataURL(imageFile);
        } else {
            $("#imageName").text("");
            $("#imagePreview").attr("src", "");
        }
    });

    // Khi nhấn nút Lưu
    $("#saveMenuBtn").click(function () {
        var itemName = $("#itemName").val().trim();
        var category = $("#category").val();
        var price = parseFloat($("#price").val());
        var description = $("#description").val().trim();
        var imageFile = $("#image")[0].files[0];

        // Kiểm tra các điều kiện
        if (!itemName) {
            alert("Tên món ăn không được để trống.");
            return;
        }

        if (!category) {
            alert("Phân loại phải được chọn.");
            return;
        }

        if (!price || price <= 0) {
            alert("Giá phải lớn hơn 0.");
            return;
        }

        if (!imageFile) {
            alert("Vui lòng chọn hình ảnh.");
            return;
        }

        // Tạo form data để gửi ảnh lên API
        var formData = new FormData();
        formData.append("file", imageFile);

        // Tải ảnh lên server trước
        $.ajax({
            url: "https://resmant1111-001-site1.jtempurl.com/controller/upload-image", // URL đến API upload ảnh
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var imageName = response.imagePath.split('/').pop(); // Lấy tên file ảnh từ đường dẫn

                // Sau khi tải ảnh xong, gửi yêu cầu thêm món ăn
                var newMenuItem = {
                    itemName: itemName,
                    category: category,
                    price: price,
                    description: description,
                    image: imageName // Lưu tên file ảnh
                };

                $.ajax({
                    url: "https://resmant1111-001-site1.jtempurl.com/Menu/Insert",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(newMenuItem),
                    success: function (response) {
                        loadMenuItems(); // Hàm tải lại danh sách món ăn
                        $("#addMenuModal").hide(); // Ẩn modal sau khi thêm thành công
                        alert("Món ăn đã được thêm thành công!");
                    },
                    error: function (xhr, status, error) {
                        console.error("Không thể thêm món ăn:", error);
                        alert("Có lỗi xảy ra khi thêm món ăn.");
                    }
                });
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải ảnh lên:", error);
                alert("Có lỗi xảy ra khi tải ảnh.");
            }
        });
    });



    let menuItemIdToDelete;

    $(document).on('click', '.btn-delete', function () {
        menuItemIdToDelete = $(this).data('id');
        $("#confirmDeleteModal").show(); // Hiện modal xác nhận
    });

    $("#confirmDeleteBtn").on("click", function () {
        $.ajax({
            url: `https://resmant1111-001-site1.jtempurl.com/Menu/Delete?id=${menuItemIdToDelete}`,
            method: "POST",
            success: function (response) {
                loadMenuItems();
                alert("Món ăn đã được xóa thành công!");
                $("#confirmDeleteModal").hide(); // Ẩn modal xác nhận
            },
            error: function (xhr, status, error) {
                console.error("Không thể xóa món ăn:", error);
                alert("Có lỗi xảy ra khi xóa món ăn.");
            }
        });
    });

    $("#cancelDeleteBtn").on("click", function () {
        $("#confirmDeleteModal").hide(); // Ẩn modal xác nhận
    });

    let menuItemId;

    $(document).on('click', '.btn-edit', function () {
        menuItemId = $(this).data('id'); // Lưu ID món ăn cần sửa
        $.ajax({
            url: `https://resmant1111-001-site1.jtempurl.com/Menu/GetById?id=${menuItemId}`,
            method: "GET",
            success: function (menuItem) {
                $("#itemNameEdit").val(menuItem.itemName);
                $("#categoryEdit").val(menuItem.category);
                $("#priceEdit").val(menuItem.price);
                $("#descriptionEdit").val(menuItem.description);
                if (menuItem.image) {
                    $("#currentImage").attr("src", "data:image/jpeg;base64," + menuItem.image).show();
                }
                $("#editMenuModal").show(); // Hiện modal sửa món ăn
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải thông tin món ăn:", error);
            }
        });
    });

    $("#cancelEditMenuBtn").click(function () {
        $("#editMenuModal").hide(); // Ẩn modal sửa món ăn
    });

    $("#saveEditMenuBtn").click(function () {
        var itemName = $("#itemNameEdit").val().trim();
        var category = $("#categoryEdit").val();
        var price = parseFloat($("#priceEdit").val());
        var description = $("#descriptionEdit").val().trim();
        var imageFile = $("#imageUpload")[0].files[0];
        var currentImageBase64 = $("#currentImage").attr("src").split(',')[1]; // Lấy ảnh cũ nếu có

        // Kiểm tra các điều kiện
        if (!itemName) {
            alert("Tên món ăn không được để trống.");
            return;
        }

        if (!category) {
            alert("Phân loại phải được chọn.");
            return;
        }

        if (!price || !Number.isInteger(price) || price <= 0) {
            alert("Giá phải là số nguyên và lớn hơn 0.");
            return;
        }

        if (imageFile) {
            var reader = new FileReader();
            reader.onloadend = function () {
                var base64Image = reader.result.split(',')[1];

                var updatedMenuItem = {
                    menuItemId: menuItemId,
                    itemName: itemName,
                    category: category,
                    price: price,
                    description: description,
                    image: base64Image // Gửi ảnh mới nếu có
                };

                $.ajax({
                    url: "https://resmant1111-001-site1.jtempurl.com/Menu/Update",
                    method: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(updatedMenuItem),
                    success: function (response) {
                        loadMenuItems();
                        $("#editMenuModal").hide();
                        alert("Món ăn đã được cập nhật thành công!");
                    },
                    error: function (xhr, status, error) {
                        console.error("Không thể cập nhật món ăn:", error);
                        alert("Có lỗi xảy ra khi cập nhật món ăn.");
                    }
                });
            };
            reader.readAsDataURL(imageFile);
        } else {
            // Nếu không có ảnh mới, giữ lại ảnh cũ
            var updatedMenuItem = {
                menuItemId: menuItemId,
                itemName: itemName,
                category: category,
                price: price,
                description: description,
                image: currentImageBase64 // Gửi lại ảnh cũ
            };

            $.ajax({
                url: "https://resmant1111-001-site1.jtempurl.com/Menu/Update",
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(updatedMenuItem),
                success: function (response) {
                    loadMenuItems();
                    $("#editMenuModal").hide();
                    alert("Món ăn đã được cập nhật thành công!");
                },
                error: function (xhr, status, error) {
                    console.error("Không thể cập nhật món ăn:", error);
                    alert("Có lỗi xảy ra khi cập nhật món ăn.");
                }
            });
        }
    });

});

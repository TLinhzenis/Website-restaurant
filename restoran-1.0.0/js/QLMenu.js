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
    
                    var categoryName;
                    switch (item.category) {
                        case "1":
                            categoryName = "Khai vị";
                            break;
                        case "2":
                            categoryName = "Món chính";
                            break;
                        case "3":
                            categoryName = "Tráng miệng";
                            break;
                        default:
                            categoryName = "Khác"; // Nếu không thuộc loại nào
                    }
                    var row = [
                        item.itemName,
                        categoryName,
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
        var maxSize = 0.5 * 1024 * 1024; 
        if (imageFile.size > maxSize) {
            document.querySelector('.error-message').innerText = "Ảnh được chọn có dung lượng quá lớn"; // Thông báo cho ô username
            document.querySelector('.error-message').style.display = 'block'; // Hiển thị phần tử thông báo
            $("#image").val(""); // Xóa file đã chọn
            $("#imageName").text(""); // Xóa tên file hiển thị
            $("#imagePreview").attr("src", ""); // Xóa ảnh preview
            return;
        }

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
           
            document.querySelector('.error-message').innerText = "Tên món ăn không được để trống"; // Thông báo cho ô username
            document.querySelector('.error-message').style.display = 'block'; // Hiển thị phần tử thông báo
            loadingIcon.style.display = 'none'; // Ẩn biểu tượng loading
            return; // Ngừng thực hiện nếu tài khoản trống
        }


        if (!category) {
            document.querySelector('.error-message').innerText = "Phân loại phải được chọn"; // Thông báo cho ô username
            document.querySelector('.error-message').style.display = 'block'; // Hiển thị phần tử thông báo
            loadingIcon.style.display = 'none'; // Ẩn biểu tượng loading
            return; // Ngừng thực hiện nếu tài khoản trống
        }

        if ( !price) {
            document.querySelector('.error-message').innerText = "Vui lòng điền giá"; // Thông báo cho ô username
            document.querySelector('.error-message').style.display = 'block'; // Hiển thị phần tử thông báo
            loadingIcon.style.display = 'none'; // Ẩn biểu tượng loading
            return; // Ngừng thực hiện nếu tài khoản trống
        }

        if ( price <= 0 || !Number.isInteger(price)) {
            document.querySelector('.error-message').innerText = "Giá phải là số nguyên lớn hơn 0"; // Thông báo cho ô username
            document.querySelector('.error-message').style.display = 'block'; // Hiển thị phần tử thông báo
            loadingIcon.style.display = 'none'; // Ẩn biểu tượng loading
            return; // Ngừng thực hiện nếu tài khoản trống
        }


        if (!imageFile) {
            document.querySelector('.error-message').innerText = "Vui lòng chọn ảnh"; // Thông báo cho ô username
            document.querySelector('.error-message').style.display = 'block'; // Hiển thị phần tử thông báo
            loadingIcon.style.display = 'none'; // Ẩn biểu tượng loading
            return; // Ngừng thực hiện nếu tài khoản trống
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
                        showNotification("Món ăn đã được thêm thành công!");
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
                showNotification("Món ăn đã được xóa thành công!");
                $("#confirmDeleteModal").hide(); // Ẩn modal xác nhận
            },
            error: function (xhr, status, error) {
                console.error("Không thể xóa món ăn:", error);
                alert("Có lỗi xảy ra khi xóa món ăn.");
            }
        });
    });
    function deleteImage(imageName) {
        $.ajax({
            url: `https://resmant1111-001-site1.jtempurl.com/controller/delete-image`,
            method: "POST",
            data: { imageName: imageName },
            success: function (response) {
                alert(response);
            },
            error: function (xhr, status, error) {
                console.error("Không thể xóa hình ảnh:", error);
                alert("Có lỗi xảy ra khi xóa hình ảnh.");
            }
        });
    }
    

    $("#cancelDeleteBtn").on("click", function () {
        $("#confirmDeleteModal").hide(); // Ẩn modal xác nhận
    });

    let menuItemId;

// Khi người dùng chọn file ảnh mới
$("#imageUpload").change(function () {
    var imageFile = $("#imageUpload")[0].files[0]; // Lấy file ảnh mới

    if (imageFile) {
        // Hiển thị tên file ảnh
        $("#imageNameEdit").text("Tên file: " + imageFile.name);

        // Hiển thị ảnh preview
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#currentImage").attr("src", e.target.result).show(); // Hiện ảnh mới
        };
        reader.readAsDataURL(imageFile);
    } else {
        $("#imageNameEdit").text("Không có ảnh");
        $("#currentImage").hide(); // Ẩn ảnh nếu không có file nào được chọn
    }
});

// Khi nhấn nút "Sửa" món ăn
$(document).on('click', '.btn-edit', function () {
    menuItemId = $(this).data('id'); // Lưu ID món ăn cần sửa
    $.ajax({
        url: `https://resmant1111-001-site1.jtempurl.com/Menu/GetById?id=${menuItemId}`,
        method: "GET",
        success: function (menuItem) {
            // Khôi phục tất cả các trường trong modal
            $("#itemNameEdit").val(menuItem.itemName);
            $("#categoryEdit").val(menuItem.category);
            $("#priceEdit").val(menuItem.price);
            $("#descriptionEdit").val(menuItem.description);

            // Nếu món ăn có ảnh
            if (menuItem.image) {
                $("#imageNameEdit").text(menuItem.image); // Cập nhật tên file ảnh
                $("#currentImage").attr("src", `https://resmant1111-001-site1.jtempurl.com/uploads/${menuItem.image}`).show();
            } else {
                $("#imageNameEdit").text("Không có ảnh");
                $("#currentImage").hide();
            }

            // Reset input file cho hình ảnh mới
            $("#imageUpload").val(''); // Đặt lại input file để không giữ file trước đó

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
        var imageInput = $("#imageUpload")[0];  // Đối tượng input file
        var imageFile = imageInput.files.length > 0 ? imageInput.files[0] : null;  // Kiểm tra xem có file nào được chọn không
        var currentImage = $("#currentImage").attr("src").split('/').pop(); // Lấy tên ảnh hiện tại
    
        if (!itemName || !category || !price ) {
            document.querySelector('.error-message2').innerText = "Vui lòng điền đầy đủ thông tin"; // Thông báo cho ô username
            document.querySelector('.error-message2').style.display = 'block'; // Hiển thị phần tử thông báo
            loadingIcon.style.display = 'none'; // Ẩn biểu tượng loading
            return; // Ngừng thực hiện nếu tài khoản trống
        }
        if (price <= 0 || !Number.isInteger(price)) {
            document.querySelector('.error-message2').innerText = "Giá phải là số nguyên lớn hơn 0"; // Thông báo cho ô username
            document.querySelector('.error-message2').style.display = 'block'; // Hiển thị phần tử thông báo
            loadingIcon.style.display = 'none'; // Ẩn biểu tượng loading
            return; // Ngừng thực hiện nếu tài khoản trống
        }
    
        if (imageFile) {
            var formData = new FormData();
            formData.append('file', imageFile);
    
            // Upload ảnh mới
            $.ajax({
                url: "https://resmant1111-001-site1.jtempurl.com/controller/upload-image",
                method: "POST",
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    var updatedMenuItem = {
                        menuItemId: menuItemId,
                        itemName: itemName,
                        category: category,
                        price: price,
                        description: description,
                        image: response.imagePath.split('/').pop() // Chỉ lấy tên file ảnh mới
                    };
    
                    updateMenuItem(updatedMenuItem);
                },
                error: function () {
                    alert("Có lỗi xảy ra khi tải ảnh.");
                }
            });
        } else {
            // Nếu không có ảnh mới, giữ lại tên ảnh hiện tại
            var updatedMenuItem = {
                menuItemId: menuItemId,
                itemName: itemName,
                category: category,
                price: price,
                description: description,
                image: currentImage // Giữ lại ảnh cũ
            };
    
            updateMenuItem(updatedMenuItem);
        }
    });
    
    function updateMenuItem(updatedMenuItem) {
        $.ajax({
            url: "https://resmant1111-001-site1.jtempurl.com/Menu/Update",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updatedMenuItem),
            success: function () {
                loadMenuItems();
                $("#editMenuModal").hide();
                showNotification("Món ăn đã được sửa thành công!");
            },
            error: function () {
                alert("Có lỗi xảy ra khi cập nhật món ăn.");
            }
        });
    }

    function showNotification(message) {
        $("#notificationMessage").text(message);
        $("#notificationModal").show(); // Hiển thị modal thông báo
    }

    // Khi nhấn nút Đóng trong modal thông báo
    $("#closeNotificationBtn").click(function () {
        $("#notificationModal").hide(); // Ẩn modal thông báo
    });
    

});

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

    function formatPriceInput(inputId) {
        const priceInput = document.getElementById(inputId);
      
        priceInput.addEventListener("input", function (event) {
          // Loại bỏ tất cả ký tự không phải số
          let value = event.target.value.replace(/\D/g, "");
      
          // Giới hạn tối đa là 8 chữ số
          if (value.length > 8) {
            value = value.slice(0, 8); // Cắt chuỗi nếu dài hơn 8 số
          }
      
          // Định dạng số theo kiểu Việt Nam
          if (value) {
            value = parseInt(value, 10).toLocaleString("vi-VN");
          }
      
          // Cập nhật giá trị vào ô nhập liệu
          event.target.value = value;
        });
      }
      
      formatPriceInput("price");
      formatPriceInput("priceEdit");

      
      
/*-------------------------------------------------Hiển thị danh sách------------------------------------------------*/

    function loadMenuItems() {
        $.ajax({
            url: "https://resmant11111-001-site1.anytempurl.com/Menu/List",
            method: "GET",
            success: function (response) {
                table.clear(); 
    
                response.forEach(function (item) {
                   
                    var imageUrl = item.image ? `https://resmant11111-001-site1.anytempurl.com/uploads/${item.image}` : '';

                    var description = `<div class="mo-ta">${item.description}</div>`;
    
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
                            categoryName = "Khác"; 
                    }
                    var row = [
                        item.itemName,
                        categoryName,
                        formatPrice(item.price) + " VND",
                        description,
                        imageUrl ? `<img src="${imageUrl}" alt="Hình ảnh" style="width: 100px; height: 100px;" />` : 'Không có ảnh',
                        `<a id="btn-edit" class="btn-edit" data-id="${item.menuItemId}"><i class="fa-solid fa-eye"></i></a>
                        
                        <div class="divider"></div>
                         
                        <a id="btn-delete" class="btn-delete" data-id="${item.menuItemId}"><i class="fa-solid fa-trash"></i></a>`
                    ];
                    table.row.add(row).draw(); 
                });
    
            },
            error: function (xhr, status, error) {
                console.error("Không thể tải danh sách món ăn:", error);
            }
        });
    }
    

    loadMenuItems();

/*-------------------------------------------------Animation & ovelay------------------------------------------------*/
function resetMenuModal() {
    $("#itemName").val(""); 
    $("#category").val(""); 
    $("#price").val(""); 
    $("#description").val(""); 
    $("#image").val(""); 
    const imagePreview = $("#imagePreview");
    imagePreview.attr("src", ""); 
    
}

$("#overlay").click(function (e) {
    if ($(e.target).is("#overlay")) {
        closeModal();
        closeModal2()
    }
});


function closeModal() {
    $("#addMenuModal").addClass("closing");
    $("#editMenuModal").addClass("closing");
    $("#editCustomerModal").addClass("closing");
    
    setTimeout(function () {
        $("#addMenuModal").hide();
        $("#editMenuModal").hide();
        $("#editCustomerModal").hide();
        $("#overlay").hide(); 
        resetMenuModal();
        $("#addMenuModal").removeClass("closing");
        $("#editMenuModal").removeClass("closing");
        $("#editCustomerModal").removeClass("closing");
    }, 900); 
}
function closeModal2() {
    
    $("#notificationModal").addClass("closing");
    $("#confirmDeleteModal").addClass("closing");
    $("#confirmDeleteModal1").addClass("closing");
    setTimeout(function () {
        
        $("#notificationModal").hide();
        $("#confirmDeleteModal").hide();
        $("#confirmDeleteModal1").hide();
        $("#overlay").hide(); 
       
        $("#notificationModal").removeClass("closing");
        $("#confirmDeleteModal").removeClass("closing");
        $("#confirmDeleteModal1").removeClass("closing");
    }, 500); 
}

/*-------------------------------------------------Thêm------------------------------------------------*/

// Mở modal
$("#addMenuBtn").click(function () {
    $("#addMenuModal").show(); 
    $("#overlay").show(); 
});

$("#cancelMenuBtn").click(function () {
    closeModal(); 
});





    
// Khi người dùng chọn file ảnh
$("#image").change(function () {
    var imageFile = $("#image")[0].files[0];

    if (imageFile) {
        var maxSize = 5 * 1024 * 1024; 
        if (imageFile.size > maxSize) {
            document.querySelector('.error-message').innerText = "Ảnh được chọn có dung lượng quá lớn"; 
            document.querySelector('.error-message').style.display = 'block'; 
            $("#image").val(""); 
            $("#imageName").text(""); 
            $("#imagePreview").attr("src", ""); 
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
        var price = parseFloat($("#price").val().replace(/\./g, ""));
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
            url: "https://resmant11111-001-site1.anytempurl.com/controller/upload-image", 
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var imageName = response.imagePath.split('/').pop(); 

                
                var newMenuItem = {
                    itemName: itemName,
                    category: category,
                    price: price,
                    description: description,
                    image: imageName 
                };

                $.ajax({
                    url: "https://resmant11111-001-site1.anytempurl.com/Menu/Insert",
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(newMenuItem),
                    success: function (response) {
                        loadMenuItems(); 
                        $("#addMenuModal").hide(); 
                        
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


/*-------------------------------------------------Xóa------------------------------------------------*/
    let menuItemIdToDelete;

    $(document).on('click', '.btn-delete', function () {
        menuItemIdToDelete = $(this).data('id');
        $("#confirmDeleteModal").show(); 
        $("#overlay").show();

    });

    $("#confirmDeleteBtn").on("click", function () {
        $.ajax({
            url: `https://resmant11111-001-site1.anytempurl.com/Menu/Delete?id=${menuItemIdToDelete}`,
            method: "POST",
            success: function (response) {
                loadMenuItems();
                showNotification("Món ăn đã được xóa thành công!");
                $("#confirmDeleteModal").hide(); 

            },
            error: function (xhr, status, error) {
                console.error("Không thể xóa món ăn:", error);
                alert("Có lỗi xảy ra khi xóa món ăn.");
            }
        });
    });
    function deleteImage(imageName) {
        $.ajax({
            url: `https://resmant11111-001-site1.anytempurl.com/controller/delete-image`,
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
        closeModal2();
    });

    /*-------------------------------------------------Sửa------------------------------------------------*/
    let menuItemId;


$("#imageUpload").change(function () {
    var imageFile = $("#imageUpload")[0].files[0]; 

    if (imageFile) {
        // Hiển thị tên file ảnh
        $("#imageNameEdit").text("Tên file: " + imageFile.name);

        // Hiển thị ảnh preview
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#currentImage").attr("src", e.target.result).show(); 
        };
        reader.readAsDataURL(imageFile);
    } else {
        $("#imageNameEdit").text("Không có ảnh");
        $("#currentImage").hide(); 
    }
});

// Khi nhấn nút "Sửa" món ăn
$(document).on('click', '.btn-edit', function () {
    menuItemId = $(this).data('id'); 
    $.ajax({
        url: `https://resmant11111-001-site1.anytempurl.com/Menu/GetById?id=${menuItemId}`,
        method: "GET",
        success: function (menuItem) {

            $("#itemNameEdit").val(menuItem.itemName);

            $("#categoryEdit").val(menuItem.category);
            $("#priceEdit").val(formatPrice(menuItem.price));
            $("#descriptionEdit").val(menuItem.description);


            if (menuItem.image) {
                $("#imageNameEdit").text(menuItem.image); 
                $("#currentImage").attr("src", `https://resmant11111-001-site1.anytempurl.com/uploads/${menuItem.image}`).show();
            } else {
                $("#imageNameEdit").text("Không có ảnh");
                $("#currentImage").hide();
            }


            $("#imageUpload").val('');

            $("#editMenuModal").show();
            $("#overlay").show();
            
        },
        error: function (xhr, status, error) {
            console.error("Không thể tải thông tin món ăn:", error);
        }
    });
});

    

    $("#cancelEditMenuBtn").click(function () {
        closeModal();
    });

    $("#saveEditMenuBtn").click(function () {
        var itemName = $("#itemNameEdit").val().trim();
        var category = $("#categoryEdit").val();
        var price = parseFloat($("#priceEdit").val().replace(/\./g, ""));
        var description = $("#descriptionEdit").val().trim();
        var imageInput = $("#imageUpload")[0];  
        var imageFile = imageInput.files.length > 0 ? imageInput.files[0] : null;  
        var currentImage = $("#currentImage").attr("src").split('/').pop(); 
    
        if (!itemName || !category || !price ) {
            document.querySelector('.error-message2').innerText = "Vui lòng điền đầy đủ thông tin"; 
            document.querySelector('.error-message2').style.display = 'block'; 
            loadingIcon.style.display = 'none'; 
            return; 
        }
        if (price <= 0 || !Number.isInteger(price)) {
            document.querySelector('.error-message2').innerText = "Giá phải là số nguyên lớn hơn 0"; 
            document.querySelector('.error-message2').style.display = 'block'; 
            loadingIcon.style.display = 'none'; 
            return; 
        }
    
        if (imageFile) {
            var formData = new FormData();
            formData.append('file', imageFile);
    
            // Upload ảnh mới
            $.ajax({
                url: "https://resmant11111-001-site1.anytempurl.com/controller/upload-image",
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
                        image: response.imagePath.split('/').pop() 
                    };
    
                    updateMenuItem(updatedMenuItem);
                },
                error: function () {
                    alert("Có lỗi xảy ra khi tải ảnh.");
                }
            });
        } else {
            
            var updatedMenuItem = {
                menuItemId: menuItemId,
                itemName: itemName,
                category: category,
                price: price,
                description: description,
                image: currentImage 
            };
    
            updateMenuItem(updatedMenuItem);
        }
    });
    
    function updateMenuItem(updatedMenuItem) {
        $.ajax({
            url: "https://resmant11111-001-site1.anytempurl.com/Menu/Update",
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
        $("#notificationModal").show(); 
    }

    // Khi nhấn nút Đóng trong modal thông báo
    $("#closeNotificationBtn").click(function () {
        closeModal2();
    });
    

});

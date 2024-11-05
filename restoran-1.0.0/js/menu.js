$(document).ready(function() {

    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Định dạng số
    }
    fetchMenuItems();

    function fetchMenuItems() {
        $.ajax({
            url: 'https://resmant1111-001-site1.jtempurl.com/Menu/List', // Địa chỉ API để lấy danh sách món ăn
            method: 'GET',
            success: function(data) {
                console.log(data); // Kiểm tra dữ liệu nhận được từ API
                console.log('Dữ liệu nhận được từ API:', data);

                let menuContainer1 = $('#menuContainer');
                let menuContainer2 = $('#menuContainer2');
                let menuContainer3 = $('#menuContainer3');

                menuContainer1.empty(); // Xóa nội dung cũ
                menuContainer2.empty(); // Xóa nội dung cũ
                menuContainer3.empty(); // Xóa nội dung cũ

                data.forEach(item => {
                    console.log(item); // Kiểm tra từng món ăn
                    const menuItemHtml = `
                        <div class="menu-item">
                            <div class="col-lg-6">
                                <div class="d-flex align-items-center" style="width: 1200px;">
                                    <img class="flex-shrink-0 img-fluid rounded" src="https://resmant1111-001-site1.jtempurl.com/uploads/${item.image}" alt="${item.itemName}" style="width: 80px;">
                                    <div class="w-100 d-flex flex-column text-start ps-4">
                                        <h5 class="d-flex justify-content-between border-bottom pb-2">
                                            <span>${item.itemName}</span>
                                            <span class="text-primary"> ${formatPrice(item.price)} VND</span>
                                        </h5>
                                        <small class="fst-italic">${item.description}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    const category = parseInt(item.category);

                    // Phân loại món ăn theo category
                    switch(category) {
                        case 1:
                            menuContainer1.append(menuItemHtml);
                            break;
                        case 2:
                            menuContainer2.append(menuItemHtml);
                            break;
                        case 3:
                            menuContainer3.append(menuItemHtml);
                            break;
                        default:
                            console.warn('Không xác định category:', item.category); // Cảnh báo nếu category không hợp lệ
                            break; // Nếu không thuộc category nào, không làm gì cả
                    }
                });
            },
            error: function(err) {
                console.error('Lỗi khi lấy dữ liệu món ăn:', err);
            }
        });
    }
    
});

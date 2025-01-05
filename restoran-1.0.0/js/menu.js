$(document).ready(function() {

    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); 
    }
    fetchMenuItems();

    function fetchMenuItems() {
        $.ajax({
            url: 'https://resmant11111-001-site1.anytempurl.com/Menu/List',
            method: 'GET',
            success: function(data) {
                console.log(data); 
                console.log('Dữ liệu nhận được từ API:', data);

                let menuContainer1 = $('#menuContainer');
                let menuContainer2 = $('#menuContainer2');
                let menuContainer3 = $('#menuContainer3');

                menuContainer1.empty(); 
                menuContainer2.empty(); 
                menuContainer3.empty(); 

                data.forEach(item => {
                    console.log(item); 
                    const menuItemHtml = `
                        <div class="menu-item">
                            <div class="col-lg-6">
                                <div class="d-flex align-items-center" style="width: 1200px;">
                                    <img class="flex-shrink-0 img-fluid rounded" src="https://resmant11111-001-site1.anytempurl.com/uploads/${item.image}" alt="${item.itemName}" style="width: 80px;">
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
                            console.warn('Không xác định category:', item.category); 
                            break; 
                    }
                });
            },
            error: function(err) {
                console.error('Lỗi khi lấy dữ liệu món ăn:', err);
            }
        });
    }
    
});

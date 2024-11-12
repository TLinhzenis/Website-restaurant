document.addEventListener("DOMContentLoaded", function() {
    // Dữ liệu ban đầu
    const labels = [];
    const data = [];

    // Khởi tạo biểu đồ với Chart.js
    const ctx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Số lượng bán',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Hàm để gọi API và lấy dữ liệu món ăn
    async function fetchMenuData() {
        try {
            const response = await fetch('https://resmant1111-001-site1.jtempurl.com/Menu/GetTop5OrderByQuantity');
            
            if (!response.ok) {
                throw new Error('Không thể lấy dữ liệu từ API.');
            }

            const menuItems = await response.json();

            // Xóa dữ liệu cũ trên biểu đồ
            labels.length = 0;
            data.length = 0;

            // Thêm dữ liệu vào biểu đồ từ API
            menuItems.forEach(item => {
                labels.push(item.itemName); // Thêm tên món ăn vào trục X
                data.push(item.totalQuantity); // Thêm số lượng vào dữ liệu biểu đồ
            });

            // Cập nhật lại biểu đồ
            revenueChart.update();
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu từ API:', error);
            alert('Không thể tải dữ liệu món ăn.');
        }
    }

    // Gọi hàm để lấy dữ liệu món ăn khi DOM đã sẵn sàng
    fetchMenuData();
});
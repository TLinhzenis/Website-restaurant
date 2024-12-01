document.addEventListener("DOMContentLoaded", function() {
    // Biểu đồ
    const labels = [];
    const data = [];
    const ctx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Doanh thu',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                pointRadius: 10
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + ' VND'; // Thêm chữ VND sau giá trị
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let revenue = context.raw; // Giá trị doanh thu
                            return 'Doanh thu: ' + revenue.toLocaleString() + ' VND'; // Hiển thị doanh thu với chữ "VND"
                        }
                    }
                }
            }
        }
    });
    
    // Lấy dữ liệu biểu đồ từ API
    async function fetchMenuData() {
        try {
            const response = await fetch('https://resmant11111-001-site1.anytempurl.com/Statistics/YearlyRevenue');
            if (!response.ok) throw new Error('Không thể lấy dữ liệu từ API.');

            const menuItems = await response.json();
            labels.length = 0;
            data.length = 0;

            menuItems.forEach(item => {
                labels.push("Tháng " + item.month);
                data.push(item.revenue);
            });
            
            revenueChart.update();
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu từ API:', error);
           
        }
    }



    // Gọi các hàm lấy dữ liệu
    fetchMenuData();

});

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
            const response = await fetch('https://resmant1111-001-site1.jtempurl.com/Statistics/YearlyRevenue');
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
            alert('Không thể tải dữ liệu.');
        }
    }

    // Cập nhật các ô thống kê doanh số, đơn hàng và bảng xếp hạng khách hàng
    async function fetchStatistics() {
        // Các request API tương ứng ở đây, sau đó cập nhật vào các phần tử:
        document.getElementById('dailyRevenue').innerText = "1000";
        document.getElementById('weeklyRevenue').innerText = "7000";
        document.getElementById('monthlyRevenue').innerText = "30000";
        document.getElementById('dailyOrders').innerText = "50";
        document.getElementById('weeklyOrders').innerText = "350";
        document.getElementById('monthlyOrders').innerText = "1500";
        document.getElementById('top1Customer').innerText = "Khách hàng A";
        document.getElementById('top2Customer').innerText = "Khách hàng B";
        document.getElementById('top3Customer').innerText = "Khách hàng C";
    }

    // Lấy dữ liệu cho bảng xếp hạng 5 món ăn bán chạy nhất
    async function fetchTopDishes() {
        const dishes = [
            { rank: 1, name: "Món ăn 1", sold: 120 },
            { rank: 2, name: "Món ăn 2", sold: 110 },
            { rank: 3, name: "Món ăn 3", sold: 100 },
            { rank: 4, name: "Món ăn 4", sold: 90 },
            { rank: 5, name: "Món ăn 5", sold: 80 }
        ];
        const tbody = document.getElementById("topDishesBody");
        dishes.forEach(dish => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${dish.rank}</td><td>${dish.name}</td><td>${dish.sold}</td>`;
            tbody.appendChild(row);
        });
    }

    // Gọi các hàm lấy dữ liệu
    fetchMenuData();
    fetchStatistics();
    fetchTopDishes();
});

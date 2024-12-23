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
async function fetchRevenue() {
    try {
      const response = await fetch('https://resmant11111-001-site1.anytempurl.com/Statistics/Revenue');
      if (!response.ok) throw new Error('Không thể lấy dữ liệu doanh số.');

      const data = await response.json();
      console.log(data); // Kiểm tra dữ liệu trả về từ API


      // Cập nhật dữ liệu vào HTML

      document.getElementById('dailyRevenue').innerHTML = `<span style="color: #076d7d;padding-left:10px;">${data.today.totalRevenue.toLocaleString()} VND</span> `;
      document.getElementById('dailyRevenue1').innerHTML = `<span style="color: #076d7d;padding-left:10px;">${data.today.totalRevenue.toLocaleString()} VND</span> `;
      document.getElementById('7daysRevenue').innerHTML = `<span style="color: #076d7d;padding-left:10px;">${data.last7Days.totalRevenue.toLocaleString()} VND</span> `;
      document.getElementById('30daysRevenue').innerHTML = `<span style="color: #076d7d;padding-left:10px;">${data.last30Days.totalRevenue.toLocaleString()} VND</span> `;
      
    } catch (error) {
      console.error('Không thể tải dữ liệu doanh số.', error);
    }
  }

  // Gọi hàm khi tải trang
  fetchRevenue();

  async function fetchOrder() {
    try {
      const response = await fetch('https://resmant11111-001-site1.anytempurl.com/Statistics/OrderCount');
      if (!response.ok) throw new Error('Không thể lấy dữ liệu doanh số.');

      const data = await response.json();
      console.log(data); // Kiểm tra dữ liệu trả về từ API


      // Cập nhật dữ liệu vào HTML

      document.getElementById('dailyOrders').innerHTML = `<span style="color: #076d7d;padding-left:10px;">${data.today.orderCount.toLocaleString()}</span> `;
      document.getElementById('dailyOrders1').innerHTML = `<span style="color: #076d7d;padding-left:10px;">${data.today.orderCount.toLocaleString()}</span> `;
      document.getElementById('7daysOrders').innerHTML = `<span style="color: #076d7d;padding-left:10px;">${data.last7Days.orderCount.toLocaleString()}</span> `;
      document.getElementById('30daysOrders').innerHTML = `<span style="color: #076d7d;padding-left:10px;">${data.last30Days.orderCount.toLocaleString()}</span> `;
      
    } catch (error) {
      console.error('Không thể tải dữ liệu đơn hàng', error);

    }
  }

  // Gọi hàm khi tải trang
  fetchOrder();

  async function fetchCustomer() {
    try {
        const response = await fetch('https://resmant11111-001-site1.anytempurl.com/Statistics/Top3Customer');
        if (!response.ok) throw new Error('Không thể lấy dữ liệu khách hàng hàng đầu.');

        // Chuyển đổi JSON thành dữ liệu JavaScript
        const data = await response.json();
        console.log(data); // Kiểm tra dữ liệu trả về từ API trong console

        // Kiểm tra nếu dữ liệu không hợp lệ hoặc trống
        if (!data || !Array.isArray(data) || data.length < 3) {
            throw new Error('Dữ liệu trả về không đầy đủ hoặc không hợp lệ.');
        }

        // Cập nhật thông tin vào giao diện HTML
        document.getElementById('top1CustomerName').innerHTML = 
            `<span>${data[0].fullName}</span>`
        document.getElementById('top1Customer').innerHTML =
            `<span >${data[0].totalSpent.toLocaleString()} VND</span>`;
       
        document.getElementById('top1Customer1').innerHTML = 
            `<span style="padding-left:10px;">${data[0].fullName}</span> 
            <span style="color: #076d7d;padding-left:10px;">(${data[0].totalSpent.toLocaleString()} VND)</span>`;
        
        document.getElementById('top2CustomerName').innerHTML = 
            `<span>${data[1].fullName}</span>`
        document.getElementById('top2Customer').innerHTML =
            `<span >${data[1].totalSpent.toLocaleString()} VND</span>`;

        document.getElementById('top3CustomerName').innerHTML = 
            `<span>${data[2].fullName}</span>`
        document.getElementById('top3Customer').innerHTML =
            `<span >${data[2].totalSpent.toLocaleString()} VND</span>`;
    } catch (error) {
        console.error('Không thể tải dữ liệu khách hàng hàng đầu.', error);
    }
}

  // Gọi hàm khi tải trang
  fetchCustomer();

  async function fetchMenu() {
    try {
        const response = await fetch('https://resmant11111-001-site1.anytempurl.com/Menu/GetTop5OrderByQuantity');
        if (!response.ok) throw new Error('Không thể lấy dữ liệu khách hàng hàng đầu.');

        // Chuyển đổi JSON thành dữ liệu JavaScript
        const data = await response.json();
        console.log(data); // Kiểm tra dữ liệu trả về từ API trong console

        // Kiểm tra nếu dữ liệu không hợp lệ hoặc trống
        if (!data || !Array.isArray(data) || data.length < 3) {
            throw new Error('Dữ liệu trả về không đầy đủ hoặc không hợp lệ.');
        }

        // Cập nhật thông tin vào giao diện HTML
        document.getElementById('top1MenuName').innerHTML = 
            `<span>${data[0].itemName}</span>` 
        document.getElementById('top1Menu').innerHTML =
            `<span>${data[0].totalQuantity.toLocaleString()} phần</span>`;

        document.getElementById('top2MenuName').innerHTML = 
            `<span>${data[1].itemName}</span>` 
        document.getElementById('top2Menu').innerHTML =
            `<span>${data[1].totalQuantity.toLocaleString()} phần</span>`;

        document.getElementById('top3MenuName').innerHTML = 
            `<span>${data[2].itemName}</span>` 
        document.getElementById('top3Menu').innerHTML =
            `<span>${data[2].totalQuantity.toLocaleString()} phần</span>`;

        document.getElementById('top4MenuName').innerHTML = 
            `<span>${data[3].itemName}</span>` 
        document.getElementById('top4Menu').innerHTML =
            `<span>${data[3].totalQuantity.toLocaleString()} phần</span>`;

        document.getElementById('top5MenuName').innerHTML = 
            `<span>${data[4].itemName}</span>` 
        document.getElementById('top5Menu').innerHTML =
            `<span>${data[4].totalQuantity.toLocaleString()} phần</span>`;
    } catch (error) {
        console.error('Không thể tải dữ liệu món ăn hàng đầu.', error);
 
    }
}

  // Gọi hàm khi tải trang
  fetchMenu();
  

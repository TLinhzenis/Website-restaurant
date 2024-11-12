$(document).ready(function() {
  // Hàm định dạng giá tiền
  function formatPrice(price) {
    return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
  }

  // Hàm lấy danh sách feedback từ API
  function fetchFeedbacks() {
    $.ajax({
      url: 'https://resmant1111-001-site1.jtempurl.com/Feedback/List', // API lấy danh sách feedback
      method: 'GET',
      success: function(data) {
        renderFeedbackList(data); // Gọi hàm render để hiển thị danh sách feedback
      },
      error: function(error) {
        console.error("Lỗi khi lấy danh sách feedback:", error);
      }
    });
  }

  // Hàm lấy tên khách hàng từ API Customer
  function fetchCustomerName(customerId, callback) {
    $.ajax({
      url: `https://resmant1111-001-site1.jtempurl.com/Customer/GetById?id=${customerId}`, // Endpoint API lấy thông tin khách hàng
      method: 'GET',
      success: function(customerData) {
        if (customerData && customerData.fullName) {
          callback(customerData.fullName); // Gọi callback với fullName
        } else {
          callback("Tên không tìm thấy");
        }
      },
      error: function(error) {
        console.error("Lỗi khi lấy thông tin khách hàng:", error);
        callback("Lỗi khi lấy tên khách hàng");
      }
    });
  }

  // Hàm render danh sách feedback
  function renderFeedbackList(feedbacks) {
    const container = $('#feedbackContainer');
    container.empty(); // Xóa nội dung cũ nếu có

    // Duyệt qua tất cả feedbacks
    feedbacks.forEach(feedback => {
      const commentText = feedback.commentText || ''; // Thêm xử lý nếu commentText không tồn tại
      const truncatedText = commentText.length > 100 ? commentText.substring(0, 100) + '...' : commentText;

      // Gọi API lấy tên khách hàng dựa trên customerId
      fetchCustomerName(feedback.customerId, function(fullName) {
        // Tạo HTML cho từng feedback, thay customerId bằng fullName
        const feedbackHtml = ` 
          <div class="testimonial-item bg-transparent border rounded p-4">
              <i class="fa fa-quote-left fa-2x text-primary mb-3"></i>
              <h5 class="mb-1">${fullName}</h5> <!-- Thay customerId bằng fullName -->
              <small class="rating">${feedback.rating}/5 <i class="fa-solid fa-star"></i></small>
              <p class="comment-text">${feedback.comment}</p>
              <div class="d-flex align-items-center">
                  <div class="ps-3"></div>
              </div>
          </div>
          <br>
        `;
        
        // Append HTML feedback vào container
        container.append(feedbackHtml);
      });
    });
  }

  // Gọi hàm để lấy và hiển thị feedback
  fetchFeedbacks(); 
});

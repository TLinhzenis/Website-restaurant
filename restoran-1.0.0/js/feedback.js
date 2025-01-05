$(document).ready(function() {

function fetchFeedbacks() {
  $.ajax({
    url: 'https://resmant11111-001-site1.anytempurl.com/Feedback/List', 
    method: 'GET',
    success: function (data) {
      renderFeedbackList(data); 
    },
    error: function (error) {
      console.error('Lỗi khi lấy danh sách feedback:', error);
    },
  });
}

// Hàm lấy danh sách feedback từ API theo rating
function fetchFeedbacksByRating(rating) {
  $.ajax({
    url: `https://resmant11111-001-site1.anytempurl.com/Feedback/ListByRating?rating=${rating}`, 
    method: 'GET',
    success: function (data) {
      renderFeedbackList(data);
    },
    error: function (error) {
      console.error('Lỗi khi lấy danh sách feedback theo rating:', error);
    },
  });
}

// Hàm lấy tên khách hàng từ API Customer
function fetchCustomerName(customerId, callback) {
  $.ajax({
    url: `https://resmant11111-001-site1.anytempurl.com/Customer/GetById?id=${customerId}`, 
    method: 'GET',
    success: function (customerData) {
      if (customerData && customerData.fullName) {
        callback(customerData.fullName); 
      } else {
        callback('Tên không tìm thấy');
      }
    },
    error: function (error) {
      console.error('Lỗi khi lấy thông tin khách hàng:', error);
      callback('Lỗi khi lấy tên khách hàng');
    },
  });
}

// Hàm render danh sách feedback
function renderFeedbackList(feedbacks) {
  const container = $('#feedbackContainer');
  container.empty(); 

  // Duyệt qua tất cả feedbacks
  feedbacks.forEach((feedback) => {
    

    // Gọi API lấy tên khách hàng dựa trên customerId
    fetchCustomerName(feedback.customerId, function (fullName) {

      const feedbackHtml = `
        <div class="testimonial-item bg-transparent rounded p-4">
          <i class="fa fa-quote-left fa-2x text-primary mb-3"></i>
          <h5 class="mb-1">${fullName}</h5> <!-- Hiển thị tên khách hàng -->
          <small class="rating">${feedback.rating}/5 <i class="fa-solid fa-star"></i></small>
          <p class="comment-text">${feedback.comment}</p>
          <hr>
        </div>
        <br>
      `;


      container.append(feedbackHtml);
    });
  });
}

// Gắn sự kiện thay đổi cho ô select để lọc feedback theo rating
$('#ratingFilter').on('change', function () {
  const selectedRating = $(this).val();
  if (selectedRating) {
    fetchFeedbacksByRating(selectedRating); 
  } else {
    fetchFeedbacks(); 
  }
});


fetchFeedbacks();
 

  /*-------------------------------------------------Thêm------------------------------------------------*/


// Xử lý gửi feedback
$("#sendFeedback").click(function (e) {
  e.preventDefault(); 

  var customerId = localStorage.getItem('customerId');
  var rating = $("#rating").val().trim();
  var feedback = $("#feedback").val().trim();

  if (!rating) {
      showNotification("Vui lòng điền đầy đủ thông tin!");
      $("#overlay").show();
      return;
  }

  if (!customerId) {
      showNotification("Bạn cần đăng nhập để tiếp tục!");
      $("#overlay").show();
      return;
  }
  // Vô hiệu hóa nút gửi
  var $sendButton = $("#sendFeedback");
  $sendButton.prop("disabled", true);

  var newFeedbackItem = {
      customerId: parseInt(customerId),
      rating: parseInt(rating),
      comment: feedback,
      submittedAt: new Date().toISOString()
  };

  $.ajax({
      url: "https://resmant11111-001-site1.anytempurl.com/Feedback/Insert",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(newFeedbackItem),
      success: function () {
          showNotification("Feedback đã được gửi thành công!");
          $("#overlay").show();
      },
      error: function (xhr, status, error) {
          console.error("Không thể thêm Feedback:", error);
          showNotification("Có lỗi xảy ra khi thêm Feedback.");
      }
  });
});

function closeModal2() {
    
  $("#notificationModal").addClass("closing");
  setTimeout(function () {

      $("#notificationModal").hide();;
      $("#overlay").hide(); 

      $("#notificationModal").removeClass("closing");
  }, 500); 
}
$("#overlay").click(function (e) {
  if ($(e.target).is("#overlay")) {

      closeModal2();
  }
});

function showNotification(message) {
  $("#notificationMessage").text(message);
  $("#notificationModal").show();
}

$("#closeNotificationBtn").click(function () {
  closeModal2();
});

});


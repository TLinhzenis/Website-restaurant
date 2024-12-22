$(document).ready(function () {
  var table = $("#TablesTable").DataTable({
    columns: [
      { title: "Table Number", width: "100px", class: "table-number" },
      { title: "Số lượng ghế", class: "table-capacity" },
      { title: "Trạng thái", class: "table-status" },
      { title: "Username", class: "table-username" },
      { title: "Password", width: "100px", class: "table-password" },
      { title: "Chức năng", width: "100px" },
    ],
  });

  // Hạn chế quyền truy cập
  const userRole = localStorage.getItem("role"); // 'admin' hoặc 'user', tùy thuộc vào hệ thống của bạn

  // Kiểm tra vai trò người dùng
  if (userRole !== "admin") {
    // Ẩn hoặc vô hiệu hóa liên kết "Quản lý nhân viên"
    $("#manageStaff").css("pointer-events", "none").css("color", "gray"); // Vô hiệu hóa liên kết
    $("#manageStaff").on("click", function (e) {
      e.preventDefault(); // Ngăn chặn hành động mặc định
    });
  }

  /*-------------------------------------------------Animation & ovelay------------------------------------------------*/
  function closeModal2() {
    $("#notificationModal").addClass("closing");
    $("#confirmDeleteModal4").addClass("closing");
    setTimeout(function () {
      $("#notificationModal").hide();
      $("#confirmDeleteModal4").hide();
      $("#overlay").hide();

      $("#notificationModal").removeClass("closing");
      $("#confirmDeleteModal4").removeClass("closing");
    }, 500);
  }
  function closeModal() {
    $("#editTableModal").addClass("closing");
    $("#addTableModal").addClass("closing");

    setTimeout(function () {
      $("#editTableModal").hide();
      $("#addTableModal").hide();
      $("#overlay").hide();
      resetStaffModal();
      $("#addTableModal").removeClass("closing");
      $("#editTableModal").removeClass("closing");
    }, 900);
  }
  $("#overlay").click(function (e) {
    if ($(e.target).is("#overlay")) {
      closeModal();
      closeModal2();
    }
  });

  function resetStaffModal() {
    $("#TableNumber").val(""); // Xóa tên món ăn
    $("#Capacity").val(""); // Xóa tên món ăn
    $("#usernameTable").val(""); // Reset phân loại
    $("#passwordTable").val(""); // Xóa giá
  }

  /*-------------------------------------------------Hiển thị danh sách------------------------------------------------*/
  function loadTables() {
    $.ajax({
      url: "https://resmant11111-001-site1.anytempurl.com/Table/List",
      method: "GET",
      success: function (response) {
        console.log("hello"); // Kiểm tra phản hồi API
        table.clear(); // Xóa dữ liệu cũ
        response.forEach(function (item) {
          //   if (item.status !== "Blocked") {
          var row = [
            item.tableNumber,
            item.capacity,
            item.status,
            item.username,
            item.password,
            `<a id="btn-edit" class="btn-edit-table" data-id="${item.tableId}"><i class="fa-solid fa-eye"></i></a>
                            
                <div class="divider"></div>
                 
                <a id="btn-delete" class="btn-delete-table" data-id="${item.tableId}"><i class="fa-solid fa-trash"></i></a>`,
          ];
          var newRow = table.row.add(row).node();
          if (item.status === "Blocked") {
            $(newRow).addClass("blocked-row");
          } else if (item.status === "Available") {
            $(newRow).addClass("available-row");
          }
          //   table.row.add(row).draw();
          //   }
        });
        table.draw();
      },
      error: function (xhr, status, error) {
        console.error("Không thể tải danh sách nhân viên:", error);
      },
    });
  }

  // Gọi hàm loadStaffs khi trang được tải
  loadTables();

  /*-------------------------------------------------Thêm------------------------------------------------*/

  $("#addTableBtn").click(function () {
    $("#addTableModal").show();
    $("#overlay").show();
  });

  $("#cancelTableBtn").click(function () {
    closeModal();
  });

  $("#saveTableBtn").click(function () {
    var tableNumber = $("#TableNumberInsert").val().trim();
    var capacity = $("#CapacityInsert").val().trim();
    var status = $("#StatusInsert").val().trim();
    var usernameTable = $("#usernameTableInsert").val().trim();
    var passwordTable = $("#passwordTableInsert").val().trim();
    // Kiểm tra các điều kiện
    if (!tableNumber || !capacity) {
      $(".error-message5")
        .text("Vui lòng điền đầy đủ số bàn và số lượng ghế")
        .show();
      $("#TableNumber").focus();
      return;
    }

    if (!usernameTable) {
      $(".error-message5").text("Tên tài khoản không được để trống").show();
      $("#usernameTable").focus();
      return;
    }

    // Tạo object mới để lưu thông tin bàn
    var url =
      "https://resmant11111-001-site1.anytempurl.com/Table/Insert?" +
      "tableNumber=" +
      encodeURIComponent(tableNumber) +
      "&" +
      "status=" +
      encodeURIComponent(status) +
      "&" +
      "capacity=" +
      encodeURIComponent(capacity) +
      "&" +
      "username=" +
      encodeURIComponent(usernameTable) +
      "&" +
      "password=" +
      encodeURIComponent(passwordTable);

    $.ajax({
      url: url,
      method: "POST",
      success: function (response) {
        loadTables();
        $("#addTableModal").hide(); // Ẩn modal
        showNotification("Bàn đã được thêm thành công!");
        $("#TableNumber").val("");
        $("#Capacity").val("");
        $("#Status").val("");
        $("#usernameTable").val("");
        $("#passwordTable").val("");
        $(".error-message5").hide();
      },
      error: function (xhr, status, error) {
        const errorMessage =
          JSON.parse(xhr.responseText).message || "Có lỗi xảy ra khi thêm bàn.";
        $(".error-message5").text(errorMessage).show();
      },
    });
  });
  /*-------------------------------------------------Xóa------------------------------------------------*/
  let tableIdToDelete;

  $(document).on("click", ".btn-delete-table", function () {
    tableIdToDelete = $(this).data("id");
    console.log(tableIdToDelete);
    $("#confirmDeleteModal4").show();
    $("#overlay").show();
  });

  $("#confirmDeleteTableBtn").on("click", function () {
    console.log("yesss");
    $.ajax({
      url: `https://resmant11111-001-site1.anytempurl.com/Table/UpdateStatus?tableID=${tableIdToDelete}&status=Blocked`,
      method: "PUT",
      success: function (response) {
        loadTables(); // Tải lại danh sách bàn
        showNotification("Bàn đã được chuyển sang trạng thái blocked!");
        $("#confirmDeleteModal4").hide(); // Ẩn modal xác nhận
        $("#overlay").hide();
      },
      error: function (xhr, status, error) {
        console.error("Không thể cập nhật trạng thái bàn:", error);
        alert("Có lỗi xảy ra khi cập nhật trạng thái bàn.");
      },
    });
  });

  $("#cancelDeleteTableBtn").on("click", function () {
    closeModal2();
  });

  /*-------------------------------------------------Sửa------------------------------------------------*/

  let tableID;

  $(document).on("click", ".btn-edit-table", function () {
    tableID = $(this).data("id");
    $("#editTableModal").show();
    $("#overlay").show();
    var row = $(this).closest("tr");
    $("#TableNumberEdit").val(row.find(".table-number").text());
    $("#CapacityEdit").val(row.find(".table-capacity").text());
    $("#StatusEdit").val(row.find(".table-status").text().trim());
    $("#usernameTableEdit").val(row.find(".table-username").text());
    $("#passwordTableEdit").val(row.find(".table-password").text());
  });

  $("#cancelEditTableBtn").click(function () {
    closeModal();
  });

  $("#saveEditTableBtn").click(function () {
    var tableNumberEdit = $("#TableNumberEdit").val().trim();
    var capacityEdit = $("#CapacityEdit").val().trim();
    var statusEdit = $("#StatusEdit").val().trim();
    var usernameTableEdit = $("#usernameTableEdit").val().trim();
    var passwordTableEdit = $("#passwordTableEdit").val().trim();

    var tableUpdate = {
      TableID: tableID,
      TableNumber: tableNumberEdit,
      Capacity: capacityEdit,
      Status: statusEdit,
      Username: usernameTableEdit,
      Password: passwordTableEdit,
    };

    function updatedStaff1(tableUpdate) {
      $.ajax({
        url: "https://resmant11111-001-site1.anytempurl.com/Table/Update",
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(tableUpdate),
        success: function (response) {
          loadTables();
          $("#editTableModal").hide();
          showNotification("Cập nhật thành công!");
        },
        error: function (xhr, status, error) {
          console.error("Thất bại:", error);
          alert("Có lỗi xảy ra khi cập nhật.");
        },
      });
    }
    updatedStaff1(tableUpdate);
  });
  function showNotification(message) {
    $("#notificationMessage").text(message);
    $("#notificationModal").show();
  }
  $("#closeNotificationBtn").click(function () {
    closeModal2();
  });
});

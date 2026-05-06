# Unit Test Report: NotificationServiceTest

## 1. Thông tin chung
- **Class kiểm thử:** `NotificationServiceImplTest`
- **Class mục tiêu:** `NotificationServiceImpl`
- **Package:** `com.bfms.bfms_backend.service.impl`
- **Công nghệ:** JUnit 5, Mockito

## 2. Các kịch bản kiểm thử (Test Cases)

| ID | Tên Test Case | Mô tả | Input | Kết quả mong đợi | Trạng thái |
|----|---------------|-------|-------|------------------|------------|
| TC-01 | `notify_ShouldSaveNotification_WhenUserExists` | Gửi thông báo cho 1 người dùng | `userId = 1`, Msg="..." | Lưu `Notification` với `isRead = false` | ✅ PASSED |
| TC-02 | `notify_ShouldThrowException_WhenUserNotFound` | Lỗi khi gửi cho user không tồn tại | `userId = 999` | Throw `AppException` (USER_NOT_FOUND) | ✅ PASSED |
| TC-03 | `notifyAdmins_ShouldCallNotifyForEachAdmin` | Gửi thông báo cho toàn bộ Admin | Msg="..." | Gọi hàm lưu DB cho từng admin tìm thấy | ✅ PASSED |
| TC-04 | `markAsRead_ShouldUpdateIsReadStatus` | Đánh dấu đã đọc thông báo | `notiId = 50` | Chuyển `isRead` thành `true` | ✅ PASSED |

## 3. Ghi chú
- `notifyAdmins` là một tính năng quan trọng dùng để cảnh báo cho ban quản lý khi có các thay đổi nhạy cảm (duyệt hợp đồng, tài chính).

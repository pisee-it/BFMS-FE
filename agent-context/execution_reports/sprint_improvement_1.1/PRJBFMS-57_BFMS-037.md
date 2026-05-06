# Execution Report: PRJBFMS-57 (BFMS-037)
## Chuẩn hóa hệ thống xử lý ngoại lệ (Exception Handling)

### 1. Thông tin task
- **Jira ID:** PRJBFMS-57
- **Mô tả:** Xây dựng hệ thống ngoại lệ tùy chỉnh, mã lỗi (ErrorCode) và phản hồi lỗi chuẩn hóa cho toàn bộ dự án.
- **Ngày hoàn thành:** 2026-04-29

### 2. Các thay đổi chính

#### Backend
- **Module Core/Exception:**
    - `ErrorCode.java`: Khởi tạo Enum quản lý tập trung mã lỗi (String), thông báo (Tiếng Việt) và HttpStatus.
    - `AppException.java`: Tạo ngoại lệ nghiệp vụ tùy chỉnh kế thừa RuntimeException.
    - `ErrorResponse.java`: Cập nhật cấu trúc Record để bao gồm `code` và `timestamp`, hỗ trợ tốt hơn cho Frontend.
    - `GlobalExceptionHandler.java`: Tái cấu trúc bộ xử lý lỗi tập trung, bổ sung handler cho `AppException` và chuẩn hóa phản hồi cho các lỗi Security/Validation.
- **Service Layer (Refactoring):**
    - `BusServiceImpl.java`: Chuyển đổi toàn bộ logic ném lỗi sang `AppException`.
    - `RouteServiceImpl.java`: Chuẩn hóa lỗi tìm kiếm và ràng buộc khoảng cách.
    - `AdServiceImpl.java`: Áp dụng mã lỗi chi tiết cho module Quảng cáo (trùng mã thuế, vượt giới hạn hợp đồng...).
    - `NotificationServiceImpl.java`, `ReportServiceImpl.java`: Chuẩn hóa thông báo lỗi.

### 3. Kết quả kiểm chứng
- **Biên dịch:** Đã chạy `.\mvnw.cmd compile` và đạt kết quả `BUILD SUCCESS`.
- **Logic:** Các method trong Service đã được kiểm tra lại để đảm bảo ném đúng `ErrorCode` tương ứng với ngữ cảnh nghiệp vụ.

### 4. Tài liệu bổ sung (nếu có)
- Quy ước về Exception đã được cập nhật trong `PROJECT_MEMORY.md` (Session #20).

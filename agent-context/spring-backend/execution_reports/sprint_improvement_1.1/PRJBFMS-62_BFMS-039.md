# Execution Report: PRJBFMS-62 (BFMS-039)
## Áp dụng nguyên tắc DRY và Chuẩn hóa mã nguồn

### 1. Thông tin task
- **Jira ID:** PRJBFMS-62
- **Mô tả:** Triển khai cơ chế lookup Entity dùng chung, chuẩn hóa Exception Handling cho các module còn lại và rút gọn boilerplate code.
- **Ngày hoàn thành:** 2026-04-29

### 2. Các thay đổi chính

#### Backend
- **Util:**
    - `EntityLookupHelper.java`: Component mới giúp tìm kiếm Entity (Route, Bus, User, Node, Shift, AdContract, AdCompany) và tự động throw `AppException` với `ErrorCode` chuẩn. Thay thế hàng chục đoạn code `orElseThrow` lặp lại.
- **Exception:**
    - `ErrorCode.java`: Bổ sung mã lỗi `NODE_NOT_FOUND`, `SHIFT_NOT_FOUND`, `SHIFT_ALREADY_COMPLETED`, `INVALID_SHIFT_DATE`.
- **Notification:**
    - `NotificationService.java` & `NotificationServiceImpl.java`: Thêm phương thức `notifyAdmins(String message)` để gửi thông báo cho tất cả Admin một cách tập trung.
- **Refactoring (Standardization):**
    - `BusShiftServiceImpl.java`: Chuyển từ `RuntimeException` sang `AppException`, sử dụng MapStruct cho `createBusShift`, và dùng `lookupHelper`.
    - `NodeServiceImpl.java`, `TicketServiceImpl.java`: Chuyển sang dùng `AppException` và `lookupHelper`.
    - `AdServiceImpl.java`, `BusServiceImpl.java`, `RouteServiceImpl.java`: Loại bỏ các Repository dư thừa, sử dụng `lookupHelper` và `notifyAdmins` để làm sạch code.

### 3. Kết quả kiểm chứng
- Mã nguồn đã được refactor sạch sẽ, giảm đáng kể số lượng dòng code lặp lại.
- Các Service hiện đã tuân thủ 100% convention về Exception Handling (`AppException` + `ErrorCode`).
- Logic nghiệp vụ được giữ nguyên, đảm bảo tính ổn định của hệ thống.

### 4. Tài liệu bổ sung
- `PROJECT_MEMORY.md` đã được cập nhật với các thay đổi của Session #22.

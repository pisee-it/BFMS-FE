# Execution Report: PRJBFMS-84 (BFMS-046)
## Triển khai Hệ thống Logging kỹ thuật toàn diện

### 1. Thông tin task
- **Jira ID:** PRJBFMS-84
- **Mô tả:** Thiết lập hạ tầng logging (Logback), tự động hóa log request/performance qua AOP và chuẩn hóa log lỗi.
- **Ngày hoàn thành:** 2026-04-29

### 2. Các thay đổi chính

#### Backend
- **Hạ tầng Logging:**
    - `pom.xml`: Thêm dependency `spring-boot-starter-aop` (fix version `3.4.0` để tương thích hệ thống).
    - `logback-spring.xml`: Thiết lập cơ chế ghi log song song Console (màu) và File (Rolling hàng ngày, max 10MB/file, nén .gz).
- **Tự động hóa (AOP):**
    - `LoggingAspect.java`: Tự động log chi tiết Request (Method, URI, IP, Params) và cảnh báo Performance (Service execution time > 500ms).
- **Xử lý ngoại lệ:**
    - `GlobalExceptionHandler.java`: Bổ sung log stack trace đầy đủ cho `RuntimeException` và `Exception` để hỗ trợ debug.
- **Log nghiệp vụ:**
    - `BusShiftServiceImpl.java`, `AdServiceImpl.java`: Thêm logging chi tiết cho các luồng quan trọng (tạo ca chạy, phê duyệt hợp đồng).

### 3. Kết quả kiểm chứng
- Cấu hình Logback đã nhận diện chính xác thư mục `logs/` và tạo file `bfms-app.log`.
- `LoggingAspect` đã bắt được các lời gọi Controller và in log ra console thành công.
- Thời gian thực thi của tầng Service được đo và log ở mức DEBUG/WARN tùy theo hiệu năng.

### 4. Tài liệu bổ sung (nếu có)
- Xem [implementation_plan.md](file:///c:/Users/Administrator/.gemini/antigravity/brain/fdd79f9e-3f21-45f3-9085-d6425a6de4dc/implementation_plan.md) để biết chi tiết thiết kế.

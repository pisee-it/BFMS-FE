# Execution Report: PRJBFMS-48 (BFMS-039)
## [Integration Test] Luồng end-to-end US-03

### 1. Thông tin task
- **Jira ID:** PRJBFMS-48
- **Mô tả:** Triển khai bài kiểm tra tích hợp E2E cho luồng hoàn thành ca chạy: Route → Bus → Node → Shift → completeShift → kiểm tra DAILY_TICKET_STAT được upsert đúng.
- **Ngày hoàn thành:** 2026-04-25
- **Trạng thái:** [PASS] Thành công 100%

### 2. Chi tiết triển khai kỹ thuật
1. **Môi trường Test**:
   - Framework: Spring Boot Test 4.0.5 + MockMvc.
   - Nạp cấu hình: Sử dụng khối `static` với `Dotenv` để nạp biến môi trường trực tiếp từ file `.env`. Điều này giải quyết triệt để lỗi `ApplicationContext` khi chạy test.
   - Database: Kết nối thực tế tới Supabase Postgres (đảm bảo tính nhất quán với môi trường chạy thật).

2. **Mã nguồn kiểm thử (`BusShiftIntegrationTest.java`)**:
   - **Setup đầy đủ**: Khởi tạo đầy đủ các trường bắt buộc (NOT NULL) cho Route (path), Bus (model, manufacturer, yom), Node và Staff.
   - **JWT Simulation**: Sử dụng `JwtUtil` để tạo token thật cho STAFF user, đảm bảo bypass qua lớp SecurityFilter.
   - **Logic Verify**: 
     - Kiểm tra mã phản hồi HTTP 200 OK.
     - Kiểm tra JSON response (trạng thái COMPLETED, số lượng vé).
     - Kiểm tra database thực tế: Doanh thu tính toán đúng (vé lượt * 8000), DailyTicketStat được tạo/cập nhật chính xác.
     - Kiểm tra phân quyền: Trả về 403 Forbidden nếu không có token.

3. **Xử lý các vấn đề phát sinh**:
   - Đã xử lý lỗi biên dịch do thiếu module `jackson-datatype-jsr310` bằng cách khởi tạo thủ công `ObjectMapper`.
   - Đã sửa lỗi `DataIntegrityViolationException` bằng cách bổ sung dữ liệu setup đầy đủ.

### 3. Kết quả kiểm chứng
- **Lệnh thực thi**: `.\mvnw.cmd test -Dtest=BusShiftIntegrationTest`
- **Kết quả**:
  - `testCompleteShiftFlowSuccess`: PASSED
  - `testCompleteShift_Unauthorized_ShouldReturn403`: PASSED
- **Build Status**: **BUILD SUCCESS**

### 4. Tài liệu bổ sung
- Cập nhật quy trình kiểm thử tích hợp vào `PROJECT_MEMORY.md` (Session #18).

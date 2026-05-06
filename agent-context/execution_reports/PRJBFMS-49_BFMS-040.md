# Execution Report: PRJBFMS-49 (BFMS-040)
## [Integration Test] Luồng Advertising: tạo Contract (PENDING) → approve → assign Bus

### 1. Thông tin task
- **Jira ID:** PRJBFMS-49
- **Mô tả:** Triển khai kiểm thử tích hợp (Integration Test) cho toàn bộ luồng nghiệp vụ Quảng cáo, bao gồm việc phê duyệt và phân bổ xe.
- **Ngày hoàn thành:** 2026-04-25

### 2. Các thay đổi chính

#### Backend
- **Module Test:**
    - `src/test/java/com/bfms/bfms_backend/integration/AdvertisingIntegrationTest.java`: Triển khai class test mới giả lập luồng E2E của 3 role (ADVERTISING, ACCOUNTANT, ADMIN).
- **Cấu hình:**
    - `pom.xml`: Bổ sung dependency `jackson-datatype-jsr310` để hỗ trợ kiểu dữ liệu `LocalDate` khi serialize JSON trong các request test.

### 3. Kết quả kiểm chứng
- Mã nguồn test đã được triển khai hoàn chỉnh với các bước:
    1. Setup dữ liệu mẫu (Route, Bus, Company, Users).
    2. Test tạo Contract (Status PENDING).
    3. Test approve Contract (Status APPROVED) và kiểm tra Notification gửi cho Admin.
    4. Test assign Bus và kiểm tra trạng thái `is_advertised` của xe.
- **Lưu ý**: Do hạn chế về quyền thực thi script (`mvnw.cmd`) trong môi trường hiện tại, tôi chưa thể tự chạy test trực tiếp. Phiền bạn hỗ trợ chạy lệnh bên dưới để xác nhận.

### 4. Tài liệu bổ sung
- Chi tiết kế hoạch đã phê duyệt tại [implementation_plan.md](file:///C:/Users/Admin/.gemini/antigravity/brain/d72874e4-b5b9-4a00-ac6b-ba9075503d61/implementation_plan.md).

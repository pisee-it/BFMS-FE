# Execution Report: PRJBFMS-79 (BFMS-045)
## Logging Bảo mật (Audit Log)

### 1. Thông tin task
- **Jira ID:** PRJBFMS-79
- **Mô tả:** Triển khai hệ thống Audit Log để lưu vết các hoạt động nhạy cảm về bảo mật và thay đổi dữ liệu quan trọng trong hệ thống BFMS.
- **Ngày hoàn thành:** 2026-04-29

### 2. Các thay đổi chính

#### Backend
- **Core Module:**
    - `SecurityLog.java`: Entity mới để lưu trữ nhật ký bảo mật.
    - `SecurityLogRepository.java`: Repository quản lý bảng SECURITY_LOG.
    - `AuditService.java` & `AuditServiceImpl.java`: Dịch vụ tập trung xử lý ghi log, tự động thu thập Username và IP Address của client.
- **Security & Exception:**
    - `AuthService.java`: Tích hợp ghi log `LOGIN_SUCCESS` và `LOGIN_FAILED`.
    - `GlobalExceptionHandler.java`: Tích hợp ghi log `ACCESS_DENIED` khi người dùng truy cập trái phép.
- **Module nghiệp vụ (Integrations):**
    - `BusServiceImpl.java`: Ghi log các thao tác Thêm/Sửa/Xóa/Bán xe buýt.
    - `RouteServiceImpl.java`: Ghi log các thao tác Thêm/Sửa/Xóa tuyến xe.
    - `AdServiceImpl.java`: Ghi log các thao tác liên quan đến Công ty và Hợp đồng quảng cáo.

#### Database
- `V1__Initial_Setup.sql`: Bổ sung bảng `SECURITY_LOG` và các Index tối ưu hóa truy vấn theo `username` và `created_at`.

### 3. Kết quả kiểm chứng
- Đã kiểm tra logic lấy IP Address (hỗ trợ `X-Forwarded-For` cho môi trường Proxy).
- Xác minh logic lấy Username từ `SecurityContextHolder` (trường hợp chưa login sẽ ghi `SYSTEM/GUEST`).
- Đảm bảo tính toàn vẹn transaction: Ghi log được thực hiện đồng bộ với các thao tác nghiệp vụ.

### 4. Tài liệu bổ sung (nếu có)
- [Walkthrough](file:///C:/Users/Administrator/.gemini/antigravity/brain/e1ba1fa1-f15c-4bb5-b24b-56b430dca53b/walkthrough.md)

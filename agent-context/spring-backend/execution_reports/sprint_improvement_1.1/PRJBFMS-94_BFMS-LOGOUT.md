# Execution Report: PRJBFMS-94 (BFMS-LOGOUT)
## Bổ sung tính năng đăng xuất (Logout)

### 1. Thông tin task
- **Jira ID:** PRJBFMS-94
- **Mô tả:** Triển khai endpoint đăng xuất để vô hiệu hóa Refresh Token và ghi nhận sự kiện vào hệ thống Audit Log.
- **Ngày hoàn thành:** 2026-05-02

### 2. Các thay đổi chính

#### Tầng Security & Service
- **AuthService.java**: Thêm logic gọi `RefreshTokenService` để xóa token của người dùng khỏi cơ sở dữ liệu. Điều này đảm bảo người dùng không thể sử dụng Refresh Token cũ để lấy Access Token mới sau khi đã chọn đăng xuất.
- **Audit Logging**: Tích hợp ghi log sự kiện `LOGOUT` để phục vụ công tác giám sát bảo mật.

#### Tầng API (Controller)
- **AuthController.java**: 
    - Thêm endpoint `POST /api/v1/auth/logout`.
    - Phân quyền: Yêu cầu người dùng phải đã đăng nhập (`isAuthenticated()`).
    - Lấy thông tin định danh trực tiếp từ `SecurityContext` (thông qua đối tượng `Principal`).

### 3. Kết quả kiểm chứng
- **Swagger Documentation**: Endpoint mới đã xuất hiện trong tài liệu API với đầy đủ mô tả và yêu cầu bảo mật Bearer Token.
- **Logic**: Khi gọi logout, Refresh Token tương ứng trong bảng `refresh_tokens` sẽ bị xóa.

### 4. Tài liệu liên quan
- Kế hoạch: [implementation_plan.md](file:///C:/Users/Administrator/.gemini/antigravity/brain/f5e7b223-b224-429d-99de-1c3981f9c36e/implementation_plan.md)
- Nhật ký: [task.md](file:///C:/Users/Administrator/.gemini/antigravity/brain/f5e7b223-b224-429d-99de-1c3981f9c36e/task.md)

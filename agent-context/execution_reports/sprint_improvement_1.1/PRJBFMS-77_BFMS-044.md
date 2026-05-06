# Execution Report: PRJBFMS-77 (BFMS-044)
## Cấu hình Bảo mật Linh hoạt (Flexible Security Configuration)

### 1. Thông tin task
- **Jira ID:** PRJBFMS-77
- **Mô tả:** Di chuyển các cấu hình bảo mật cứng từ mã nguồn ra file application.yaml để tăng tính linh hoạt và dễ bảo trì.
- **Ngày hoàn thành:** 2026-04-29

### 2. Các thay đổi chính

#### Backend
- **Module Security:**
    - `SecurityProperties.java`: [NEW] Tạo class mapping cấu hình từ prefix `application.security`.
    - `SecurityConfig.java`: [MODIFY] Inject `SecurityProperties`, cấu hình CORS động và nạp danh sách `permitAllPatterns` từ YAML.
    - `JwtUtil.java`: [MODIFY] Sử dụng `SecurityProperties` để lấy các thông số Secret Key và Expiration thay vì dùng `@Value`.
- **Configuration:**
    - `application.yaml`: [MODIFY] Bổ sung cấu trúc cấu hình mới cho bảo mật (permit-all-patterns, cors).

### 3. Kết quả kiểm chứng
- Cấu trúc mã nguồn đã được tách biệt giữa logic và cấu hình.
- Đã cung cấp lệnh biên dịch `.\mvnw.cmd clean compile` cho người dùng xác minh.

### 4. Tài liệu bổ sung (nếu có)
- N/A

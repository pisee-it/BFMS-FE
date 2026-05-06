# Unit Test Report: AuditServiceTest

## 1. Thông tin chung
- **Class kiểm thử:** `AuditServiceImplTest`
- **Class mục tiêu:** `AuditServiceImpl`
- **Package:** `com.bfms.bfms_backend.service.impl`
- **Công nghệ:** JUnit 5, Mockito

## 2. Các kịch bản kiểm thử (Test Cases)

| ID | Tên Test Case | Mô tả | Input | Kết quả mong đợi | Trạng thái |
|----|---------------|-------|-------|------------------|------------|
| TC-01 | `log_ShouldSaveSecurityLogWithUserAndIp` | Ghi log thành công khi có user đăng nhập | Action="TEST", Desc="..." | Lưu `SecurityLog` với đúng username và IP từ request | ✅ PASSED |
| TC-02 | `log_ShouldSaveWithSystemUser_WhenNoAuthentication` | Ghi log khi khách (guest) hoặc hệ thống thực hiện | Action="GUEST", Desc="..." | Lưu `SecurityLog` với username là `SYSTEM/GUEST` | ✅ PASSED |

## 3. Ghi chú
- Sử dụng `ArgumentCaptor` để kiểm tra chính xác nội dung thực thể `SecurityLog` trước khi lưu vào Database.
- Giả lập `SecurityContextHolder` và `RequestContextHolder` để trích xuất thông tin người dùng và địa chỉ IP.

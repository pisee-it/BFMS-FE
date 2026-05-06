# Unit Test Report: AuthServiceTest

## 1. Thông tin chung
- **Class kiểm thử:** `AuthServiceTest`
- **Class mục tiêu:** `AuthService`
- **Package:** `com.bfms.bfms_backend.security`
- **Công nghệ:** JUnit 5, Mockito

## 2. Các kịch bản kiểm thử (Test Cases)

| ID | Tên Test Case | Mô tả | Input | Kết quả mong đợi | Trạng thái |
|----|---------------|-------|-------|------------------|------------|
| TC-01 | `login_ShouldReturnAuthResponse_WhenCredentialsAreValid` | Đăng nhập thành công với thông tin đúng | `admin / password` | Trả về `AuthResponse` (Access Token, Refresh Token, Role) | ✅ PASSED |
| TC-02 | `login_ShouldThrowException_WhenCredentialsAreInvalid` | Đăng nhập thất bại khi sai mật khẩu | `admin / wrong` | Throw `AuthenticationException` và ghi log `LOGIN_FAILED` | ✅ PASSED |
| TC-03 | `refreshToken_ShouldReturnNewAccessToken_WhenTokenIsValid` | Làm mới access token thành công | `valid-refresh-token` | Trả về access token mới | ✅ PASSED |
| TC-04 | `refreshToken_ShouldThrowException_WhenTokenIsNotFound` | Thất bại khi dùng refresh token không tồn tại | `invalid-token` | Throw `RuntimeException` | ✅ PASSED |

## 3. Ghi chú
- Sử dụng `AuthenticationManager` mock để giả lập quy trình xác thực của Spring Security.
- Tích hợp kiểm tra việc gọi `AuditService` để đảm bảo nhật ký bảo mật được ghi nhận đúng.

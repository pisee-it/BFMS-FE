# Unit Test Report: RefreshTokenServiceTest

## 1. Thông tin chung
- **Class kiểm thử:** `RefreshTokenServiceImplTest`
- **Class mục tiêu:** `RefreshTokenServiceImpl`
- **Package:** `com.bfms.bfms_backend.service.impl`
- **Công nghệ:** JUnit 5, Mockito

## 2. Các kịch bản kiểm thử (Test Cases)

| ID | Tên Test Case | Mô tả | Input | Kết quả mong đợi | Trạng thái |
|----|---------------|-------|-------|------------------|------------|
| TC-01 | `createRefreshToken_ShouldReturnToken_WhenUserExists` | Tạo mới refresh token cho user | `username = "testuser"` | Tạo UUID token mới, xóa token cũ của user đó | ✅ PASSED |
| TC-02 | `verifyExpiration_ShouldReturnToken_WhenNotExpired` | Xác thực token còn hạn | Token hết hạn sau 60s | Trả về chính token đó | ✅ PASSED |
| TC-03 | `verifyExpiration_ShouldThrowException_WhenExpired` | Xác thực token đã hết hạn | Token hết hạn cách đây 60s | Throw `RuntimeException` và xóa token khỏi DB | ✅ PASSED |

## 3. Ghi chú
- Cơ chế Refresh Token của BFMS sử dụng UUID lưu trong DB để đảm bảo có thể thu hồi (revoke) bất cứ lúc nào.

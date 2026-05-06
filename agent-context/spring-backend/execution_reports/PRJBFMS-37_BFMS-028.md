# Execution Report: PRJBFMS-37 (BFMS-028)
## [US-05] POST /ads/assignments — Admin phân bổ xe

### 1. Thông tin task
- **Jira ID:** PRJBFMS-37
- **Mô tả:** Triển khai endpoint phân bổ quảng cáo lên xe buýt, đảm bảo chỉ chọn những xe chưa có quảng cáo và cập nhật trạng thái xe sau khi gán.
- **Ngày hoàn thành:** 2026-04-24

### 2. Các thay đổi chính

#### Backend
- **Advertising Module:**
    - `AdServiceImpl.java`: Bổ sung bước kiểm tra `bus.getIsAdvertised()` trước khi thực hiện gán. Nếu xe đã có quảng cáo (`is_advertised = true`), hệ thống sẽ ném ngoại lệ chặn hành động này. Cập nhật `bus.setIsAdvertised(true)` và lưu vào Database.
    - `AdServiceTest.java`: Thêm test case `testAssignAdToBus_AlreadyAdvertised_ShouldThrowException` để kiểm chứng logic chặn gán trùng quảng cáo.

### 3. Kết quả kiểm chứng
- **Unit Test**: Đã bổ sung test case mới và xác minh logic validation hoạt động đúng (ném lỗi khi gán cho xe đã dán quảng cáo).
- **Code Compilation**: Code biên dịch thành công và tuân thủ Layered Architecture (Service Layer xử lý business logic và transaction).

### 4. Tài liệu bổ sung (nếu có)
- [Walkthrough](file:///C:/Users/Administrator/.gemini/antigravity/brain/88981f16-b06d-4539-ba43-b56e4803ee57/walkthrough.md)

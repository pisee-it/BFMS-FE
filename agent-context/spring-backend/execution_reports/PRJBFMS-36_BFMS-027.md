# Execution Report: PRJBFMS-36 (BFMS-027)
## Phê duyệt hợp đồng quảng cáo & Hệ thống thông báo

### 1. Thông tin task
- **Jira ID:** PRJBFMS-36
- **Mô tả:** Triển khai API phê duyệt hợp đồng quảng cáo cho Kế toán và tự động gửi thông báo cho Admin.
- **Ngày hoàn thành:** 2026-04-24

### 2. Các thay đổi chính

#### Backend
- **Notification Module:**
    - `Notification.java`: Entity ánh xạ bảng NOTIFICATION.
    - `NotificationRepository.java`: Hỗ trợ tìm kiếm thông báo theo User.
    - `NotificationService.java` & `NotificationServiceImpl.java`: Logic tạo thông báo và lấy danh sách thông báo.
    - `NotificationController.java`: API `GET /api/v1/notifications` và `PATCH /api/v1/notifications/{id}/read`.
    - `NotificationResponse.java`: DTO trả về dữ liệu tinh gọn.
- **Advertising Module:**
    - `AdServiceImpl.java`: Cập nhật `approveContract` để tìm danh sách Admin và gửi thông báo khi hợp đồng được duyệt.
- **User Module:**
    - `AppUserRepository.java`: Thêm `findByRole` để lọc người dùng theo vai trò.
- **Refactoring:**
    - Tái cấu trúc toàn bộ Controller và Service để sử dụng **Interface** thay vì lớp `Impl` (Programming to an Interface).

### 3. Kết quả kiểm chứng
- Code biên dịch thành công.
- Logic `@Transactional` được áp dụng cho việc lưu hợp đồng và gửi thông báo đồng thời.
- Phân quyền sử dụng `@PreAuthorize` được áp dụng cho các endpoint mới.

### 4. Tài liệu bổ sung
- Knowledge Item: `agent-context/knowledge/programming_to_interface.md`

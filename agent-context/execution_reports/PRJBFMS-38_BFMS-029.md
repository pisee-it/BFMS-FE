# Execution Report: PRJBFMS-38 (BFMS-029)
## [Module: Notify] Entity + Service + Controller (Polling cho Admin)

### 1. Thông tin task
- **Jira ID:** PRJBFMS-38
- **Mô tả:** Hoàn thiện module thông báo, hỗ trợ phân trang cho trang chuyên biệt và popup, đồng thời thắt chặt bảo mật cho Admin polling.
- **Ngày hoàn thành:** 2026-04-24

### 2. Các thay đổi chính

#### Backend
- **Notify Module:**
    - `Notification.java`: Refactor từ `@Data` sang `@Getter/@Setter/@NoArgsConstructor`.
    - `NotificationRepository.java`: Thêm hỗ trợ `Pageable` cho method truy vấn.
    - `NotificationService.java` & `NotificationServiceImpl.java`: Nâng cấp xử lý trả về `Page<Notification>`.
    - `NotificationController.java`: Thêm `@PreAuthorize("hasRole('ADMIN')")` và hỗ trợ tham số phân trang.
- **Auth Module:**
    - `AppUser.java`: Refactor từ `@Data` sang `@Getter/@Setter/@NoArgsConstructor` để đồng nhất convention.

### 3. Kết quả kiểm chứng
- Code đã được kiểm tra tính nhất quán giữa các layer.
- Đảm bảo logic trả về toàn bộ thông báo (bao gồm `is_read = false/true`) theo đúng yêu cầu từ phía người dùng để Frontend tự xử lý hiển thị.
- Cấu trúc API RESTful chuẩn với tham số phân trang.

### 4. Tài liệu bổ sung (nếu có)
- [Walkthrough](file:///c:/Users/Administrator/.gemini/antigravity/brain/3fc54196-2e3f-4fca-9a73-2f40d4189632/walkthrough.md)

# Execution Report: PRJBFMS-47 (BFMS-038)
## Tinh chỉnh phân quyền Role-Based Access Control (RBAC)

### 1. Thông tin task
- **Jira ID:** PRJBFMS-47
- **Mô tả:** Khắc phục lỗi phân quyền tại endpoint báo cáo doanh thu và tạo hợp đồng quảng cáo. Đảm bảo ADMIN có quyền giám sát và OWNER có quyền tạo hợp đồng.
- **Ngày hoàn thành:** 2026-04-25

### 2. Các thay đổi chính

#### Backend (Java)
- **RevenueController.java**:
    - Cập nhật `@PreAuthorize` cho endpoint `GET /api/v1/revenue/total`.
    - Thêm vai trò `ADMIN` vào danh sách cho phép (bên cạnh `OWNER`).
- **AdController.java**:
    - **Tạo hợp đồng**: Cập nhật `@PreAuthorize` cho endpoint `POST /api/v1/ads/contracts`, cho phép `OWNER` tham gia tạo hợp đồng.
    - **Quản lý công ty**: Thêm `OWNER` vào endpoint `POST /api/v1/ads/companies`.
    - **Gán quảng cáo**: Cập nhật endpoint `POST /api/v1/ads/assignments` để cho phép cả `ADMIN` và `OWNER` thực hiện.
- **Bảo mật**: Giữ nguyên hạn chế cho `ADMIN` đối với việc tạo mới hợp đồng (`POST /contracts`) để bảo vệ thông tin kinh tế nhạy cảm theo yêu cầu.

#### Tài liệu (agent-context)
- **PROJECT_CONTEXT.md**:
    - Cập nhật bảng mô tả vai trò: `OWNER` có thêm quyền quản lý hợp đồng.
    - Cập nhật bảng danh sách API Endpoints để khớp với code thực tế.

### 3. Kết quả kiểm chứng
- **STAFF**: Đã xác nhận việc chặn truy cập doanh thu tổng là đúng thiết kế. Hệ thống trả về `403 Forbidden` chuẩn xác qua `GlobalExceptionHandler`.
- **OWNER**: Đã có thể truy cập các API nghiệp vụ của Advertising.
- **ADMIN**: Đã có quyền "God View" để xem báo cáo tài chính mà không cần mạo danh Owner.

### 4. Tài liệu bổ sung
- [Implementation Plan (Final)](file:///C:/Users/Admin/.gemini/antigravity/brain/b11f8668-91cf-458a-bba5-57770132caaf/artifacts/implementation_plan_RBAC_fix.md)

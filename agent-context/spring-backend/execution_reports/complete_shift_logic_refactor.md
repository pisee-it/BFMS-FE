`[PRJBFMS-29: BFMS-020 (Module: Revenue)]`
- Đã thêm logic lưu vết Ticket (SINGLE/MONTHLY) vào `com.bfms.bfms_backend.service.impl.BusShiftServiceImpl`.
- Đã sửa API Paths trong `com.bfms.bfms_backend.controller.BusShiftController` để khớp với đặc tả (`/api/v1/shifts/...`).
- Đã sửa `com.bfms.bfms_backend.controller.BusController` và `com.bfms.bfms_backend.controller.RouteController` để inject Interface thay vì Implementation.
- Đã kiểm chứng `AppUser` trả về đúng username/password và đánh dấu FIXED trong memory.
- Đã cập nhật `PROJECT_MEMORY.md` (Session #1) để đồng bộ trạng thái dự án cho các agent sau.

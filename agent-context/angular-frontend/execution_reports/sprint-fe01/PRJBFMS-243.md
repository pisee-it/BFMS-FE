# Execution Report: PRJBFMS-243 (BFMS-FE)

## Xây dựng Layout ứng dụng & Trang Login

### 1. Thông tin task

- **Jira ID:** PRJBFMS-243
- **Mô tả:** Triển khai trang Login và khung Dashboard (Sidebar, Navbar, Layout) với phong cách Enterprise Glassmorphism.
- **Ngày hoàn thành:** 2026-05-06

### 2. Các thay đổi chính (Chi tiết theo Subtask)

#### [PRJBFMS-246]: Triển khai trang Login (Giai đoạn 1)

- **Thay đổi:**
  - Tạo `LoginComponent` tại `src/app/features/auth/login`.
  - Thiết kế giao diện Glassmorphism Dark Mode chính xác theo Wireframe.
  - Tích hợp Reactive Forms với validation.
  - Kết nối thực tế với Backend API `/api/v1/auth/login`, xử lý JWT Token (Access/Refresh).
  - Sử dụng thông tin đăng nhập từ `user_info.md` (admin1/min@ad1211).

#### [PRJBFMS-244]: Sidebar Tối giản (Giai đoạn 2)

- **Thay đổi:**
  - Tạo `SidebarComponent` tại `src/app/layout/sidebar`.
  - Quản lý trạng thái thu gọn (Collapsed) bằng **Angular Signals** thông thông qua `LayoutService`.
  - Sử dụng Lucide Icons đồng bộ, hỗ trợ hiệu ứng hover và active state rõ ràng.

#### [PRJBFMS-245]: Navbar Chức năng & Breadcrumbs (Giai đoạn 3)

- **Thay đổi:**
  - Tạo `NavbarComponent` tại `src/app/layout/navbar`.
  - Triển khai **Breadcrumbs** (Home > Tổng quan) và thanh tìm kiếm nhanh.
  - Xây dựng **User Profile Menu** (Dropdown) tùy chỉnh với đầy đủ chức năng Hồ sơ và Đăng xuất.
  - Xử lý triệt để lỗi "Header host is not allowed" bằng cách cấu hình `allowedHosts` trong `angular.json`.

#### [PRJBFMS-247]: Layout Dashboard Tổng thể (Giai đoạn 4)

- **Thay đổi:**
  - Tạo `DashboardLayoutComponent` để kết hợp Sidebar, Navbar và nội dung chính.
  - Cấu hình **Nested Routes** trong `app.routes.ts` để quản lý điều hướng mượt mà.
  - Cleanup `app.html` và thiết lập `router-outlet`.

### 3. Công nghệ & Kỹ thuật sử dụng

- **Angular Signals:** Core state management cho Sidebar và Auth state.
- **Pure CSS (Scss) + Inline Styles:** Tối ưu hóa hiển thị chính xác theo thiết kế Glassmorphism, tránh xung đột theme.
- **Vite Configuration:** Cấu hình `allowedHosts` để hỗ trợ phát triển đa nền tảng.

### 4. Kết quả kiểm chứng

- Đã kiểm tra quy trình Login -> Dashboard thành công với tài khoản thật.
- Giao diện đáp ứng tốt yêu cầu "Enterprise, Tối giản, Chuyên nghiệp".

# Project Memory: BFMS-FE

## 1. Quyết định Thiết kế & UI/UX
- **Phong cách:** Enterprise Glassmorphism (Charcoal / Deep Gray).
- **Nguyên tắc:** Tối giản, ưu tiên tốc độ và sự rõ ràng cho nhân viên nội bộ.
- **Kỹ thuật:** Sử dụng Pure CSS kết hợp Inline Styles cho các thành phần Layout cốt lõi để đảm bảo hiển thị đúng 100% trong môi trường Dark Mode, tránh bị ghi đè bởi PrimeNG theme mặc định.

## 2. Quản lý trạng thái (State Management)
- **Signals:** Sử dụng Signals làm core state management cho tất cả các trạng thái cục bộ và layout (ví dụ: `isSidebarCollapsed` trong `LayoutService`).
- **Auth:** Lưu trữ JWT Token trong `localStorage`. `AuthService` sử dụng `HttpClient` để giao tiếp với backend.

## 3. Cấu hình Môi trường & Host
- **Lỗi Host:** Khi chạy `ng serve` trên host `0.0.0.0` hoặc truy cập qua IP khác, luôn phải đảm bảo `angular.json` có cấu hình `allowedHosts: ["localhost", "127.0.0.1", "0.0.0.0"]`.
- **Port:** Mặc định sử dụng cổng `4200`.

## 4. Cấu trúc Thư mục (DDD)
- `core/`: Chứa các dịch vụ singleton, guards, interceptors (ví dụ: `AuthService`).
- `layout/`: Chứa các thành phần khung của ứng dụng (Sidebar, Navbar, DashboardLayout).
- `features/`: Chứa các module chức năng (Login, Dashboard, và các module CRUD sau này).

## 5. Tài khoản Kiểm thử
- **Username:** `admin1`
- **Password:** `min@ad1211`
- **Endpoint API:** `http://localhost:8080/api/v1/auth/login`

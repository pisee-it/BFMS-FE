# BFMS - API Specification

Tài liệu đặc tả API chi tiết

## 1. Tổng quan kỹ thuật

Hệ thống BFMS cung cấp các RESTful API phục vụ nền tảng Web (Angular). Các API được thiết kế theo nguyên tắc Stateless và bảo mật qua JWT.

*   **Base URL**: `/api/v1`
*   **Content-Type**: `application/json`
*   **Authentication**: Bearer Token (JWT) trong Header `Authorization`.

## 2. Danh sách API theo Module

### 2.1. Module: Xác thực (Authentication)

*   **ROLE**: `ALL`
*   **Login**: Đăng nhập hệ thống
    *   `POST /auth/login`
    *   **Request Body**: `{ "username": "...", "password": "..." }`
*   **Refresh Token**: Làm mới phiên đăng nhập
    *   `POST /auth/refresh`
    *   **Request Body**: `{ "refreshToken": "..." }`
*   **Logout**: Đăng xuất và hủy Refresh Token
    *   `POST /auth/logout` (Authenticated)

### 2.2. Module: Tổng doanh thu

*   **ROLE**: `OWNER`, `ADMIN`
*   **US-01**: Xem tổng doanh thu theo ngày/tháng/năm
    *   `GET /revenue/total?timeframe={day|month|year}&date=...`

### 2.3. Module: Vé

*   **ROLE**: `OWNER`
*   **US-02**: Thống kê số lượng vé lượt và vé tháng
    *   `GET /tickets/statistics?routeId={id}&date=...`

### 2.4. Module: Chuyến xe (Bus Shift)

*   **ROLE**: `ADMIN`
*   **Tạo ca chạy**: Tạo ca chạy mới cho một nốt xe
    *   `POST /shifts/node/{nodeId}`
*   **ROLE**: `STAFF`
*   **US-03**: Cập nhật dữ liệu sau mỗi lượt xe hoàn thành (Transaction Required)
    *   `POST /shifts/{shiftId}/complete`
    *   **Request Body**:
        ```json
        {
          "total_single_tickets": 45,
          "total_monthly_tickets": 15
        }
        ```
*   **ROLE**: `OWNER`, `ADMIN`
*   **US-09**: Xem danh sách lượt xe đang chạy (Realtime)
    *   `GET /shifts/active?routeId={id}`

### 2.5. Module: Quảng cáo (Advertising)

*   **Công ty Quảng cáo**:
    *   `POST /ads/companies` (ADVERTISING, ADMIN, OWNER)
    *   `GET /ads/companies` (ADVERTISING, ADMIN, ACCOUNTANT)
*   **Hợp đồng Quảng cáo**:
    *   `POST /ads/contracts` (ADVERTISING, OWNER) - Tạo yêu cầu hợp đồng
    *   `GET /ads/contracts` (ADVERTISING, ADMIN, ACCOUNTANT, OWNER) - Xem danh sách hợp đồng
    *   `PATCH /ads/contracts/{id}/approve` (ACCOUNTANT) - Duyệt hiệu lực hợp đồng
    *   `PATCH /ads/contracts/{id}/request-delete` (ACCOUNTANT) - Yêu cầu xóa hợp đồng
    *   `DELETE /ads/contracts/{id}` (OWNER) - Xóa hợp đồng
*   **Phân bổ Quảng cáo**:
    *   `POST /ads/assignments` (ADMIN, OWNER) - Phân bổ quảng cáo lên xe

### 2.6. Module: Tuyến xe & Nốt xe

*   **ROLE**: `ADMIN`
*   **US-07**: Quản lý thông tin tuyến xe (CRUD)
    *   `POST /routes`, `GET /routes`, `PUT /routes/{id}`, `DELETE /routes/{id}`
*   **US-08**: Quản lý nốt xe
    *   `POST /routes/{routeId}/nodes`

### 2.7. Module: Xe buýt

*   **ROLE**: `ADMIN`
*   **US-10**: Quản lý thông tin xe buýt (CRUD)
    *   `POST /buses`, `GET /buses`, `PUT /buses/{id}`, `DELETE /buses/{id}`

### 2.8. Module: Thông báo (Notification)

*   **ROLE**: `ADMIN` (Theo code hiện tại)
*   **Xem thông báo**: Lấy danh sách thông báo của người dùng
    *   `GET /notifications?page=0&size=10`
*   **Đánh dấu đã đọc**:
    *   `PATCH /notifications/{id}/read`

### 2.9. Module: Báo cáo

*   **ROLE**: `OWNER`
*   **US-11**: Xuất báo cáo doanh thu theo tuyến
    *   `GET /reports/export?routeId={id}&format={pdf|excel}`
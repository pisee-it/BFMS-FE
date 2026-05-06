# BFMS - Software Design Document

Tài liệu Thiết kế Hệ thống – Version 1.2
Dự án: Bus Finance Management System
Giai đoạn: Hoàn thiện Kiến trúc (The Architect)

## 1. Kiến trúc Hệ thống (C4 Model)

### 1.1 Level 1 : Context Diagram

*   **Mục đích:** Thể hiện bức tranh toàn cảnh về cách Hệ thống BFMS tương tác với các tác nhân (users) và các hệ thống bên ngoài.
*   **Chi tiết:** Hệ thống BFMS đóng vai trò trung tâm xử lý tài chính, vận hành và phân bổ quảng cáo xe buýt.
    *   Tương tác với 5 tác nhân nội bộ: Owner (Xem báo cáo tổng hợp), Admin (Quản trị hạ tầng, nhận thông báo hệ thống), Accountant (Duyệt thanh toán, kích hoạt thông báo phê duyệt hợp đồng), Staff (Chốt số liệu thực tế từng chuyến), và Advertising - Người quản lý quảng cáo (Kê khai & upload hợp đồng).
    *   Tương tác với thực thể bên ngoài: Đối tác quảng cáo (Cung cấp nội dung decal/nguồn thu) và hệ thống Ngân hàng (Xử lý dòng tiền).

### 1.2 Level 2 : Container Diagram (Backend)

*   **Mục đích:** Bóc tách kiến trúc kỹ thuật tổng thể của BFMS thành các khối (container) độc lập có thể deploy riêng biệt.
*   **Chi tiết:** Bao gồm 3 khối chính:
    *   **Angular (Web Application):** Ứng dụng SPA giao tiếp trực tiếp với người dùng qua trình duyệt. Gọi API bảo mật qua HTTPS/JSON. Tích hợp cơ chế Polling (gọi API định kỳ) để liên tục cập nhật thông báo mới (ví dụ: hiển thị icon chuông thông báo cho Admin).
    *   **Spring Boot (API Backend):** Trái tim của hệ thống. Xử lý logic nghiệp vụ, quản lý Transaction, tính toán doanh thu/thuế, xác thực JWT và cung cấp các endpoint RESTful (bao gồm cả API GET `/api/v1/notifications`).
    *   **PostgreSQL (Relational Database):** Nơi lưu trữ an toàn, toàn vẹn dữ liệu quan hệ. Hiện tại bao gồm 12 bảng cốt lõi (11 bảng ban đầu + bảng NOTIFICATION mới bổ sung).

### 1.3 Level 3: Component Diagram (Backend)

*   **Mục đích:** Đi sâu vào cấu trúc bên trong của khối Spring Boot, mô tả cách các layer giao tiếp với nhau trong một request cụ thể.
*   **Chi tiết:** Áp dụng chuẩn Layered Architecture và nguyên tắc Clean Code:
    *   **Security Filter Layer:** Chặn request, xác thực JWT token và kiểm tra quyền (RBAC) trước khi cho phép truy cập.
    *   **Controller Layer:** Nhận request, validate DTO. Tham chiếu thêm NotificationController để phục vụ lấy danh sách thông báo.
    *   **Service Layer (@Transactional):** Xử lý Core Logic. Đảm bảo tính toàn vẹn dữ liệu. Bao gồm các Domain Service (Bus, Route, Ad) và các hạ tầng Service như `NotificationService`, `AuthService` (login/logout), `RefreshTokenService` để quản lý phiên đăng nhập và bảo mật. Cấu trúc được thiết kế lỏng lẻo (loose coupling) thông qua việc gọi chéo dịch vụ.
    *   **Repository Layer (Spring Data JPA):** Tương tác trực tiếp với Database thông qua Hibernate để thực thi các câu lệnh SQL.

## 2. Thiết kế Cơ sở dữ liệu (Data Dictionary)

Cấu trúc bảng được lấy chính xác theo bản bfms_raw.pdf

### 2.1. APP_USER

Lưu trữ thông tin tài khoản người dùng hệ thống, bao gồm chủ xe, kế toán, nhân viên quảng cáo, tài xế và quản trị viên.

| Column        | Data Type     | Constraint             | Description                                                              |
| :------------ | :------------ | :--------------------- | :----------------------------------------------------------------------- |
| id            | SERIAL        | PRIMARY KEY            | Khóa chính, tự tăng                                                      |
| username      | VARCHAR(50)   | UNIQUE, NOT NULL       | Tên đăng nhập duy nhất                                                   |
| password      | VARCHAR(255)  | NOT NULL               | Mã băm BCrypt                                                            |
| fullname      | VARCHAR(100)  | NOT NULL               | Họ tên đầy đủ                                                            |
| age           | INT           | CHECK (age > 0)        | Tuổi người dùng                                                          |
| licence_type  | VARCHAR(20)   | Nullable               | Hạng bằng lái (dành cho tài xế/nhân viên)                                |
| avatar_url    | TEXT          | Nullable               | Đường dẫn ảnh đại diện                                                   |
| role          | VARCHAR(20)   | CHECK IN (OWNER, ...)  | Vai trò trong hệ thống                                                   |

### 2.2. NOTIFICATION

Lưu các thông báo hệ thống gửi đến người dùng, hỗ trợ theo dõi trạng thái đã đọc hay chưa.

| Column     | Data Type     | Constraint                  | Description                     |
| :--------- | :------------ | :-------------------------- | :------------------------------ |
| id         | SERIAL        | PRIMARY KEY                 | Khóa chính, tự tăng             |
| user_id    | INT           | FK → APP_USER(id)           | Người nhận thông báo            |
| message    | TEXT          | NOT NULL                    | Nội dung thông báo              |
| is_read    | BOOLEAN       | DEFAULT FALSE               | Trạng thái đã đọc              |
| created_at | TIMESTAMPTZ   | DEFAULT NOW, NOT NULL       | Thời điểm tạo thông báo        |

### 2.3. ROUTE

Lưu thông tin các tuyến xe buýt bao gồm hai bến, lộ trình, khoảng cách, giờ hoạt động và giá vé.

| Column          | Data Type      | Constraint      | Description                               |
| :-------------- | :------------- | :-------------- | :---------------------------------------- |
| id              | SERIAL         | PRIMARY KEY     | Khóa chính, tự tăng                       |
| route_number    | VARCHAR(20)    | NOT NULL        | Số hiệu tuyến (VD: 01, 27B)               |
| stop_a          | VARCHAR(100)   | Nullable        | Tên bến đầu A                             |
| stop_b          | VARCHAR(100)   | Nullable        | Tên bến đầu B                             |
| path            | TEXT           | Nullable        | Mô tả lộ trình dạng text                   |
| distance_ab     | DECIMAL(10,2)  | CHECK >= 0      | Khoảng cách chiều A→B (km)                |
| distance_ba     | DECIMAL(10,2)  | CHECK >= 0      | Khoảng cách chiều B→A (km)                |
| operation_start | TIME           | Nullable        | Giờ bắt đầu hoạt động                     |
| operation_end   | TIME           | Nullable        | Giờ kết thúc hoạt động                    |
| price           | DECIMAL(15,2)  | CHECK >= 0      | Giá vé lượt (VNĐ)                         |

### 2.4. NODE

Đại diện cho một nốt (lượt chạy) của tuyến trong một ngày cụ thể. Tổng hành khách là giá trị phái sinh được Service layer tổng hợp từ các ca chạy.

| Column           | Data Type   | Constraint        | Description                                      |
| :--------------- | :---------- | :---------------- | :----------------------------------------------- |
| id               | SERIAL      | PRIMARY KEY       | Khóa chính, tự tăng                              |
| route_id         | INT         | FK → ROUTE(id)    | Tuyến xe thuộc về                                |
| node_number      | INT         | Nullable          | Số thứ tự nốt trong ngày                         |
| execution_date   | DATE        | NOT NULL          | Ngày thực hiện nốt chạy                          |
| description      | TEXT        | Nullable          | Ghi chú thêm về nốt chạy                         |
| total_passengers | INT         | DEFAULT 0 [Derived] | Tổng hành khách — SUM từ BUS_SHIFT, do Service layer cập nhật |

### 2.5. BUS

Lưu thông tin phương tiện xe buýt: dòng xe, nhà sản xuất, sức chứa, biển số và trạng thái hoạt động.

| Column        | Data Type     | Constraint                               | Description                               |
| :------------ | :------------ | :--------------------------------------- | :---------------------------------------- |
| id            | SERIAL        | PRIMARY KEY                              | Khóa chính, tự tăng                       |
| route_id      | INT           | FK → ROUTE(id)                           | Tuyến xe đang vận hành                    |
| bus_model     | VARCHAR(100)  | Nullable                                 | Mẫu mã / dòng xe                          |
| manufacturer  | VARCHAR(100)  | Nullable                                 | Hãng sản xuất                            |
| capacity      | INT           | CHECK > 0                                | Sức chứa tối đa (số ghế)                 |
| yom           | INT           | Nullable                                 | Năm sản xuất (Year Of Manufacture)        |
| license_plate | VARCHAR(20)   | UNIQUE, NOT NULL                         | Biển số xe                                |
| status        | VARCHAR(20)   | CHECK IN (ACTIVE, INACTIVE, MAINTENANCE) | Trạng thái hoạt động                     |
| is_advertised | BOOLEAN       | DEFAULT FALSE                            | Xe có đang mang quảng cáo không           |

### 2.6. ECONOMY_REPORT

Tổng hợp báo cáo kinh tế theo tuyến và theo kỳ: doanh thu vé, doanh thu quảng cáo, khấu trừ thuế và lợi nhuận ròng.

| Column               | Data Type      | Constraint      | Description                                       |
| :------------------- | :------------- | :-------------- | :------------------------------------------------ |
| id                   | SERIAL         | PRIMARY KEY     | Khóa chính, tự tăng                               |
| route_id             | INT            | FK → ROUTE(id)  | Tuyến xe báo cáo                                  |
| report_date          | DATE           | NOT NULL        | Ngày lập báo cáo                                  |
| total_ticket_revenue | DECIMAL(18,2)  | Nullable        | Tổng doanh thu vé — SUM từ DAILY_TICKET_STAT       |
| total_ad_revenue     | DECIMAL(18,2)  | Nullable        | Tổng doanh thu quảng cáo — phân bổ từ AD_CONTRACT |
| total_passengers     | INT            | Nullable        | Tổng hành khách — SUM từ DAILY_TICKET_STAT        |
| tax_deduction        | DECIMAL(18,2)  | Nullable        | Khoản khấu trừ thuế                               |
| net_profit           | DECIMAL(18,2)  | Nullable        | Lợi nhuận ròng sau thuế                          |
| created_at           | TIMESTAMPTZ    | DEFAULT NOW     | Audit field — thời điểm tạo bản ghi               |

### 2.7. DAILY_TICKET_STAT

Thống kê vé theo ngày cho từng tuyến. Các trường `total_passengers` và `revenue_single_tickets` là giá trị phái sinh do Service layer tính toán.

| Column               | Data Type      | Constraint      | Description                                       |
| :------------------- | :------------- | :-------------- | :------------------------------------------------ |
| id                   | SERIAL         | PRIMARY KEY     | Khóa chính, tự tăng                               |
| route_id             | INT            | FK → ROUTE(id)  | Tuyến xe thống kê                                 |
| report_date          | DATE           | NOT NULL        | Ngày thống kê                                     |
| single_ticket_count  | INT            | DEFAULT 0       | Tổng số vé lượt trong ngày                        |
| monthly_ticket_count | INT            | DEFAULT 0       | Tổng số vé tháng trong ngày                       |
| total_passengers     | INT            | Nullable [Derived] | = `single_ticket_count` + `monthly_ticket_count` |
| revenue_single_tickets | DECIMAL(18,2)  | Nullable [Derived] | = `single_ticket_count` × `ROUTE.price`          |

### 2.8. BUS_SHIFT

Ghi nhận từng ca chạy của một xe trong một nốt chạy. Liên kết với tài xế thực hiện, số vé thu được và doanh thu ca.

| Column              | Data Type     | Constraint        | Description                                      |
| :------------------ | :------------ | :---------------- | :----------------------------------------------- |
| id                  | SERIAL        | PRIMARY KEY       | Khóa chính, tự tăng                              |
| node_id             | INT           | FK → NODE(id)     | Nốt chạy chứa ca này                             |
| bus_id              | INT           | FK → BUS(id)      | Xe thực hiện ca chạy                             |
| driver_id           | INT           | FK → APP_USER(id) | Tài xế thực hiện ca (role = STAFF)               |
| shift_order         | INT           | Nullable          | Thứ tự ca trong ngày                             |
| direction           | SMALLINT      | CHECK IN (1, 2)   | Chiều chạy: 1 = A→B, 2 = B→A                      |
| planned_departuretime | TIME          | Nullable          | Giờ xuất bến dự kiến                             |
| planned_arrivaltime | TIME          | Nullable          | Giờ đến bến dự kiến                              |
| status              | VARCHAR(50)   | Nullable          | Trạng thái ca chạy (transaction - controlled)    |
| total_single_tickets | INT           | CHECK >= 0        | Tổng vé lượt thu trong ca                        |
| total_monthly_tickets | INT           | CHECK >= 0        | Tổng vé tháng thu trong ca                       |
| shift_revenue       | DECIMAL(15,2) | Nullable          | Doanh thu ca — audit: SUM(TICKET) × ROUTE.price |
| created_at          | TIMESTAMPTZ   | DEFAULT NOW       | Audit field — thời điểm tạo bản ghi              |

### 2.9. TICKET

Chi tiết từng loại vé được thu thập trong một ca chạy, phân biệt vé lượt và vé tháng.

| Column      | Data Type   | Constraint        | Description                     |
| :---------- | :---------- | :---------------- | :------------------------------ |
| id          | SERIAL      | PRIMARY KEY       | Khóa chính, tự tăng             |
| bus_shift_id | INT         | FK → BUS_SHIFT(id) | Ca chạy tương ứng               |
| type        | VARCHAR(50) | NOT NULL          | Loại vé: SINGLE hoặc MONTHLY    |
| quantity    | INT         | NOT NULL, CHECK > 0 | Số lượng vé                     |

### 2.10. AD_COMPANY

Danh sách công ty quảng cáo đối tác, lưu mã số thuế và thông tin liên hệ.

| Column   | Data Type    | Constraint             | Description                               |
| :------- | :----------- | :--------------------- | :---------------------------------------- |
| id       | SERIAL       | PRIMARY KEY            | Khóa chính, tự tăng                       |
| name     | VARCHAR(200) | Nullable               | Tên công ty quảng cáo                     |
| tax_code | VARCHAR(50)  | UNIQUE, NOT NULL       | Mã số thuế (định danh pháp lý)            |
| contact  | TEXT         | Nullable               | Thông tin liên hệ (email, điện thoại...) |

### 2.11. AD_CONTRACT

Hợp đồng quảng cáo giữa công ty quảng cáo và một tuyến xe. Quản lý trạng thái phê duyệt và tài liệu hợp đồng.

| Column            | Data Type     | Constraint                               | Description                               |
| :---------------- | :------------ | :--------------------------------------- | :---------------------------------------- |
| id                | SERIAL        | PRIMARY KEY                              | Khóa chính, tự tăng                       |
| company_id        | INT           | FK → AD_COMPANY(id)                      | Công ty ký hợp đồng                       |
| route_id          | INT           | FK → ROUTE(id)                           | Tuyến áp dụng quảng cáo                   |
| start_date        | DATE          | Nullable                                 | Ngày bắt đầu hiệu lực                    |
| end_date          | DATE          | CHECK > start_date                       | Ngày kết thúc hiệu lực                   |
| price_per_bus     | DECIMAL(15,2) | CHECK >= 0                               | Đơn giá mỗi xe (VNĐ)                      |
| bus_quantity      | INT           | CHECK > 0                                | Số lượng xe trong hợp đồng                |
| approval_status   | VARCHAR(20)   | CHECK IN (PENDING, APPROVED, PAID, REJECTED, DELETE_REQUESTED) | Trạng thái phê duyệt hợp đồng             |
| contract_file_url | TEXT          | Nullable                                 | Link tài liệu hợp đồng upload            |
| created_at        | TIMESTAMPTZ   | DEFAULT NOW                              | Audit field — thời điểm tạo bản ghi       |

### 2.12. AD_ASSIGNMENT

Ghi nhận việc phân bổ quảng cáo lên từng xe cụ thể theo hợp đồng, bao gồm vị trí dán và trạng thái hiện tại.

| Column        | Data Type   | Constraint        | Description                               |
| :------------ | :---------- | :---------------- | :---------------------------------------- |
| id            | SERIAL      | PRIMARY KEY       | Khóa chính, tự tăng                       |
| ad_contract_id | INT         | FK → AD_CONTRACT(id) | Hợp đồng áp dụng                         |
| bus_id        | INT         | FK → BUS(id)      | Xe được gán quảng cáo                     |
| position      | VARCHAR(100)| Nullable          | Vị trí dán quảng cáo trên xe              |
| status        | VARCHAR(20) | Nullable          | Trạng thái: ACTIVE hoặc REMOVED           |
| :------------ | :---------- | :---------------- | :---------------------------------------- |

### 2.13. OPERATIONAL_COST

Lưu trữ các chi phí vận hành hàng ngày của từng tuyến xe, phục vụ tính toán lợi nhuận ròng.

| Column      | Data Type    | Constraint                                     | Description                               |
| :---------- | :----------- | :--------------------------------------------- | :---------------------------------------- |
| id          | SERIAL       | PRIMARY KEY                                    | Khóa chính, tự tăng                       |
| route_id    | INT          | FK → ROUTE(id)                                 | Tuyến xe chịu chi phí                     |
| cost_date   | DATE         | NOT NULL                                       | Ngày phát sinh chi phí                    |
| type        | VARCHAR(50)  | CHECK IN (FUEL, MAINTENANCE, SALARY, OTHER)    | Loại chi phí                              |
| amount      | DECIMAL(18,2)| NOT NULL, CHECK >= 0                           | Số tiền (VNĐ)                             |
| description | TEXT         | Nullable                                       | Chi tiết nội dung chi phí                 |
| created_at  | TIMESTAMPTZ  | DEFAULT NOW                                    | Thời điểm tạo bản ghi                     |

### 2.14. REFRESH_TOKEN

Lưu trữ Token làm mới để duy trì phiên đăng nhập bảo mật cho người dùng.

| Column      | Data Type   | Constraint             | Description                     |
| :---------- | :---------- | :--------------------- | :------------------------------ |
| id          | SERIAL      | PRIMARY KEY            | Khóa chính, tự tăng             |
| user_id     | INT         | FK → APP_USER(id)      | Người sở hữu token              |
| token       | VARCHAR(255)| UNIQUE, NOT NULL       | Chuỗi token làm mới             |
| expiry_date | TIMESTAMPTZ | NOT NULL               | Thời điểm hết hạn token         |

## 3. Biểu đồ Trình tự (Sequence Diagram)

Luồng US - 03: Hoàn thành chuyến xe (Staff)

## 4. Phân quyền & Bảo mật

*   **Xác thực:** Sử dụng Spring Security + JWT.
*   **Phân quyền (RBAC):**
    *   Owner: Chỉ xem báo cáo tài chính.
    *   Staff: Chỉ cập nhật chuyến xe được phân công.
    *   Admin: Toàn quyền CRUD hạ tầng.
    *   Accountant/Advertising: Chỉ thao tác trên Module Quảng cáo.
+
+*   **Cơ chế Đăng xuất (Logout):**
+    *   Hệ thống cung cấp endpoint `POST /api/v1/auth/logout`.
+    *   Khi người dùng đăng xuất, Refresh Token tương ứng trong bảng `REFRESH_TOKEN` sẽ bị xóa hoàn toàn để ngăn chặn việc cấp mới Access Token trái phép.

© 2026 BFMS Project - Tài liệu Thiết kế Kỹ thuật – Version 1.2
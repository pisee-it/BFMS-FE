# Execution Report: PRJBFMS-46 (BFMS-037)
## Tối ưu hóa Database và Thắt chặt ràng buộc

### 1. Thông tin task
- **Jira ID:** PRJBFMS-46
- **Mô tả:** Thêm Index cho các bảng `DAILY_TICKET_STAT` và `BUS_SHIFT`; thắt chặt ràng buộc `NOT NULL` cho các bảng dựa trên cấu trúc Entity Java.
- **Ngày hoàn thành:** 2026-04-25

### 2. Các thay đổi chính

#### Database (V1__Initial_Setup.sql)
- **Thêm INDEX**:
    - `idx_daily_ticket_stat_route_date` trên `DAILY_TICKET_STAT(route_id, report_date)`.
    - `idx_bus_shift_node_status` trên `BUS_SHIFT(node_id, status)`.
- **Harden Constraints (NOT NULL)**: Thắt chặt ràng buộc cho `APP_USER`, `ROUTE`, `BUS`, `AD_CONTRACT`, `DAILY_TICKET_STAT`, `OPERATIONAL_COST`.

#### Ứng dụng & Môi trường
- **pom.xml**: Bổ sung `io.github.cdimascio:dotenv-java`.
- **BfmsBackendApplication.java**: Tự động nạp biến môi trường từ `.env` vào System Properties. Điều này cho phép chạy app trực tiếp bằng `mvnw spring-boot:run`.

### 3. Kết quả kiểm chứng
- **Migration**: Thành công (`version v1`).
- **Startup**: Ứng dụng khởi chạy bình thường bằng lệnh `.\mvnw.cmd spring-boot:run`.
- **Placeholder**: Các biến `${JWT_SECRET}`, `${DB_URL}`,... được nạp thành công từ `.env`.
- **Log**: `Started BfmsBackendApplication in 11.954 seconds`.

### 4. Tài liệu bổ sung (nếu có)
- Không có.


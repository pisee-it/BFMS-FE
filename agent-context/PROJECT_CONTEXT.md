# BFMS — Project Context
## (Tóm tắt từ SRS v1.2 · SDD v1.2 · API Spec · Source Code)

---

## 1. Tổng quan dự án

**Tên:** Bus Finance Management System (BFMS)  
**Mục tiêu:** Quản lý tài chính xe buýt — kiểm soát hai nguồn thu chính: **vé xe** (lượt + tháng) và **quảng cáo decal** trên thân xe.  
**Loại:** Full-stack Web Application (REST API backend + Angular frontend)  
**Trạng thái:** Giai đoạn 3 — Thực thi Logic (The Developer)

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17 · Spring Boot 4.0.5 |
| ORM | Spring Data JPA / Hibernate |
| Security | Spring Security + JWT (jjwt 0.11.5) |
| Database | PostgreSQL (Supabase) |
| Migration | Flyway |
| Build | Maven 3.9.x |
| Frontend (out of scope backend) | Angular (SPA) |

**Package gốc:** `com.bfms.bfms_backend`  
**Base URL API:** `/api/v1`  
**Auth:** Bearer JWT trong header `Authorization`

---

## 3. Actors & Phân quyền (RBAC)

| Role | Mô tả | Quyền chính |
|------|-------|-------------|
| `OWNER` | Chủ doanh nghiệp | Xem báo cáo tài chính tổng hợp, quản lý hợp đồng quảng cáo |
| `ACCOUNTANT` | Kế toán | Xác nhận thanh toán, duyệt hợp đồng quảng cáo |
| `ADVERTISING` | Người quản lý QC | Tạo hợp đồng, upload file scan |
| `STAFF` | Nhân viên phụ xe | Cập nhật số vé sau mỗi lượt chạy |
| `ADMIN` | Quản trị viên | CRUD toàn bộ hạ tầng (Route, Bus, Node, BusShift) + Phân bổ quảng cáo |

---

## 4. User Stories (chuẩn hóa từ SRS)

| ID | Actor | Module | Mô tả | Acceptance Criteria |
|----|-------|--------|-------|---------------------|
| US-01 | Owner | Báo cáo | Xem tổng doanh thu theo ngày/tháng/năm | Hiển thị doanh thu vé + QC, thuế khấu trừ, lợi nhuận ròng |
| US-02 | Owner | Vé | Thống kê số lượng vé lượt và vé tháng | Filter theo routeId, date; trả đúng single/monthly count |
| US-03 | Staff | Vận hành | Cập nhật số vé sau mỗi lượt xe hoàn thành | Status shift → COMPLETED; doanh thu cập nhật trong 1 Transaction |
| US-04 | Advertising | Quảng cáo | Tạo yêu cầu hợp đồng, upload file scan | Lưu info đối tác + bus_quantity + contract_file_url; status = PENDING |
| US-05 | Admin | Quảng cáo | Phân bổ quảng cáo lên xe sau khi HĐ có hiệu lực | Chỉ chọn xe chưa full vị trí; lưu AD_ASSIGNMENT |
| US-06 | Accountant | Quảng cáo | Xác nhận tiền về, duyệt hợp đồng | Status HĐ → APPROVED/PAID; gửi Notification cho Admin |
| US-07 | Admin | Hệ thống | CRUD tuyến xe (Route) | Lưu đủ thông tin + auto-calculate price theo distance |
| US-08 | Admin | Hệ thống | Quản lý nốt xe, thiết lập lượt xe (Node/BusShift) | Lưu node + shift; liên kết driver_id (role=STAFF) |
| US-09 | Owner/Admin | Vận hành | Xem danh sách chuyến đang chạy (realtime) | Filter theo routeId; trả list shift đang active |
| US-10 | Admin | Hệ thống | CRUD xe buýt | Validate licensePlate unique; status check; link routeId |
| US-11 | Owner | Báo cáo | Xuất báo cáo doanh thu theo tuyến | Export PDF/Excel; filter routeId + date range |

---

## 5. API Endpoints (đầy đủ từ API Spec)

### Auth
| Method | Endpoint | Role | US |
|--------|----------|------|----|
| POST | `/api/v1/auth/login` | Public | — |
| POST | `/api/v1/auth/logout` | Authenticated | PRJBFMS-94 |
| POST | `/api/v1/auth/refresh` | Public | — |

### Revenue
| Method | Endpoint | Role | US |
|--------|----------|------|----|
| GET | `/api/v1/revenue/total?timeframe={day\|month\|year}&date=...` | OWNER, ADMIN | US-01 |

### Tickets
| Method | Endpoint | Role | US |
|--------|----------|------|----|
| GET | `/api/v1/tickets/statistics?routeId={id}&date=...` | OWNER | US-02 |

### Shifts
| Method | Endpoint | Role | US |
|--------|----------|------|----|
| POST | `/api/v1/shifts/{shiftId}/complete` | STAFF | US-03 |
| GET | `/api/v1/shifts/active?routeId={id}` | OWNER, ADMIN | US-09 |

### Ads
| Method | Endpoint | Role | US |
|--------|----------|------|----|
| POST | `/api/v1/ads/contracts` | ADVERTISING, OWNER | US-04/06 |
| PATCH | `/api/v1/ads/contracts/{id}/approve` | ACCOUNTANT | US-06 |
| POST | `/api/v1/ads/assignments` | ADMIN, OWNER | US-05 |

### Routes
| Method | Endpoint | Role | US |
|--------|----------|------|----|
| GET | `/api/v1/routes` | ADMIN | US-07 |
| POST | `/api/v1/routes` | ADMIN | US-07 |
| PUT | `/api/v1/routes/{id}` | ADMIN | US-07 |
| DELETE | `/api/v1/routes/{id}` | ADMIN | US-07 |
| POST | `/api/v1/routes/{routeId}/nodes` | ADMIN | US-08 |

### Buses
| Method | Endpoint | Role | US |
|--------|----------|------|----|
| GET | `/api/v1/buses` | ADMIN | US-10 |
| POST | `/api/v1/buses` | ADMIN | US-10 |
| PUT | `/api/v1/buses/{id}` | ADMIN | US-10 |
| DELETE | `/api/v1/buses/{id}` | ADMIN | US-10 |

### Reports
| Method | Endpoint | Role | US |
|--------|----------|------|----|
| GET | `/api/v1/reports/export?routeId={id}&format={pdf\|excel}` | OWNER | US-11 |

### Files
| Method | Endpoint | Role | Mô tả |
|--------|----------|------|-------|
| POST | `/api/v1/files/upload` | ADVERTISING, ADMIN, OWNER | Upload file (Hợp đồng, v.v.) |
| GET | `/api/v1/files/{fileName}` | Authenticated | Download/Xem file |

### Notifications
| Method | Endpoint | Role | Mô tả |
|--------|----------|------|-------|
| GET | `/api/v1/notifications` | ADMIN | Lấy danh sách thông báo (polling) |
| PATCH | `/api/v1/notifications/{id}/read` | Authenticated | Đánh dấu thông báo đã đọc |

---

## 6. Database Schema (12 bảng — từ SDD v1.2)

### Mapping quy tắc
- DB dùng `snake_case` → Java entity dùng `camelCase`
- Tên bảng trong DB: `APP_USER`, `BUS`, `ROUTE`, `NODE`, `BUS_SHIFT`, `TICKET`, `ECONOMY_REPORT`, `DAILY_TICKET_STAT`, `AD_COMPANY`, `AD_CONTRACT`, `AD_ASSIGNMENT`, `NOTIFICATION`

### Bảng chính (tóm tắt constraint quan trọng)

**APP_USER:** `role CHECK IN ('OWNER','ACCOUNTANT','ADVERTISING','STAFF','ADMIN')`  
**ROUTE:** `distance_ab >= 0`, `distance_ba >= 0`, `price >= 0`  
**NODE:** `direction CHECK IN (1, 2)` — 1=A→B, 2=B→A; `total_passengers` là **derived field**  
**BUS:** `status CHECK IN ('ACTIVE','INACTIVE','MAINTENANCE')`; `license_plate UNIQUE`  
**BUS_SHIFT:** có `driver_id FK→APP_USER`; không có `execution_date` (lấy từ NODE join); `shift_revenue` audit = SUM(TICKET) × ROUTE.price  
**AD_CONTRACT:** `approval_status CHECK IN ('PENDING','APPROVED','PAID','REJECTED')`; `end_date > start_date`  
**AD_ASSIGNMENT:** `status IN ('ACTIVE','REMOVED')`  
**DAILY_TICKET_STAT:** `total_passengers` và `revenue_single_tickets` là **derived fields** — Service layer tính  

### Derived fields — chỉ Service layer được ghi
| Field | Công thức |
|-------|-----------|
| `NODE.total_passengers` | SUM(BUS_SHIFT.total_single_tickets + total_monthly_tickets) |
| `DAILY_TICKET_STAT.total_passengers` | single_ticket_count + monthly_ticket_count |
| `DAILY_TICKET_STAT.revenue_single_tickets` | single_ticket_count × ROUTE.price |
| `BUS_SHIFT.shift_revenue` | SUM(TICKET.quantity) × ROUTE.price |

---

## 7. Kiến trúc (C4 Level 3 — Component)

```
Request → [Security Filter / JWT]
        → [Controller Layer]       — validate DTO, route request
        → [Service Layer @Transactional] — core business logic
        → [Repository Layer / JPA] — DB access
        → PostgreSQL
```

**Cross-cutting:** `ShiftService` / `ContractService` gọi `NotificationService` để tạo notification (loose coupling).  
**Notification polling:** Angular poll `GET /api/v1/notifications` định kỳ để hiện icon chuông.

---

## 8. Auto-price logic (Route)

Khi tạo Route, `price` được tính tự động từ `(distanceAB + distanceBA) / 2`:

| Avg distance (km) | Price (VNĐ) |
|-------------------|-------------|
| < 15 | 8,000 |
| 15 – 24 | 10,000 |
| 25 – 29 | 12,000 |
| 30 – 39 | 15,000 |
| ≥ 40 | 20,000 |

---

## 9. Cấu trúc project hiện tại

```
src/main/java/
├── com/bfms/bfms_backend/
│   └── BfmsBackendApplication.java
├── config/
│   └── SecurityConfig.java
├── controller/
│   ├── AuthController.java
│   ├── BusController.java
│   └── RouteController.java
├── dtos/
│   ├── req/  (LoginRequest, RouteRequest, BusRequest)
│   └── res/  (AuthResponse, RouteResponse, BusResponse)
├── entity/
│   ├── AppUser.java
│   ├── Bus.java
│   ├── BusStatus.java (enum: ACTIVE, INACTIVE, MAINTENANCE, SOLD)
│   ├── Role.java      (enum: OWNER, ADMIN, STAFF, ACCOUNTANT, ADVERTISING)
│   └── Route.java
├── repository/
│   ├── AppUserRepository.java
│   ├── BusRepository.java
│   └── RouteRepository.java
├── security/
│   ├── AuthService.java
│   ├── JwtFilter.java
│   ├── JwtUtil.java
│   └── UserDetailsServiceImpl.java
└── service/
    ├── BusService.java (interface)
    ├── RouteService.java (interface)
    └── impl/
        ├── BusServiceImpl.java
        └── RouteServiceImpl.java

src/main/resources/
├── application.yaml
└── db/migration/
    └── V1__Initial_Setup.sql  (12 bảng — schema hiện tại)
```

---

[//]: # (## 10. Những entity còn thiếu &#40;chưa implement&#41;)

[//]: # ()
[//]: # (Các entity/service/controller sau **chưa có** trong codebase, cần implement theo đúng task:)

[//]: # ()
[//]: # (- `Node` entity + `NodeRepository` + `NodeService` + `NodeController`)

[//]: # (- `BusShift` entity + `BusShiftRepository` + `BusShiftService` + `BusShiftController`)

[//]: # (- `Ticket` entity + `TicketRepository`)

[//]: # (- `AdCompany` + `AdContract` + `AdAssignment` &#40;entity + service + controller&#41;)

[//]: # (- `EconomyReport` entity + `EconomyReportService`)

[//]: # (- `DailyTicketStat` entity + `DailyTicketStatService`)

[//]: # (- `Notification` entity + `NotificationService` + `NotificationController`)

[//]: # (- `AppUser` entity cần fix: `getPassword&#40;&#41;` và `getUsername&#40;&#41;` đang return empty string — BUG)

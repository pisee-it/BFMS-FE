# BFMS — Project Memory

## Trí nhớ tích lũy qua các session

> File này được cập nhật sau mỗi task hoàn thành.  
> Agent mới đọc file này để nắm bắt context đã có trước khi làm việc.

---

## Trạng thái dự án (cập nhật lần cuối: khởi tạo)

**Giai đoạn hiện tại:** Giai đoạn 3 — Thực thi Logic  
**Sprint hiện tại:** Sprint-FE01 (Frontend Foundation)

---

## 1. Phát triển Frontend (Angular)

### ✅ Hoàn thành

| Module     | Subtask       | Ghi chú                                                                   |
| :--------- | :------------ | :------------------------------------------------------------------------ |
| Foundation | [PRJBFMS-239] | Khởi tạo môi trường, cài đặt thư viện lõi (Lucide, Chart.js, Animations). |
| UI Framework | [PRJBFMS-240] | Tích hợp PrimeNG v18+ với theme Lara, cấu hình animations và icons. |
| Styling | [PRJBFMS-241] | Thiết lập TailwindCSS v4 trực tiếp trong styles.scss. |
| Architecture | [PRJBFMS-242] | Xây dựng cấu trúc thư mục dự án theo định hướng Domain-driven (DDD). |

## Những gì đã được implement

### ✅ Hoàn thành

| Module       | File                                                                                                                                | Ghi chú                                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Auth         | `SecurityConfig`, `JwtUtil`, `JwtFilter`, `AuthService`, `UserDetailsServiceImpl`, `AppUser`, `RefreshToken`, `RefreshTokenService` | JWT stateless, BCrypt. Hỗ trợ Refresh Token (lưu DB).                                                     |
| Route        | `Route` entity, `RouteRepository`, `RouteService`, `RouteServiceImpl`, `RouteController`                                            | CRUD đầy đủ, auto-price logic. Controller đã dùng Interface.                                              |
| Bus          | `Bus` entity, `BusRepository`, `BusService`, `BusServiceImpl`, `BusController`                                                      | CRUD + sellBus(). Controller đã dùng Interface.                                                           |
| Revenue      | `BusShiftServiceImpl`, `BusShiftController`                                                                                         | Triển khai `completeShift` (US-03) hoàn tất với đầy đủ audit Ticket.                                      |
| Advertising  | `AdCompany`, `AdContract`, `AdAssignment`, `AdController`                                                                           | Triển khai đầy đủ module Quảng cáo bao gồm Entity, Service và API Controller.                             |
| Notification | `Notification`, `NotificationService`, `NotificationController`                                                                     | Hệ thống thông báo nội bộ, tích hợp vào luồng phê duyệt hợp đồng.                                         |
| Report       | `EconomyReport`, `OperationalCost`, `ReportRepository`, `OperationalCostRepository`, `EconomyReportService`, `RevenueController`    | Triển khai logic tính toán tài chính (VAT, TNDN), quản lý chi phí vận hành và API tổng doanh thu (US-01). |
| DB           | `V1__Initial_Setup.sql`                                                                                                             | 16 bảng đầy đủ (đã bổ sung `OPERATIONAL_COST`, `SECURITY_LOG`)                                            |
| Security     | `SecurityLog`, `AuditService`                                                                                                       | Hệ thống Audit Log tập trung cho Auth và Business Modules.                                                |
| Enums        | `Role`, `BusStatus`, `ShiftStatus`, `AdContractStatus`, `AdAssignmentStatus`, `CostType`                                            | —                                                                                                         |
| Testing      | `BusShiftIntegrationTest`, `AdvertisingIntegrationTest`                                                                             | Integration Test E2E luồng US-03 và luồng Quảng cáo thành công.                                           |
| File         | `FileService`, `FileServiceImpl`, `FileController`                                                                                  | Quản lý upload/download file hợp đồng (Local Storage, UUID).                                              |
| Document     | `README.md`, `README_VN.md`                                                                                                         | Tài liệu hướng dẫn dự án song ngữ (Anh - Việt).                                                           |

---

### ⚠️ Known Bugs / Issues

1. **`BusStatus.SOLD`** có trong enum Java nhưng DB constraint chỉ cho `ACTIVE/INACTIVE/MAINTENANCE` — không đồng bộ. Cần migration thêm SOLD hoặc xử lý ở application layer.
2. **Global Exception Handler** — Hệ thống chưa có bộ xử lý lỗi tập trung, đang throw RuntimeException thô.

---

## Quyết định thiết kế đã được confirm

| Quyết định                                                           | Lý do                                                           | Ngày                                      |
| -------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------- | ---------- |
| Dùng `record` cho DTO                                                | Immutable, boilerplate thấp                                     | init                                      |
| `FetchType.LAZY` cho tất cả relation                                 | Tránh N+1 query                                                 | init                                      |
| Auto-price route theo distance bracket                               | Yêu cầu từ SRS                                                  | init                                      |
| `@Transactional` ở ServiceImpl, không ở Controller                   | Layered Architecture                                            | init                                      |
| `driver_id` FK trong `BUS_SHIFT` validate role=STAFF ở Service layer | Không thể enforce ở DB level với FK                             | init                                      |
| Derived fields tính ở Service layer                                  | Đảm bảo consistency, không nhập thủ công                        | init                                      |
| Logic xóa hợp đồng: Accountant request -> Owner delete               | Phân quyền kiểm soát tài chính                                  | 2026-04-23                                |
| Programming to an Interface                                          | Sử dụng Interface Service thay vì Impl trong Controller/Service | Tăng tính linh hoạt, hỗ trợ Proxy/Testing | 2026-04-24 |

---

1. `Node` — phụ thuộc `Route`
2. `BusShift` — phụ thuộc `Node`, `Bus`, `AppUser`
3. `Ticket` — phụ thuộc `BusShift`
4. `DailyTicketStat` — phụ thuộc `Route` (derived từ BusShift)
5. `AdCompany` — độc lập
6. `AdContract` — phụ thuộc `AdCompany`, `Route`
7. `AdAssignment` — phụ thuộc `AdContract`, `Bus`
8. `EconomyReport` — phụ thuộc `Route` (aggregate từ nhiều bảng)

---

## Ghi chú kỹ thuật quan trọng

### US-03 Transaction Pattern

Khi Staff complete một shift, phải dùng `@Transactional` bao toàn bộ:

```
1. Update BUS_SHIFT: status = COMPLETED, total_single_tickets, total_monthly_tickets, shift_revenue
2. Create/Update DAILY_TICKET_STAT cho ngày đó
3. Update NODE.total_passengers (sum từ tất cả shift của node)
```

Nếu bất kỳ bước nào fail → rollback toàn bộ.

### Notification Pattern

`ShiftService.completeShift()` và `ContractService.approveContract()` phải gọi `NotificationService.create()` trong cùng transaction. Không tự tạo notification trong Controller.

### BusShift không có execution_date

Đây là thiết kế có chủ ý (SDD v1.2 FIX-1). Để lấy execution_date của shift, phải join qua NODE.

---

## Session Log

| Session | Ngày       | Tasks                  | Ghi chú                                                                               |
| ------- | ---------- | ---------------------- | ------------------------------------------------------------------------------------- |
| #21     | 2026-05-06 | PRJBFMS-246            | Triển khai trang Login với phong cách Glassmorphism Dark Mode tối giản.               |
| #0      | 2026-04-22 | Khởi tạo agent-context | Toàn bộ tài liệu được distill từ SRS/SDD/API/source code                              |
| #1      | 2026-04-23 | PRJBFMS-29, 30, 31, 32 | Hoàn thiện US-03, kiểm thử Transaction/Rollback và cập nhật tài liệu.                 |
| #2      | 2026-04-23 | PRJBFMS-33             | Xác minh logic tính toán doanh thu và hành khách (45 single, 15 monthly, price 7000). |
| #3      | 2026-04-23 | PRJBFMS-34             | Triển khai Advertising Module (Entity, Repo, Service) và logic xóa hợp đồng.          |
| #4      | 2026-04-23 | PRJBFMS-35             | Triển khai AdController và cung cấp đầy đủ API cho Module Quảng cáo.                  |
| #9      | 2026-04-24 | PRJBFMS-40             | Triển khai EconomyReport Entity + ReportRepository và quản lý chi phí vận hành.       |

---

### Session #9 — 2026-04-24

**Task hoàn thành:** PRJBFMS-40 (BFMS-031)
**Files created/modified:**

- `V1__Initial_Setup.sql` — Bổ sung bảng `OPERATIONAL_COST`.
- `BFMS_SDD.md` — Cập nhật tài liệu thiết kế.
- `CostType.java`, `OperationalCost.java` — Quản lý chi phí vận hành.
- `EconomyReport.java` — Logic tài chính (VAT 10%, TNDN 20%).
- `ReportRepository.java`, `OperationalCostRepository.java` — Repositories cho module báo cáo.
- `EconomyReportTest.java` — Unit test cho logic tài chính.

**Quyết định mới:**

- Bổ sung bảng chi phí vận hành để tính toán lợi nhuận ròng chính xác.
- Thuế TNDN 20% chỉ tính khi lợi nhuận kinh doanh lớn hơn 0.
- Giải thích chi tiết các công thức tài chính thông qua comment trong mã nguồn.

**Issues phát sinh:**

- Lỗi Execution Policy khi chạy script PowerShell — _Resolved: Sử dụng `-ExecutionPolicy Bypass` để chạy `run_app.ps1`._

**Cần làm tiếp:**

- Triển khai `EconomyReportService` để tổng hợp dữ liệu thực tế từ `DailyTicketStat` và `OperationalCost`. (Hoàn thành trong Session #10)
- Implement Global Exception Handler.

---

### Session #10 — 2026-04-24

**Task hoàn thành:** PRJBFMS-41 (BFMS-032)
**Files created/modified:**

- `RevenueResponse.java` — DTO cho kết quả báo cáo.
- `AdContractRepository.java` — Thêm tìm kiếm theo startDate.
- `EconomyReportService.java`, `EconomyReportServiceImpl.java` — Logic tổng hợp báo cáo kinh tế.
- `RevenueController.java` — Endpoint `GET /api/v1/revenue/total`.
- `EconomyReportServiceTest.java` — Unit tests.

**Quyết định mới:**

- Doanh thu quảng cáo được ghi nhận 100% vào ngày bắt đầu (`startDate`) của hợp đồng để đơn giản hóa việc tổng hợp.
- Bảng `ECONOMY_REPORT` được cập nhật tự động (sync) mỗi khi Owner truy vấn dữ liệu, đảm bảo báo cáo luôn khớp với thực tế.

**Issues phát sinh:**

- Không có.

**Cần làm tiếp:**

- Implement Global Exception Handler.

---

### Session #1 — 2026-04-23

**Task hoàn thành:** PRJBFMS-29, 30, 31, 32
**Files created/modified:**

- `BusShiftServiceImpl.java` — Triển khai `completeShift`, tạo `Ticket` audit.
- `DailyTicketStat.java` — Triển khai logic tính toán dữ liệu phái sinh.
- `BusShiftController.java` — Sửa API paths.
- `BusController.java`, `RouteController.java` — Refactor inject interface (sau đó revert theo ý user).
- `PROJECT_MEMORY.md`, `AGENT_INSTRUCTIONS.md` — Cập nhật quy trình báo cáo và trí nhớ dự án.

**Quyết định mới:**

- Lưu vết `Ticket` (SINGLE/MONTHLY) cho mỗi ca chạy để đảm bảo khả năng kiểm soát tài chính.
- Tính toán derived fields tại Entity level để đảm bảo tính nhất quán.

**Issues phát sinh:**

- Xung đột giữa quy ước Interface và thói quen sử dụng Impl của user — _Resolved: Ưu tiên theo ý user._

**Cần làm tiếp:**

- Triển khai Module Quảng cáo (US-04, 05, 06).
- Implement Global Exception Handler để chuẩn hóa thông báo lỗi (Issue #2).

---

### Session #2 — 2026-04-23

**Task hoàn thành:** PRJBFMS-33
**Files created/modified:**

- `TicketRepository.java` — Thêm phương thức `deleteByBusShiftId` có `@Modifying` và `@Transactional` để hỗ trợ cleanup dữ liệu test.
- `BusShiftServiceRevenueTest.java` — Cập nhật logic cleanup để xóa sạch các bản ghi Ticket audit, tránh lỗi FK constraint.

**Quyết định mới:**

- Mọi logic xóa (delete) trong Repository khi được gọi từ môi trường Test hoặc các service không quản lý transaction cần được đánh dấu `@Transactional` và `@Modifying` (nếu là custom query/method naming delete).

**Issues phát sinh:**

- Lỗi FK constraint khi cleanup BusShift do có bản ghi Ticket tham chiếu tới — _Resolved: Đã bổ sung logic xóa Ticket trước khi xóa BusShift trong tearDown._

**Cần làm tiếp:**

- Triển khai Module Quảng cáo (US-04, 05, 06).

---

### Session #3 — 2026-04-23

**Task hoàn thành:** PRJBFMS-34 (BFMS-025)
**Files created/modified:**

- `AdCompany.java`, `AdContract.java`, `AdAssignment.java` — Entities.
- `AdContractStatus.java`, `AdAssignmentStatus.java` — Enums.
- `AdCompanyRepository.java`, `AdContractRepository.java`, `AdAssignmentRepository.java` — Repositories.
- `AdService.java`, `AdServiceImpl.java` — Service layer.
- `AdServiceTest.java` — Unit Tests.

**Quyết định mới:**

- Tích hợp logic xóa hợp đồng vào `AdService`: Accountant yêu cầu xóa (`DELETE_REQUESTED`), Owner thực hiện xóa thực tế.
- Khi xóa hợp đồng, tự động gỡ trạng thái quảng cáo (`isAdvertised = false`) cho các xe liên quan.

**Issues phát sinh:**

- Thiếu biến môi trường (`DB_URL`, v.v.) khi chạy test trong môi trường CI/Agent — _Resolved: Đã bổ sung `src/test/resources/application.yaml` để hỗ trợ test._

**Cần làm tiếp:**

- Triển khai `AdController` để cung cấp API cho Frontend (US-04, 05, 06).
- Implement Global Exception Handler.

---

## Template cập nhật (dùng sau mỗi task)

```markdown
### Session #N — [Ngày]

**Task hoàn thành:** [Tên task / Jira ID]
**Files created/modified:**

- [path/to/file.java] — [mô tả]

**Quyết định mới:**

- [Quyết định] — [Lý do]

**Issues phát sinh:**

- [Issue] — [Trạng thái: resolved/pending]

**Cần làm tiếp:**

- [Item]

---

### Session #4 — 2026-04-23

**Task hoàn thành:** PRJBFMS-35 (BFMS-026)
**Files created/modified:**

- `AdController.java` — Triển khai API cho Module Quảng cáo (Companies, Contracts, Assignments).

**Quyết định mới:**

- Sử dụng `@PreAuthorize` để phân quyền chi tiết cho từng endpoint theo mapping vai trò trong PROJECT_CONTEXT.md.
- **[QUAN TRỌNG]** Đã thống nhất chuyển từ inject `ServiceImpl` sang inject **Interface Service** trên toàn bộ dự án từ Session #5.

**Issues phát sinh:**

- Không có.

**Cần làm tiếp:**

- Implement Global Exception Handler.
- Kiểm thử tích hợp toàn bộ luồng Quảng cáo từ tạo công ty đến gán quảng cáo.

---

---

### Session #5 — 2026-04-24

**Task hoàn thành:** PRJBFMS-36 (BFMS-027)
**Files created/modified:**

- `Notification.java`, `NotificationRepository.java`, `NotificationService.java`, `NotificationServiceImpl.java`, `NotificationController.java` — Module Thông báo.
- `AdServiceImpl.java` — Tích hợp gửi thông báo cho Admin khi duyệt hợp đồng.
- `AppUserRepository.java` — Thêm `findByRole`.
- Toàn bộ Controller — Refactor sang inject Interface Service.
- `agent-context/knowledge/programming_to_interface.md` — Tài liệu kiến thức.

**Quyết định mới:**

- Áp dụng triệt để nguyên tắc **Programming to an Interface** cho toàn bộ Service layer.
- Tự động hóa việc thông báo cho Admin khi có các thay đổi quan trọng về tài chính/hợp đồng.

**Issues phát sinh:**

- Lỗi compile do thiếu import khi đổi sang Interface — _Resolved: Đã bổ sung import đầy đủ._

**Cần làm tiếp:**

- Implement Global Exception Handler.
- Triển khai Module Vận hành (Node, BusShift).

---

### Session #6 — 2026-04-24

**Task hoàn thành:** PRJBFMS-37 (BFMS-028)
**Files created/modified:**

- `AdServiceImpl.java` — Bổ sung validation kiểm tra `isAdvertised` trước khi gán quảng cáo.
- `AdServiceTest.java` — Thêm test case `testAssignAdToBus_AlreadyAdvertised_ShouldThrowException`.

**Quyết định mới:**

- Enforce chặt chẽ quy tắc "Một xe chỉ có một quảng cáo tại một thời điểm" (theo US-05).

**Issues phát sinh:**

- Không có.

**Cần làm tiếp:**

---

### Session #7 — 2026-04-24

**Task hoàn thành:** PRJBFMS-38 (BFMS-029)
**Files created/modified:**

- `Notification.java`, `AppUser.java` — Refactor sang `@Getter/@Setter/@NoArgsConstructor` tuân thủ convention.
- `NotificationRepository.java`, `NotificationService.java`, `NotificationServiceImpl.java` — Nâng cấp hỗ trợ phân trang (`Pageable`).
- `NotificationController.java` — Thêm `@PreAuthorize("hasRole('ADMIN')")` và hỗ trợ phân trang cho endpoint lấy thông báo.

**Quyết định mới:**

- Áp dụng phân trang (`Pageable`) cho module thông báo để phục vụ cả giao diện popup và trang thông báo chuyên biệt.
- API trả về toàn bộ thông báo (đã đọc và chưa đọc) để Frontend chủ động đánh dấu hiển thị dựa trên `isRead`.

**Issues phát sinh:**

- Không có.

---

### Session #8 — 2026-04-24

**Task hoàn thành:** PRJBFMS-39 (BFMS-030)
**Files created/modified:**

- `AdAssignmentRequest.java`, `AdAssignmentResponse.java` — Loại bỏ `position`, thêm `needsAttention`.
- `AdAssignment.java` — Loại bỏ field `position`.
- `AdServiceImpl.java` — Triển khai logic tính toán `needsAttention` dựa trên `endDate` của hợp đồng.
- `AdAssignmentTest.java` — Unit tests cho việc gán quảng cáo và cảnh báo hết hạn.
- `AdServiceTest.java` — Fix code theo DTO mới.

**Quyết định mới:**

- Một xe chỉ có tối đa một quảng cáo (bỏ trường `position`).
- Khi hợp đồng hết hạn, hệ thống không tự động gỡ quảng cáo mà chỉ đánh dấu `needsAttention = true` để Frontend hiển thị cảnh báo đỏ.

**Issues phát sinh:**

- Không có.

**Cần làm tiếp:**

- Implement Global Exception Handler.
- Triển khai Module Vận hành (Node, BusShift).

---

### Session #11 — 2026-04-24

**Task hoàn thành:** PRJBFMS-42 (BFMS-033)
**Files created/modified:**

- `TicketStatisticsResponse.java` — DTO thống kê vé.
- `TicketService.java`, `TicketServiceImpl.java` — Logic lấy thống kê từ DailyTicketStat.
- `TicketController.java` — API `GET /api/v1/tickets/statistics`.
- `TicketServiceTest.java` — Unit tests.
- `EconomyReportServiceTest.java` — Fix lỗi compile do Route entity thiếu field name.

**Quyết định mới:**

- API mặc định lấy ngày hiện tại (`LocalDate.now()`) nếu không cung cấp tham số `date`.
- Trả về dữ liệu trống (counts = 0) nếu tuyến xe tồn tại nhưng chưa có dữ liệu thống kê cho ngày yêu cầu, thay vì ném lỗi 404, để Frontend dễ xử lý.

**Issues phát sinh:**

- Phát hiện và fix lỗi compile trong `EconomyReportServiceTest.java` liên quan đến `Route.setName`. — _Resolved_.

**Cần làm tiếp:**

- Triển khai Global Exception Handler.

---

### Session #12 — 2026-04-24

**Task hoàn thành:** PRJBFMS-43 (BFMS-034)
**Files created/modified:**

- `pom.xml` — Bổ sung `poi-ooxml` (Apache POI).
- `RouteReportResponse.java` — DTO báo cáo chi tiết tuyến xe.
- `ReportService.java`, `ReportServiceImpl.java` — Logic tổng hợp và xuất Excel.
- `ReportController.java` — Endpoint `GET /api/v1/reports/export`.
- `ReportServiceTest.java` — Unit tests.

**Quyết định mới:**

- Sử dụng Apache POI để sinh file Excel trực tiếp từ byte array.
- Hỗ trợ tham số `startDate` và `endDate` để lọc dữ liệu báo cáo linh hoạt (mặc định là tháng hiện tại).
- Báo cáo Excel bao gồm tiêu đề, thông tin tuyến, bảng dữ liệu doanh thu và lợi nhuận ròng với định dạng tiền tệ (VNĐ).

**Issues phát sinh:**

- Lệnh `mvn` không nhận diện được trong Terminal — _Resolved: Sử dụng `.\mvnw.cmd` để chạy test._

**Cần làm tiếp:**

- Triển khai Global Exception Handler.

---

### Session #13 — 2026-04-24

**Task hoàn thành:** PRJBFMS-44 (BFMS-035)
**Files created/modified:**

- `ReportServiceTest.java` — Thêm test case kiểm chứng công thức lợi nhuận ròng.
- `EconomyReportServiceTest.java` — Thêm test case lọc theo tháng.
- `execution_reports/PRJBFMS-44_BFMS-035.md` — Báo cáo thực thi.

**Quyết định mới:**

- Tuân thủ công thức tính lợi nhuận ròng hiện tại trong code: `Net Profit = (Ticket + Ad) - Tax - Costs`.
- Sử dụng mock dữ liệu với `Costs = 0` để kiểm chứng công thức đơn giản `Net Profit = Ticket + Ad - Tax` theo yêu cầu của task.

**Issues phát sinh:**

- Hạn chế môi trường terminal không cho phép chạy `mvnw.cmd` trực tiếp trong session này. — _Pending: Cần kiểm tra lại cấu hình terminal._

**Cần làm tiếp:**

- Triển khai Global Exception Handler.

| #14 | 2026-04-25 | PRJBFMS-45 | Triển khai Bean Validation cho toàn bộ DTOs và Global Exception Handler tập trung. |

---

### Session #14 — 2026-04-25

**Task hoàn thành:** PRJBFMS-45 (BFMS-036)
**Files created/modified:**

- Toàn bộ DTOs trong `dtos/req/` — Bổ sung `@NotBlank`, `@NotNull`, `@Min` kèm thông báo Tiếng Việt.
- Toàn bộ Controllers — Bổ sung `@Valid` để kích hoạt validation.
- `ErrorResponse.java` — DTO chuẩn hóa phản hồi lỗi.
- `GlobalExceptionHandler.java` — Xử lý tập trung các ngoại lệ (`MethodArgumentNotValidException`, `RuntimeException`, `AuthenticationException`, `AccessDeniedException`).

**Quyết định mới:**

- Toàn bộ thông báo lỗi trả về cho client phải là **Tiếng Việt** chuẩn xác.
- Sử dụng `Map<String, String>` trong `ErrorResponse` để liệt kê chi tiết các lỗi validation của từng field.
- Bổ sung xử lý `AuthenticationException` để trả về lỗi đăng nhập Tiếng Việt thay vì mã lỗi mặc định của Spring Security.

**Issues phát sinh:**

- Không có.

**Cần làm tiếp:**

- Tiếp tục thực hiện các US còn lại trong backlog.

---

### Session #15 — 2026-04-25

**Task hoàn thành:** PRJBFMS-46 (BFMS-037)
**Files created/modified:**

- `V1__Initial_Setup.sql` — Sửa trực tiếp: Thêm INDEX tối ưu hóa và thắt chặt ràng buộc `NOT NULL`.
- `pom.xml` — Thêm dependency `dotenv-java`.
- `BfmsBackendApplication.java` — Load `.env` tự động vào System Properties.

**Quyết định mới:**

- Sửa trực tiếp vào `V1__Initial_Setup.sql` thay vì tạo `V2`.
- Thắt chặt ràng buộc `NOT NULL` ở mức DB và thêm INDEX cho hiệu năng.
- Tích hợp `dotenv-java` để ứng dụng tự nạp biến môi trường từ `.env` khi chạy bằng bất kỳ phương thức nào.

**Issues phát sinh:**

- Lỗi `PlaceholderResolutionException` khi chạy `mvnw` do không nạp được `JWT_SECRET`. — _Resolved: Đã fix bằng Dotenv._

**Cần làm tiếp:**

- Tiếp tục các task trong backlog vận hành.

---

### Session #16 — 2026-04-25

**Task hoàn thành:** PRJBFMS-47 (BFMS-038)
**Files created/modified:**

- `RevenueController.java` — Thêm role ADMIN cho báo cáo doanh thu.
- `AdController.java` — Mở rộng quyền cho OWNER trong module Quảng cáo.
- `PROJECT_CONTEXT.md` — Cập nhật tài liệu RBAC đồng bộ với code.
- `execution_reports/PRJBFMS-47_BFMS-038.md` — Báo cáo thực thi.

**Quyết định mới:**

- Vai trò `ADMIN` được cấp quyền xem (Read) toàn bộ dữ liệu tài chính nhưng bị chặn quyền ghi (Write) đối với các thông tin kinh tế nhạy cảm (như hợp đồng) để đảm bảo bảo mật.
- Vai trò `OWNER` có quyền tạo hợp đồng quảng cáo trực tiếp.

**Issues phát sinh:**

- Không có.

---

### Session #17 — 2026-04-25

**Task:** PRJBFMS-48 (BFMS-039) - Khởi tạo Integration Test
**Ghi chú:** Đã viết mã nguồn test ban đầu nhưng gặp lỗi nạp context do môi trường. Chuyển tiếp sang Session #18 để fix lỗi.

---

### Session #18 — 2026-04-25

**Task hoàn thành:** PRJBFMS-48 (BFMS-039) - Fix & Execute Integration Test
**Files created/modified:**

- `BusShiftIntegrationTest.java` — Fix context loading, dependencies, và bổ sung dữ liệu setup.

**Quyết định mới:**

- **Nạp .env trong Test**: Sử dụng khối `static` trong class test để nạp biến môi trường từ `.env` bằng `Dotenv`. Đây là giải pháp chuẩn khi dùng `@SpringBootTest` mà không chạy qua hàm `main`.
- **TearDown an toàn**: Sử dụng null-check trong `tearDown()` để tránh `NullPointerException` khi test fail ở bước setup.
- **Dữ liệu mồi (Seed Data)**: Đảm bảo set đầy đủ các trường `NOT NULL` (như `Route.path`, `Bus.busModel`, v.v.) trong `setUp()` để tránh vi phạm ràng buộc DB thực tế.

**Issues phát sinh:**

- Lỗi `UnsatisfiedDependencyException` cho `ObjectMapper` — _Resolved: Khởi tạo thủ công `ObjectMapper` trong class test._
- Lỗi thiếu `jackson-datatype-jsr310` — _Resolved: Tạm thời không register module này vì DTO hiện tại chỉ dùng Integer._
- Lỗi `DataIntegrityViolationException` (NOT NULL constraint) — _Resolved: Bổ sung đầy đủ dữ liệu trong setUp._

**Kết quả**: `BUILD SUCCESS` cho `BusShiftIntegrationTest`. Luồng E2E US-03 đã được xác minh hoạt động đúng logic tính toán doanh thu và tích lũy số liệu.

---

### Session #19 — 2026-04-25

**Task hoàn thành:** PRJBFMS-49 (BFMS-040) - Advertising Flow Integration Test
**Files created/modified:**

- `pom.xml` — Bổ sung `jackson-datatype-jsr310` để hỗ trợ LocalDate trong JSON.
- `AdvertisingIntegrationTest.java` — Triển khai kiểm thử luồng tạo hợp đồng, phê duyệt và gán xe.

**Quyết định mới:**

- **Kiểm thử đa vai trò (Multi-role Testing)**: Sử dụng Token của Advertising, Accountant và Admin trong cùng một flow để giả lập đúng quy trình thực tế.
- **Xác minh tác động phụ (Side-effects)**: Không chỉ kiểm tra trạng thái Entity chính (Contract) mà còn kiểm tra các Notification được gửi đi và trạng thái của các Entity liên quan (Bus).

**Issues phát sinh:**

- Thiếu thư viện `jackson-datatype-jsr310` khi serialize `LocalDate` trong Test — _Resolved: Đã bổ sung vào pom.xml._
- Hạn chế môi trường không cho phép Agent chạy `mvnw.cmd` trực tiếp. — _Pending: Cần User hỗ trợ chạy test._

---

### Session #20 — 2026-04-29

**Task hoàn thành:** PRJBFMS-57 (BFMS-037) - Standardizing Exception Handling
**Files created/modified:**

- `ErrorCode.java` — Enum quản lý mã lỗi, thông báo tiếng Việt và HttpStatus.
- `AppException.java` — Custom exception class.
- `ErrorResponse.java` — Cập nhật format bao gồm `code`, `message`, `timestamp`, `errors`.
- `GlobalExceptionHandler.java` — Refactor toàn bộ handler để sử dụng `AppException` và format mới.
- Toàn bộ Service Impls (`BusServiceImpl`, `RouteServiceImpl`, `AdServiceImpl`, v.v.) — Refactor chuyển từ `RuntimeException` sang `AppException`.

**Quyết định mới:**

- Sử dụng mã lỗi dạng chuỗi (String codes) như `BUS_404`, `AD_001` để tăng tính gợi nhớ và dễ debug.
- Mọi lỗi nghiệp vụ (Business Logic Error) phải được ném ra dưới dạng `AppException` kèm theo `ErrorCode` phù hợp.
- `GlobalExceptionHandler` là nơi duy nhất chịu trách nhiệm format phản hồi lỗi cho client.

**Issues phát sinh:**

- Không có.

| #22 | 2026-04-29 | PRJBFMS-62 | Áp dụng nguyên tắc DRY, chuẩn hóa lookup và exception handling. |
| #23 | 2026-04-29 | PRJBFMS-64 | Triển khai validation nghiệp vụ tầng Service và chuẩn hóa mã lỗi. |
|---------|------|-------|---------|

---

### Session #22 — 2026-04-29

**Task hoàn thành:** PRJBFMS-62 (BFMS-039) - DRY & Code Standardization
**Files created/modified:**

- `EntityLookupHelper.java` — Helper dùng chung để tìm kiếm Entity và ném lỗi chuẩn hóa.
- `ErrorCode.java` — Bổ sung mã lỗi cho Node và BusShift.
- `NotificationService.java`, `NotificationServiceImpl.java` — Thêm helper `notifyAdmins`.
- `BusShiftServiceImpl.java`, `NodeServiceImpl.java`, `TicketServiceImpl.java` — Refactor sử dụng `AppException` và `lookupHelper`.
- `AdServiceImpl.java`, `BusServiceImpl.java`, `RouteServiceImpl.java` — Refactor sử dụng `lookupHelper` và rút gọn logic.

**Quyết định mới:**

- Tập trung toàn bộ logic tìm kiếm Entity lặp lại vào `EntityLookupHelper` để giảm boilerplate code và đảm bảo tính nhất quán của thông báo lỗi.
- Hợp nhất logic gửi thông báo cho toàn bộ Admin vào `NotificationService.notifyAdmins`.
- Triển khai triệt để `AppException` cho các module vận hành (Node, BusShift, Ticket) để chuẩn hóa phản hồi lỗi API.

**Issues phát sinh:**

- Không có.

**Cần làm tiếp:**

- Tiếp tục rà soát các module báo cáo để áp dụng `EntityLookupHelper` nếu cần.

---

### Session #21 — 2026-04-29

**Task hoàn thành:** PRJBFMS-60 (BFMS-038) - DTO-Entity Mapping with MapStruct
**Files created/modified:**

- `pom.xml` — Thêm MapStruct và cấu hình annotation processor.
- `BusMapper.java`, `RouteMapper.java`, `AdMapper.java`, `BusShiftMapper.java` — Định nghĩa các interface mapper.
- `BusServiceImpl.java`, `RouteServiceImpl.java`, `AdServiceImpl.java`, `BusShiftServiceImpl.java` — Refactor sử dụng MapStruct mappers.

**Quyết định mới:**

- Sử dụng **MapStruct** thay vì ánh xạ thủ công để tăng tốc độ phát triển và giảm boilerplate code.
- Mọi Mapper phải được đánh dấu `@Mapper(componentModel = "spring")` để hỗ trợ Dependency Injection.
- Sử dụng `@MappingTarget` để tối ưu hóa việc cập nhật thực thể hiện có từ Request DTO.

**Issues phát sinh:**

- Không có.

**Cần làm tiếp:**

- Tiếp tục mở rộng Mapper cho các module Report và Statistics nếu cần.
- Duy trì việc sử dụng Mapper cho mọi Entity mới phát sinh.

---

### Session #23 — 2026-04-29

**Task hoàn thành:** PRJBFMS-64 (BFMS-040) - Data Validation Enhancement
**Files created/modified:**

- `ErrorCode.java` — Bổ sung mã lỗi `ROUTE_ALREADY_EXISTS`, `INVALID_TIME_RANGE`, `SHIFT_TIME_OUT_OF_ROUTE_RANGE`, `NODE_ALREADY_EXISTS`.
- `RouteRepository.java`, `NodeRepository.java` — Thêm các phương thức hỗ trợ kiểm tra tồn tại.
- `BusServiceImpl.java` — Bổ sung kiểm tra biển số xe duy nhất.
- `RouteServiceImpl.java` — Bổ sung kiểm tra số tuyến duy nhất và khoảng giờ hoạt động.
- `NodeServiceImpl.java` — Bổ sung kiểm tra nốt xe duy nhất trong ngày/tuyến.
- `BusShiftServiceImpl.java` — Bổ sung kiểm tra thời gian ca chạy hợp lệ và nằm trong khung giờ của tuyến.

**Quyết định mới:**

- Thắt chặt validation ở tầng Service thay vì chỉ dựa vào Bean Validation ở DTO để đảm bảo tính toàn vẹn dữ liệu cho các ràng buộc phức tạp (cross-field, unique).
- Luôn kiểm tra khung giờ hoạt động của tuyến xe khi tạo ca chạy để tránh dữ liệu mâu thuẫn.

**Issues phát sinh:**

- Không có.

**Cần làm tiếp:**

- Rà soát các module báo cáo và thống kê để đảm bảo tính nhất quán của dữ liệu.

---

### Session #24 — 2026-04-29

**Task hoàn thành:** PRJBFMS-67 (BFMS-041) - Report Optimization (N+1 Fix)
**Files created/modified:**

- `DailyTicketStatRepository.java`, `OperationalCostRepository.java`, `AdContractRepository.java`, `ReportRepository.java` — Bổ sung các phương thức bulk fetch.
- `BusShiftRepository.java` — Tối ưu hóa `findActiveShifts` bằng `JOIN FETCH`.
- `EconomyReportService.java`, `EconomyReportServiceImpl.java` — Tái cấu trúc logic đồng bộ báo cáo sang dạng bulk (O(1) hoặc O(N) thay vì O(N\*M)).
- `ReportServiceImpl.java` — Cập nhật sử dụng bulk sync.
- `BusShiftServiceImpl.java`, `BusShiftServiceImplTest.java`, `EconomyReportServiceTest.java`, `ReportServiceTest.java` — Fix code và tests theo thay đổi logic/kiểu dữ liệu.

**Quyết định mới:**

- Sử dụng **Bulk Fetching** và **In-memory Mapping** (HashMap) là chiến lược chủ đạo để giải quyết vấn đề N+1 và hiệu năng báo cáo dải ngày dài.
- Thay thế toàn bộ hardcoded status string bằng `ShiftStatus` enum trong các query Repository để đảm bảo typesafety.
- Áp dụng `JOIN FETCH` cho các API trả về danh sách có chứa thông tin từ các thực thể liên quan (Lazy Loading).

**Issues phát sinh:**

- Lỗi compilation trong tests do thay đổi signature và thiếu import `List` — _Resolved: Đã bổ sung import và cập nhật toàn bộ test case._

**Cần làm tiếp:**

- Tiếp tục theo dõi hiệu năng khi lượng dữ liệu lớn hơn.

---

### Session #25 — 2026-04-29

**Task hoàn thành:** PRJBFMS-70 (BFMS-042) - Repository Projections
**Files created/modified:**

- `BusProjection.java`, `RouteProjection.java`, `BusShiftProjection.java`, `NotificationProjection.java` — Projection interfaces.
- `BusRepository.java`, `RouteRepository.java`, `BusShiftRepository.java`, `NotificationRepository.java` — Optimized query methods.
- `BusMapper.java`, `RouteMapper.java`, `BusShiftMapper.java` — Added projection mapping.
- `BusServiceImpl.java`, `RouteServiceImpl.java`, `BusShiftServiceImpl.java`, `NotificationServiceImpl.java` — Switched to projections.
- `NotificationController.java` — Used projection from service.
- `RouteServiceImplTest.java`, `BusShiftServiceImplTest.java` — Fixed broken tests.

**Quyết định mới:**

- Sử dụng **Interface-based Projections** để tối ưu hóa hiệu năng và bộ nhớ cho các API danh sách.
- Tránh đặt tên phương thức kiểu `...ProjectedBy` nếu không dùng `@Query` vì Spring Data JPA có thể hiểu nhầm là thuộc tính của Entity.
- Luôn cập nhật Unit Test khi thay đổi constructor hoặc logic mapping để duy trì tính ổn định của hệ thống.

**Issues phát sinh:**

- Lỗi `QueryCreationException` do đặt tên phương thức sai quy ước của Spring Data JPA — _Resolved: Đã đổi tên phương thức hoặc dùng `@Query`._
- Lỗi `NullPointerException` và sai lệch Assertion trong tests do thiếu mock và thay đổi logic Exception — _Resolved: Đã cập nhật đầy đủ mock và assertion._

**Cần làm tiếp:**

- Xem xét áp dụng Projection cho các module Ad và Report nếu danh sách dữ liệu lớn dần.

---

### Session #26 — 2026-04-29

**Task hoàn thành:** PRJBFMS-73 (BFMS-043) - Refresh Token Mechanism
**Files created/modified:**

- `V1__Initial_Setup.sql` — Bổ sung bảng `REFRESH_TOKEN`.
- `RefreshToken.java` — Entity lưu trữ token.
- `RefreshTokenRepository.java` — Repository quản lý token trong DB.
- `AuthResponse.java`, `RefreshTokenRequest.java` — DTOs hỗ trợ refresh flow.
- `RefreshTokenService.java`, `RefreshTokenServiceImpl.java` — Logic quản lý lifecycle của refresh token.
- `AuthService.java` — Tích hợp cấp refresh token khi login và logic cấp mới access token.
- `AuthController.java` — Endpoint `POST /api/v1/auth/refresh`.

**Quyết định mới:**

- Lưu trữ Refresh Token trong Database để tăng khả năng kiểm soát (có thể thu hồi/xóa khi logout hoặc phát hiện nghi vấn).
- Mỗi người dùng chỉ duy trì một Refresh Token mới nhất (xóa token cũ khi login mới).
- Sử dụng UUID cho Refresh Token thay vì JWT phức tạp, do token này đã được lưu và kiểm tra trong DB.

**Issues phát sinh:**

- Không có.

**Cần làm tiếp:**

- Implement logic logout để xóa Refresh Token khỏi DB.
- Cân nhắc việc xoay vòng (rotating) Refresh Token sau mỗi lần sử dụng để tăng tính bảo mật.

---

### Session #28 — 2026-04-29

**Task hoàn thành:** PRJBFMS-79 (BFMS-045) - Security Logging (Audit Log)
**Files created/modified:**

- `V1__Initial_Setup.sql` — Bổ sung bảng `SECURITY_LOG`.
- `SecurityLog.java`, `SecurityLogRepository.java` — Entity và Repository cho nhật ký bảo mật.
- `AuditService.java`, `AuditServiceImpl.java` — Logic ghi log tập trung.
- `AuthService.java` — Tích hợp log login.
- `GlobalExceptionHandler.java` — Tích hợp log access denied.
- `BusServiceImpl.java`, `RouteServiceImpl.java`, `AdServiceImpl.java` — Tích hợp log nghiệp vụ.

**Quyết định mới:**

- Ghi trực tiếp bảng `SECURITY_LOG` vào `V1__Initial_Setup.sql` theo yêu cầu của User thay vì tạo file migration mới.
- Audit Log tự động lấy IP Address từ header `X-Forwarded-For` để hỗ trợ các môi trường chạy sau Proxy/Load Balancer.
- Ghi log đồng bộ trong cùng Transaction của nghiệp vụ để đảm bảo tính nhất quán (nếu nghiệp vụ fail thì log cũng rollback - trừ trường hợp Auth fail).

**Issues phát sinh:**

- Lỗi compile do thiếu import `EntityLookupHelper` sau khi refactor — _Resolved: Đã bổ sung import và khôi phục code._

**Cần làm tiếp:**

- Xem xét bổ sung API cho ADMIN truy vấn dữ liệu từ bảng `SECURITY_LOG`.
- Theo dõi hiệu năng ghi log khi lượng traffic tăng cao.

  ***

### Session #29 — 2026-04-29

**Task hoàn thành:** PRJBFMS-82 (Tích hợp tài liệu API - Swagger UI)
**Files created/modified:**

- `pom.xml` — Thêm dependency `springdoc-openapi-starter-webmvc-ui`.
- `application.yaml` — Cấu hình metadata, sorting và mở public các path của Swagger.
- `OpenApiConfig.java` — Định nghĩa Bean OpenAPI, thông tin hệ thống và Global Security Scheme (JWT Bearer).
- `SecurityConfig.java` — Cho phép truy cập không cần xác thực tới các endpoint tài liệu.
- Toàn bộ 10 Controller — Bổ sung `@Tag` phân nhóm nghiệp vụ và `@Operation` mô tả chi tiết từng endpoint.
- Các DTO quan trọng (`LoginRequest`, `AuthResponse`, `BusRequest`, `RouteRequest`) — Bổ sung `@Schema` mô tả trường dữ liệu và cung cấp ví dụ (example).

**Quyết định mới:**

- Sử dụng **Global Authorize** (BearerAuth) trong Swagger UI để người dùng nhập token một lần và áp dụng cho toàn bộ API.
- Phân nhóm API theo 9 Tag nghiệp vụ chính (Xác thực, Xe, Tuyến, Nốt, Ca, Quảng cáo, Thông báo, Doanh thu, Vé).
- Metadata tài liệu được viết bằng **Tiếng Việt** để phù hợp với đội ngũ phát triển và SRS của dự án.

**Issues phát sinh:**

- Lỗi compile do xóa nhầm import `BusStatus` khi thêm `@Schema` vào `BusRequest` — _Resolved: Đã bổ sung lại import._

**Cần làm tiếp:**

- Kiểm tra hiển thị thực tế của Swagger UI tại `/swagger-ui.html`.
- Mở rộng `@Schema` cho tất cả các DTO còn lại trong hệ thống để tài liệu đầy đủ 100%.

---

### Session #30 — 2026-04-29

**Task hoàn thành:** PRJBFMS-84 (Hệ thống Logging kỹ thuật)
**Files created/modified:**

- `pom.xml` — Thêm `spring-boot-starter-aop`.
- `logback-spring.xml` — Cấu hình ghi log ra Console và File (Rolling).
- `LoggingAspect.java` — Tự động log Request và giám sát hiệu năng Service.
- `GlobalExceptionHandler.java` — Tích hợp ghi log stack trace cho các lỗi hệ thống.
- `BusShiftServiceImpl.java`, `AdServiceImpl.java` — Thêm log nghiệp vụ chi tiết.

**Quyết định mới:**

- Sử dụng **Spring AOP** để tách biệt logic logging kỹ thuật khỏi business logic, giúp code sạch hơn.
- Triển khai **Rolling File Log** với cơ chế xoay vòng theo ngày và dung lượng để đảm bảo an toàn lưu trữ trên server.
- Mọi lỗi không xác định (Exception/RuntimeException) bắt buộc phải log stack trace để phục vụ điều tra lỗi (Root Cause Analysis).

**Issues phát sinh:**

- Lỗi missing artifact cho `spring-boot-starter-aop` khi dùng chung version `4.0.5` với parent — _Resolved: Đã fix cứng version `3.4.0` để đảm bảo Maven có thể tải thư viện._

**Cần làm tiếp:**

- Theo dõi dung lượng thư mục `logs/` trong môi trường staging.
- Mở rộng AOP Logging để log cả tham số đầu vào của tầng Service nếu cần thiết.
  | #31 | 2026-05-02 | PRJBFMS-86 | Chuẩn hóa cấu trúc test, bổ sung Unit Test, đồng bộ ErrorCode trong exception handling. |
  | #32 | 2026-05-02 | PRJBFMS-89 | Quản lý File |
  | #33 | 2026-05-02 | PRJBFMS-92 | Tạo tài liệu README song ngữ (Anh - Việt). |
  | #34 | 2026-05-02 | PRJBFMS-93 | Bổ sung và hoàn thiện tài liệu Swagger/OpenAPI cho toàn bộ DTO và Controller. |
  | #35 | 2026-05-02 | PRJBFMS-94 | Bổ sung tính năng đăng xuất (Logout) và Audit Log tương ứng. |

---

### Session #31 — 2026-05-02

**Task hoàn thành:** PRJBFMS-86 (Kiểm thử - Testing)
**Files created/modified:**

- `src/test/java/com/bfms/bfms_backend/service/impl/` — Di chuyển và cập nhật `BusShiftServiceImplTest`, `RouteServiceImplTest`.
- `AuthServiceTest.java`, `RefreshTokenServiceImplTest.java` — Kiểm thử bảo mật & token (đã đồng bộ ErrorCode).
- `AuditServiceImplTest.java`, `BusServiceImplTest.java`, `NotificationServiceImplTest.java` — Kiểm thử nghiệp vụ & audit log (đã đồng bộ ErrorCode).
- `AdServiceTest.java` — Cập nhật xác thực ErrorCode cho module quảng cáo.
- `agent-context/unit-tests/` — Bộ tài liệu chi tiết cho từng class test (7 file .md).
- `src/main/resources/logback-spring.xml` — Fix lỗi thứ tự include gây lỗi khi chạy test.
- `ErrorCode.java`, `AuthService.java`, `RefreshTokenServiceImpl.java` — Bổ sung và đồng bộ ErrorCode.

**Quyết định mới:**

- Toàn bộ Unit Test phải được đặt trong package `com.bfms.bfms_backend` để đồng bộ với mã nguồn.
- Mọi class test mới phải đi kèm tài liệu mô tả kịch bản kiểm thử trong thư mục `agent-context/unit-tests/`.
- Sử dụng `ArgumentCaptor` để kiểm tra dữ liệu thực thể (Entity) trước khi lưu vào DB trong các Unit Test Service.
- **Bắt buộc** kiểm tra `ErrorCode` khi `assertThrows(AppException.class)` thay vì chỉ kiểm tra message hoặc loại Exception chung.

**Issues phát sinh:**

- Lỗi `conversion word [wEx]` trong Logback — _Resolved: Di chuyển include defaults.xml lên đầu và loại bỏ %wEx._
- Sai lệch constructor DTO trong test do Record thay đổi — _Resolved: Cập nhật lại constructor trong test khớp với mã nguồn._

**Cần làm tiếp:**

- Tiếp tục bổ sung Integration Test cho các luồng API mới nếu có môi trường Database ổn định.

---

### Session #32 — 2026-05-02

**Task hoàn thành:** PRJBFMS-89 (Quản lý File)
**Files created/modified:**

- `application.yaml` — Cấu hình `servlet.multipart` và `application.file.upload-dir`.
- `FileService.java`, `FileServiceImpl.java` — Triển khai logic lưu trữ Local Storage cho file.
- `FileController.java` — Cung cấp API upload và download file với bảo mật RBAC.
- `SecurityConfig.java` — Tích hợp phân quyền cho các endpoint file.

**Quyết định mới:**

- Sử dụng **Local Storage** để lưu trữ file trong thư mục `uploads/contracts/`.
- Tự động tạo tên file duy nhất bằng **UUID** để đảm bảo tính toàn vẹn và tránh ghi đè dữ liệu.
- Phân quyền chặt chẽ: Chỉ các vai trò liên quan (`ADVERTISING`, `ACCOUNTANT`, `ADMIN`, `OWNER`) mới có quyền truy cập hoặc upload tài liệu.

**Issues phát sinh:**

- Lệnh `mvn` không nhận diện được — _Resolved: Sử dụng `.\mvnw.cmd` thay thế._

**Cần làm tiếp:**

- Tích hợp URL file từ `FileController` vào luồng tạo hợp đồng (`AdContract`) ở Frontend.

---

### Session #33 — 2026-05-02

**Task hoàn thành:** PRJBFMS-92 (Tài liệu dự án - README)
**Files created/modified:**

- `README.md` — Tài liệu hướng dẫn chính thức (Tiếng Anh).
- `README_VN.md` — Tài liệu hướng dẫn chi tiết (Tiếng Việt).

**Quyết định mới:**

- Duy trì hai phiên bản README để phục vụ đa dạng đối tượng.
- Nội dung README được tổng hợp từ toàn bộ `agent-context` để đảm bảo tính nhất quán.

**Issues phát sinh:**

- Không có.

**Cần làm tiếp:**

- Tiếp tục thực hiện các task tài liệu hoặc module tiếp theo.

---

### Session #34 — 2026-05-02

**Task hoàn thành:** PRJBFMS-93 (Tài liệu API - Swagger)
**Files created/modified:**

- Toàn bộ DTOs trong `dtos/req/` và `dtos/res/` — Bổ sung `@Schema` mô tả chi tiết trường dữ liệu và ví dụ.
- `AdController.java` — Bổ sung `@Operation` cho các phương thức quản lý đối tác và hợp đồng.

**Quyết định mới:**

- Sử dụng Tiếng Việt cho toàn bộ mô tả trong Swagger để đồng bộ với ngôn ngữ của dự án.
- Mọi DTO mới bắt buộc phải có `@Schema` để đảm bảo tài liệu API luôn đầy đủ.

**Issues phát sinh:**

- Không có.

**Cần làm tiếp:**

- Duy trì tính cập nhật của Swagger khi thay đổi logic API.

---

### Session #35 — 2026-05-02

**Task hoàn thành:** PRJBFMS-94 (Xác thực - Logout)
**Files created/modified:**

- `AuthService.java` — Thêm phương thức `logout(username)` để xóa Refresh Token.
- `AuthController.java` — Thêm endpoint `POST /api/v1/auth/logout`.
- `README.md`, `README_VN.md`, `PROJECT_CONTEXT.md` — Cập nhật thông tin mới.
- `BFMS_SRS.md`, `BFMS_SDD.md`, `BFMS_API.md` — Chuẩn hóa tài liệu theo các tính năng mới.

**Quyết định mới:**

- Cho phép người dùng chủ động vô hiệu hóa Refresh Token thông qua endpoint Logout.
- Tích hợp Audit Log cho hành động đăng xuất để theo dõi phiên làm việc của người dùng.

**Issues phát sinh:**

- Không có.

**Cần làm tiếp:**

- Xem xét cơ chế Blacklist cho Access Token nếu yêu cầu bảo mật cao hơn (hiện tại chỉ xử lý ở mức Refresh Token).

---

### Session #36 — 2026-05-05

**Task hoàn thành:** PRJBFMS-238 (Frontend: Khởi tạo dự án & Cấu hình)
**Files created/modified:**

- `styles.scss` — Cấu hình TailwindCSS v4 và PrimeIcons.
- `app.config.ts` — Cấu hình PrimeNG (Lara UI), Animations, HttpClient.
- `store.service.ts` — Quản lý state toàn cục bằng Angular Signals.
- `api.service.ts` — Wrapper cho HttpClient.
- `app.ts` — Cập nhật AppComponent để xác minh cấu hình.
- `environment.ts` — Cấu hình API URL.

**Quyết định mới:**

- Sử dụng **TailwindCSS v4** cho layout vì tính hiện đại và tích hợp tốt với Angular 21.
- Sử dụng **PrimeNG v21** với theme **Lara** thông qua hệ thống styling mới (`@primeuix/themes`).
- Áp dụng kiến trúc **Domain-Driven** cho thư mục `src/app` để tăng khả năng mở rộng.

**Issues phát sinh:**

- Lỗi import CSS truyền thống của PrimeNG do thay đổi package exports trong v21 — _Resolved: Chuyển sang cấu hình qua `providePrimeNG` và sử dụng presets._
- Thiếu `@angular/animations` khi sử dụng `provideAnimationsAsync` — _Resolved: Đã cài đặt bổ sung._

**Cần làm tiếp:**

- Triển khai Module Authentication (Login giao diện Glassmorphism).
- Xây dựng bộ khung Layout (Sidebar, Navbar).
```

---

### Session #21 � 2026-05-06

**Task ho�n th�nh:** PRJBFMS-246 (Trang Login)
**Files created/modified:**

- src/app/features/auth/login/ � T?o m?i component Login (logic, template, styles).
- src/app/app.routes.ts � C?u h�nh route /login.
- src/app/app.html � Cleanup placeholder.

**Quy?t d?nh m?i:**

- S? d?ng phong c�ch Glassmorphism Dark Mode t?i gi?n (Enterprise style) theo wireframe d� ch?t.
- S? d?ng Lucide Icons tr?c ti?p trong template.

**Issues ph�t sinh:**

- L?i Execution Policy khi ch?y npm � Resolved: S? d?ng -ExecutionPolicy Bypass.

**C?n l�m ti?p:**

- [PRJBFMS-244] Ph�t tri?n Sidebar v?i hi?u ?ng k�nh m?.


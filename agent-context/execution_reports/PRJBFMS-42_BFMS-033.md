# Execution Report: PRJBFMS-42 (BFMS-033)
## Triển khai API Thống kê Vé lượt/tháng theo Tuyến và Ngày (US-02)

### 1. Thông tin task
- **Jira ID:** PRJBFMS-42 (BFMS-033)
- **Mô tả:** Triển khai endpoint cho phép Owner xem thống kê số lượng vé lượt, vé tháng và doanh thu vé lượt của một tuyến xe cụ thể trong một ngày.
- **Ngày hoàn thành:** 2026-04-24

### 2. Các thay đổi chính

#### DTOs
- **[TicketStatisticsResponse.java](file:///c:/Users/Administrator/Downloads/BFMS-BE/src/main/java/com/bfms/bfms_backend/dtos/res/TicketStatisticsResponse.java)**: Định nghĩa cấu trúc trả về bao gồm ID tuyến, tên tuyến, ngày báo cáo, số lượng vé lượt/tháng, tổng hành khách và doanh thu vé lượt.

#### Service Layer
- **[TicketService.java](file:///c:/Users/Administrator/Downloads/BFMS-BE/src/main/java/com/bfms/bfms_backend/service/TicketService.java)** & **[TicketServiceImpl.java](file:///c:/Users/Administrator/Downloads/BFMS-BE/src/main/java/com/bfms/bfms_backend/service/impl/TicketServiceImpl.java)**: 
    - Triển khai logic truy vấn từ `DailyTicketStatRepository`.
    - Xử lý trường hợp không có dữ liệu: Trả về object với các thông số bằng 0 thay vì ném lỗi 404, giúp Frontend hiển thị trạng thái "Không có dữ liệu" mượt mà hơn.
    - Định dạng tên tuyến chuyên nghiệp: `RouteNumber (StopA - StopB)`.

#### Controller Layer
- **[TicketController.java](file:///c:/Users/Administrator/Downloads/BFMS-BE/src/main/java/com/bfms/bfms_backend/controller/TicketController.java)**:
    - Cung cấp endpoint `GET /api/v1/tickets/statistics`.
    - Phân quyền: `@PreAuthorize("hasRole('OWNER')")`.
    - Logic tham số: Mặc định lấy ngày hiện tại (`LocalDate.now()`) nếu người dùng không truyền tham số `date`.

#### Testing & Bug Fix
- **[TicketServiceTest.java](file:///c:/Users/Administrator/Downloads/BFMS-BE/src/test/java/com/bfms/bfms_backend/service/TicketServiceTest.java)**: Unit test bao phủ 3 trường hợp: Thành công, Không có dữ liệu, và Tuyến xe không tồn tại.
- **[EconomyReportServiceTest.java](file:///c:/Users/Administrator/Downloads/BFMS-BE/src/test/java/com/bfms/bfms_backend/service/EconomyReportServiceTest.java)**: Fix lỗi compile do sử dụng field `name` không tồn tại trong entity `Route`.

### 3. Kết quả kiểm chứng
- **Unit Tests**: Đã chạy `mvnw.cmd test -Dtest=TicketServiceTest` và đạt kết quả 3/3 Pass.
- **Compilation**: Project build thành công sau khi fix lỗi trong `EconomyReportServiceTest`.
- **Git**: Đã commit và push code lên nhánh `feature/reports` với message `Done BFMS-033`.

### 4. Tài liệu bổ sung
- Chi tiết kế hoạch triển khai đã duyệt: [implementation_plan.md](file:///c:/Users/Administrator/.gemini/antigravity/brain/36eb290c-fe43-41a0-a850-e038fdca60a6/implementation_plan.md).
- Walkthrough quá trình thực hiện: [walkthrough.md](file:///c:/Users/Administrator/.gemini/antigravity/brain/36eb290c-fe43-41a0-a850-e038fdca60a6/walkthrough.md).

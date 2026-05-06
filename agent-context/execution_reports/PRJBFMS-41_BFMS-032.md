# Execution Report: PRJBFMS-41 (BFMS-032)
## Triển khai API Tổng doanh thu Hệ thống (US-01)

### 1. Thông tin task
- **Jira ID:** PRJBFMS-41 (BFMS-032)
- **Mô tả:** Triển khai endpoint cho phép Owner xem báo cáo tổng doanh thu toàn hệ thống theo các mốc thời gian: Ngày, Tháng, Năm.
- **Ngày hoàn thành:** 2026-04-24

### 2. Các thay đổi chính

#### DTOs
- **[RevenueResponse.java](file:///c:/Users/Administrator/Downloads/BFMS-BE/src/main/java/com/bfms/bfms_backend/dtos/res/RevenueResponse.java)**: Chuẩn hóa dữ liệu trả về cho Frontend (Doanh thu vé, quảng cáo, khấu trừ thuế, lợi nhuận ròng).

#### Service Layer
- **[EconomyReportService.java](file:///c:/Users/Administrator/Downloads/BFMS-BE/src/main/java/com/bfms/bfms_backend/service/EconomyReportService.java)** & **[EconomyReportServiceImpl.java](file:///c:/Users/Administrator/Downloads/BFMS-BE/src/main/java/com/bfms/bfms_backend/service/impl/EconomyReportServiceImpl.java)**: 
    - Implement logic đồng bộ dữ liệu (`syncEconomyReports`) từ các nguồn: `DailyTicketStat`, `AdContract`, `OperationalCost`.
    - Implement logic tổng hợp dữ liệu (`getSystemTotalRevenue`) theo `timeframe`.
    - **Quyết định:** Ghi nhận 100% doanh thu quảng cáo vào ngày bắt đầu hợp đồng (`startDate`).

#### Controller Layer
- **[RevenueController.java](file:///c:/Users/Administrator/Downloads/BFMS-BE/src/main/java/com/bfms/bfms_backend/controller/RevenueController.java)**: Cung cấp endpoint `GET /api/v1/revenue/total` với phân quyền `@PreAuthorize("hasRole('OWNER')")`.

#### Repository Layer
- **[AdContractRepository.java](file:///c:/Users/Administrator/Downloads/BFMS-BE/src/main/java/com/bfms/bfms_backend/repository/AdContractRepository.java)**: Thêm phương thức tìm kiếm hợp đồng theo ngày bắt đầu.
- **[ReportRepository.java](file:///c:/Users/Administrator/Downloads/BFMS-BE/src/main/java/com/bfms/bfms_backend/repository/ReportRepository.java)**: Nâng cấp query `getTotalSystemSummary` để trả về thêm tổng số hành khách.

### 3. Kết quả kiểm chứng
- **Unit Tests**: Triển khai `EconomyReportServiceTest.java` để xác minh các công thức tính toán tài chính và khả năng aggregate dữ liệu qua nhiều ngày.
- **Compilation**: Project build thành công, đảm bảo các interface được inject đúng cách.

### 4. Tài liệu bổ sung
- Căn cứ tính toán thuế dựa trên [Quy_dinh_thue_BFMS.md](file:///c:/Users/Administrator/Downloads/BFMS-BE/agent-context/Quy_dinh_thue_BFMS.md).
- Chi tiết kế hoạch triển khai đã duyệt: [implementation_plan.md](file:///C:/Users/Administrator/.gemini/antigravity/brain/5eecc6d7-9392-4318-8855-548ee9fa6463/implementation_plan.md).

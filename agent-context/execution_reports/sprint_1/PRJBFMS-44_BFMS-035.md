# Execution Report: PRJBFMS-44 (BFMS-035)
## [TEST] ReportService: net_profit & month filter

### 1. Thông tin task
- **Jira ID:** PRJBFMS-44
- **Mô tả:** Viết unit test kiểm tra công thức tính lợi nhuận ròng và bộ lọc báo cáo theo tháng.
- **Ngày hoàn thành:** 2026-04-24

### 2. Các thay đổi chính

#### Backend
- **Report Module:**
    - `ReportServiceTest.java`: Thêm test case `testGetRouteReport_NetProfitFormulaValidation` kiểm tra công thức `Net Profit = Ticket + Ad - Tax` (với costs=0) và `testGetRouteReport_CallsSyncForEachDay` kiểm tra logic đồng bộ đa ngày.
- **Economy Report Module:**
    - `EconomyReportServiceTest.java`: Thêm test case `testGetSystemTotalRevenue_Month` kiểm tra logic tính toán khoảng ngày (startDate, endDate) khi lọc theo tháng.

### 3. Kết quả kiểm chứng
- Logic đã được verify thông qua việc xây dựng các test case với số liệu thực tế dựa trên logic tài chính tại `EconomyReport.java`.
- Đã xác nhận `EconomyReportTest.java` đã có sẵn các test case kiểm tra math logic cho cả trường hợp lãi và lỗ.

### 4. Tài liệu bổ sung (nếu có)
- [Walkthrough](file:///C:/Users/Administrator/.gemini/antigravity/brain/4976e15c-23df-4fb9-b8d3-f1d817e1c615/walkthrough.md)

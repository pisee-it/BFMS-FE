# Execution Report: PRJBFMS-30 (BFMS-021)
## Hoàn thiện logic tính toán dữ liệu phái sinh cho Ticket Statistics

### 1. Thông tin task
- **Jira ID:** PRJBFMS-30
- **Mô tả:** Sửa logic tính toán tự động các trường dữ liệu phái sinh (derived fields) cho thống kê vé hàng ngày và nốt chạy.
- **Ngày hoàn thành:** 2026-04-23

### 2. Các thay đổi chính

#### Backend
- **Revenue Module:**
    - `DailyTicketStat.java`: Cập nhật logic tính toán `total_passengers` và `revenue_single_tickets` tự động trong hàm `addTickets`.
    - `BusShiftServiceImpl.java`: Đồng bộ việc cập nhật `total_passengers` cho `Node` khi một ca chạy hoàn thành.

### 3. Kết quả kiểm chứng
- Đảm bảo tính nhất quán dữ liệu giữa BusShift, Node và DailyTicketStat trong cùng một transaction.
- Các trường derived fields được tính toán chính xác theo công thức quy định trong PROJECT_CONTEXT.md.

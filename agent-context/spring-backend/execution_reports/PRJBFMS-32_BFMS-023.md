# Execution Report: PRJBFMS-32 (BFMS-023)
## Sửa lỗi môi trường Test và Kiểm chứng Transaction Rollback

### 1. Thông tin task
- **Jira ID:** PRJBFMS-32
- **Mô tả:** Khắc phục lỗi cấu hình môi trường test và kiểm chứng tính toàn vẹn dữ liệu của luồng hoàn thành ca chạy.
- **Ngày hoàn thành:** 2026-04-23

### 2. Các thay đổi chính

#### Backend
- **Cấu hình (Configuration):**
    - `application.yaml`: Đồng bộ tên biến môi trường `JWT_SECRET` với file `.env`.
- **Kiểm thử (Testing):**
    - `BusShiftServiceRollbackTest.java`: Thực hiện kiểm thử rollback khi có lỗi xảy ra ở cuối transaction.

### 3. Kết quả kiểm chứng
- **Rollback Test:** ✅ THÀNH CÔNG. Dữ liệu (BusShift status, Ticket records, Node total passengers, DailyTicketStat) được khôi phục chính xác khi transaction thất bại.
- **ApplicationContext:** Load thành công trong môi trường test.

# Execution Report: PRJBFMS-33 (BFMS-024)
## Xác minh logic tính toán doanh thu và hành khách

### 1. Thông tin task
- **Jira ID:** PRJBFMS-33
- **Mô tả:** Kiểm chứng độ chính xác của logic tính toán doanh thu ca chạy và tổng số hành khách.
- **Ngày hoàn thành:** 2026-04-23

### 2. Các thay đổi chính

#### Backend
- **Revenue Module:**
    - `TicketRepository.java`: Bổ sung method `deleteByBusShiftId` để hỗ trợ dọn dẹp dữ liệu kiểm thử.
- **Kiểm thử (Testing):**
    - `BusShiftServiceRevenueTest.java`: Cập nhật logic cleanup để xóa Ticket trước khi xóa BusShift, tránh lỗi FK constraint.

### 3. Kết quả kiểm chứng
- **Kết quả tính toán:** ✅ CHÍNH XÁC.
    - Input: 45 single, 15 monthly, price 7,000.
    - Output: `shift_revenue` = 315,000 VNĐ, `total_passengers` = 60.
- **Build Success:** ✅ Lệnh `mvn test` chạy thành công.

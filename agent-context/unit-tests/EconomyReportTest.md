# Unit Test Report: EconomyReportTest

## 1. Thông tin chung
- **Class kiểm thử:** `EconomyReportTest`
- **Class mục tiêu:** `EconomyReport` (Entity)
- **Package:** `com.bfms.bfms_backend.entity`
- **Công nghệ:** JUnit 5

## 2. Các kịch bản kiểm thử (Test Cases)

| ID | Tên Test Case | Mô tả | Input | Kết quả mong đợi | Trạng thái |
|----|---------------|-------|-------|------------------|------------|
| TC-01 | `testCalculateReport_PositiveProfit` | Tính toán báo cáo khi có lãi | Doanh thu > Chi phí | Tính đúng VAT 10% (Ads), TNDN 20% và Lợi nhuận ròng | ✅ PASSED |
| TC-02 | `testCalculateReport_NegativeProfit` | Tính toán báo cáo khi lỗ | Chi phí > Doanh thu | TNDN = 0, Lợi nhuận ròng âm khớp với số lỗ | ✅ PASSED |

## 3. Ghi chú
- Đây là unit test quan trọng nhất để xác minh tính chính xác của module Tài chính theo tài liệu `Quy_dinh_thue_BFMS.md`.
- Công thức: `Lợi nhuận ròng = (Doanh thu vé + Doanh thu Ads thuần) - Chi phí - Thuế TNDN`.

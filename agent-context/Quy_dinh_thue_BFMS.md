# Quy định Thuế cho Doanh nghiệp Xe buýt (Dự án BFMS)

Tài liệu này tóm tắt cách tính thuế cho hai nguồn thu chính của doanh nghiệp vận tải hành khách công cộng bằng xe buýt, phục vụ việc thiết kế logic module tài chính.

## 1. Doanh thu Vé xe buýt (Lượt/Tháng)
Đây là loại hình vận tải hành khách công cộng theo lộ trình cố định.

* **Thuế Giá trị gia tăng (GTGT/VAT):** **0%**
    * *Chi tiết:* Thuộc đối tượng **không chịu thuế GTGT** theo quy định pháp luật về thuế hiện hành cho vận tải công cộng.
* **Cách tính:**
    * `Tiền thuế GTGT = 0`
    * `Tổng số tiền thu từ khách = Giá vé niêm yết`
* **Lưu ý nghiệp vụ:** Do đầu ra không chịu thuế GTGT, các hóa đơn đầu vào (như dầu diezel, phụ tùng, sửa chữa) sẽ không được khấu trừ thuế mà tính trực tiếp vào chi phí vận hành.

## 2. Doanh thu Quảng cáo trên xe buýt
Dịch vụ dán quảng cáo trên thân xe hoặc bên trong xe được coi là hoạt động thương mại thông thường.

* **Thuế Giá trị gia tăng (GTGT/VAT):** **10%**
    * *Chi tiết:* Áp dụng mức thuế suất phổ thông đối với dịch vụ quảng cáo thương mại.
* **Cách tính:**
    * `Giá dịch vụ (Chưa thuế) = A`
    * `Tiền thuế GTGT = A * 0.1`
    * `Tổng thanh toán (Sau thuế) = A * 1.1`

---

## 3. Bảng tổng hợp logic lập trình

| STT | Loại doanh thu | Thuế suất | Thuật toán / Logic |
|:---:|:---|:---:|:---|
| 1 | Vé lượt / Vé tháng | 0% | `amount = unit_price * quantity` |
| 2 | Quảng cáo dán xe | 10% | `tax = net_amount * 0.1; total = net_amount + tax` |

## 4. Thuế Thu nhập doanh nghiệp (TNDN)
* **Thuế suất:** **20%** tính trên lợi nhuận sau khi trừ chi phí hợp lệ.
* **Lưu ý:** Các khoản trợ giá từ ngân sách Nhà nước cho xe buýt phải được hạch toán vào doanh thu khi tính thuế TNDN.

---
*Tài liệu được biên soạn cho dự án BFMS (Bus Fleet Management System) - 2026.*

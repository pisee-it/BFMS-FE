# Unit Test Report: BusServiceTest

## 1. Thông tin chung
- **Class kiểm thử:** `BusServiceImplTest`
- **Class mục tiêu:** `BusServiceImpl`
- **Package:** `com.bfms.bfms_backend.service.impl`
- **Công nghệ:** JUnit 5, Mockito

## 2. Các kịch bản kiểm thử (Test Cases)

| ID | Tên Test Case | Mô tả | Input | Kết quả mong đợi | Trạng thái |
|----|---------------|-------|-------|------------------|------------|
| TC-01 | `createBus_ShouldReturnResponse_WhenValid` | Tạo mới xe buýt thành công | `BusRequest` hợp lệ | Lưu DB, ghi Audit Log, trả về `BusResponse` | ✅ PASSED |
| TC-02 | `createBus_ShouldThrowException_WhenLicensePlateExists` | Lỗi khi trùng biển số xe | Biển số đã có trong DB | Throw `AppException` (BUS_ALREADY_EXISTS) | ✅ PASSED |
| TC-03 | `sellBus_ShouldUpdateStatusToSold` | Đánh dấu bán xe thành công | `busId = 10` | Status của xe chuyển thành `SOLD` | ✅ PASSED |

## 3. Ghi chú
- Các test case đảm bảo tính toàn vẹn dữ liệu thông qua việc kiểm tra các ràng buộc duy nhất (Unique Constraint) ở tầng Service.

# Unit Test Report: BusShiftServiceImplTest

## 1. Thông tin chung
- **Class kiểm thử:** `BusShiftServiceImplTest`
- **Class mục tiêu:** `BusShiftServiceImpl`
- **Package:** `com.bfms.bfms_backend.service.impl`
- **Công nghệ:** JUnit 5, Mockito

## 2. Các kịch bản kiểm thử (Test Cases)

| ID | Tên Test Case | Mô tả | Input | Kết quả mong đợi | Trạng thái |
|----|---------------|-------|-------|------------------|------------|
| TC-01 | `getActiveShiftsByRoute_ShouldReturnOnlyInProgressShifts` | Kiểm tra việc lấy danh sách ca chạy đang hoạt động của một tuyến | `routeId = 1` | Trả về danh sách các ca có trạng thái `IN_PROGRESS` | ✅ PASSED |
| TC-02 | `getActiveShiftsByRoute_ShouldFilterCorrectRouteId` | Kiểm tra việc lọc đúng theo `routeId` | `routeId = 99` (không tồn tại) | Trả về danh sách trống | ✅ PASSED |

## 3. Ghi chú
- Các test case sử dụng Mockito để giả lập `BusShiftRepository` và `BusShiftMapper`.
- Đảm bảo logic nghiệp vụ không phụ thuộc vào dữ liệu thật trong Database.

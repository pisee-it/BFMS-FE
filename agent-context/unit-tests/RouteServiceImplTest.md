# Unit Test Report: RouteServiceImplTest

## 1. Thông tin chung
- **Class kiểm thử:** `RouteServiceImplTest`
- **Class mục tiêu:** `RouteServiceImpl`
- **Package:** `com.bfms.bfms_backend.service.impl`
- **Công nghệ:** JUnit 5, Mockito

## 2. Các kịch bản kiểm thử (Test Cases)

| ID | Tên Test Case | Mô tả | Input | Kết quả mong đợi | Trạng thái |
|----|---------------|-------|-------|------------------|------------|
| TC-01 | `createRoute_ShouldThrowException_WhenDistanceABIsNegative` | Kiểm tra validation khoảng cách âm | `distanceAB = -1` | Throw `AppException` ("Khoảng cách tuyến xe không được nhỏ hơn 0") | ✅ PASSED |
| TC-02 | `createRoute_ShouldThrowException_WhenDistanceBAIsNegative` | Kiểm tra validation khoảng cách âm | `distanceBA = -5` | Throw `AppException` ("Khoảng cách tuyến xe không được nhỏ hơn 0") | ✅ PASSED |
| TC-03 | `createRoute_ShouldSetPrice8000_WhenAverageDistanceUnder15` | Kiểm tra auto-price cho khoảng cách < 15km | `avgDist = 10km` | `price = 8000` | ✅ PASSED |
| TC-04 | `createRoute_ShouldSetPrice10000_WhenAverageDistanceBetween15And25` | Kiểm tra auto-price cho khoảng cách 15-25km | `avgDist = 20km` | `price = 10000` | ✅ PASSED |
| TC-05 | `createRoute_ShouldSetPrice12000_WhenAverageDistanceBetween25And30` | Kiểm tra auto-price cho khoảng cách 25-30km | `avgDist = 27km` | `price = 12000` | ✅ PASSED |
| TC-06 | `createRoute_ShouldSetPrice15000_WhenAverageDistanceBetween30And40` | Kiểm tra auto-price cho khoảng cách 30-40km | `avgDist = 35km` | `price = 15000` | ✅ PASSED |
| TC-07 | `createRoute_ShouldSetPrice20000_WhenAverageDistanceAbove40` | Kiểm tra auto-price cho khoảng cách >= 40km | `avgDist = 45km` | `price = 20000` | ✅ PASSED |

## 3. Ghi chú
- Đã bổ sung Mock `AuditService` để fix lỗi NullPointerException khi chạy test.
- Toàn bộ logic tính giá vé (auto-price) đã được xác minh khớp với tài liệu `PROJECT_CONTEXT.md`.

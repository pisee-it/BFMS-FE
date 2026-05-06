# Execution Report: PRJBFMS-64 (BFMS-040)
## Tăng cường kiểm soát và xác thực dữ liệu (Data Validation Enhancement)

### 1. Thông tin task
- **Jira ID:** PRJBFMS-64
- **Mô tả:** Triển khai xác thực dữ liệu nghiệp vụ tại tầng Service, đảm bảo các ràng buộc duy nhất và khoảng giá trị logic cho các module lõi.
- **Ngày hoàn thành:** 2026-04-29

### 2. Các thay đổi chính

#### Backend
- **Module Tuyến xe (Route):**
    - `ErrorCode.java`: Thêm `ROUTE_ALREADY_EXISTS`, `INVALID_TIME_RANGE`.
    - `RouteRepository.java`: Thêm `findByRouteNumber`.
    - `RouteServiceImpl.java`: Kiểm tra trùng số tuyến và khung giờ hoạt động (`operationStart < operationEnd`).
- **Module Xe buýt (Bus):**
    - `BusServiceImpl.java`: Kiểm tra trùng biển số xe (`licensePlate`) khi tạo mới và cập nhật.
- **Module Vận hành (Node & BusShift):**
    - `ErrorCode.java`: Thêm `SHIFT_TIME_OUT_OF_ROUTE_RANGE`, `NODE_ALREADY_EXISTS`.
    - `NodeRepository.java`: Thêm `existsByRouteIdAndExecutionDateAndNodeNumber`.
    - `NodeServiceImpl.java`: Kiểm tra trùng nốt xe trong cùng tuyến và ngày.
    - `BusShiftServiceImpl.java`: Kiểm tra giờ ca chạy phải nằm trong khung giờ của tuyến và giờ đến phải sau giờ đi.

### 3. Kết quả kiểm chứng
- Đã chạy `.\mvnw.cmd compile` thành công.
- Các logic validation đã được tích hợp chặt chẽ vào tầng Service, ném ra `AppException` với mã lỗi Tiếng Việt chuẩn hóa.
- Đã xác minh tất cả Controller liên quan đều sử dụng `@Valid` để kích hoạt Bean Validation trên DTO.

### 4. Tài liệu bổ sung
- Cập nhật [PROJECT_MEMORY.md](file:///c:/Users/Administrator/Downloads/BFMS-BE/agent-context/PROJECT_MEMORY.md) (Session #23).

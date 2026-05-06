# Báo cáo thực thi - PRJBFMS-70 (BFMS-042)

## 1. Thông tin task
- **Jira ID:** PRJBFMS-70
- **Mô tả:** Triển khai Repository Projections cho các module Bus, Route, BusShift và Notification.
- **Mục tiêu:** Giảm dung lượng bộ nhớ, tránh N+1 query và tối ưu hóa tốc độ phản hồi API.

## 2. Các thay đổi kỹ thuật
### Tầng Repository (Projection)
- Tạo mới các Interface Projection tại `repository.projection`:
    - `BusProjection`: Lấy id, model, manufacturer, capacity, yom, licensePlate, status, isAdvertised và thông tin route liên quan.
    - `RouteProjection`: Lấy thông tin cơ bản của tuyến đường.
    - `BusShiftProjection`: Lấy thông tin ca chạy kèm biển số xe, tên tài xế và hướng chạy.
    - `NotificationProjection`: Lấy message, isRead và createdAt.

### Tầng Repository (Query)
- Cập nhật các phương thức truy vấn để sử dụng Projection:
    - `BusRepository.findBy()`
    - `RouteRepository.findBy()`
    - `BusShiftRepository.findActiveShiftsProjectedBy()`
    - `NotificationRepository.findAllByUserIdOrderByCreatedAtDesc()`

### Tầng Service & Mapper
- Tích hợp MapStruct để chuyển đổi từ Projection sang Response DTO tự động.
- Thay đổi logic trong các Service để gọi phương thức projection thay vì lấy toàn bộ Entity.
- Giảm thiểu việc load các association không cần thiết (Lazy Loading).

## 3. Kết quả kiểm thử
### Unit Tests
- `RouteServiceImplTest.java`: Pass (Đã sửa lỗi thiếu mock Mapper/Helper và cập nhật AppException).
- `BusShiftServiceImplTest.java`: Pass (Đã sửa lỗi mapping và repository method call).

### Hiệu năng (Dự kiến)
- SQL sinh ra sử dụng danh sách cột cụ thể thay vì `SELECT *`.
- Giảm thiểu số lượng query phụ khi truy cập các thuộc tính của Route/Bus/Driver từ ca chạy.

## 4. Bài học & Lưu ý
- **Quy ước đặt tên**: Spring Data JPA rất nhạy cảm với tên phương thức. Nếu không dùng `@Query`, tránh dùng các từ khóa lạ như `ProjectedBy` trong tên phương thức.
- **Duy trì Test**: Bất kỳ thay đổi nào ở tầng Service/Repository cũng cần được kiểm chứng lại bằng các unit test hiện có để tránh regression bugs.

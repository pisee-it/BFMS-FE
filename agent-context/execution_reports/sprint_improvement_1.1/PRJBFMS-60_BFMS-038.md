# Execution Report: PRJBFMS-60 (BFMS-038)
## Ánh xạ DTO - Entity bằng MapStruct

### 1. Thông tin task
- **Jira ID:** PRJBFMS-60
- **Mô tả:** Chuẩn hóa việc ánh xạ giữa Entity và DTO sử dụng thư viện MapStruct thay cho các phương thức helper thủ công.
- **Ngày hoàn thành:** 2026-04-29

### 2. Các thay đổi chính

#### Backend
- **Core:**
    - `pom.xml`: Tích hợp MapStruct 1.5.5.Final và cấu hình compiler plugin để tương thích với Lombok.
- **Mapper Layer (New Package `com.bfms.bfms_backend.mapper`):**
    - `BusMapper.java`: Ánh xạ Bus <-> DTOs, hỗ trợ làm phẳng thông tin từ Route.
    - `RouteMapper.java`: Ánh xạ Route <-> DTOs.
    - `AdMapper.java`: Ánh xạ các thực thể Quảng cáo (Company, Contract, Assignment).
    - `BusShiftMapper.java`: Ánh xạ BusShift sang các định dạng Response khác nhau.
- **Service Layer (Refactoring):**
    - `BusServiceImpl.java`, `RouteServiceImpl.java`, `AdServiceImpl.java`, `BusShiftServiceImpl.java`: Loại bỏ hoàn toàn mapping thủ công, chuyển sang sử dụng MapStruct mappers qua Constructor Injection.

### 3. Kết quả kiểm chứng
- Đã kiểm tra cấu trúc mã nguồn: Các Mapper được sinh mã tự động thành công sau khi khắc phục một số lỗi về tên thuộc tính DTO (`licensePlate`, `shiftId`) và thiếu import `Mapping`.
- Tái cấu trúc không làm thay đổi logic nghiệp vụ, đảm bảo tính ổn định của hệ thống.
- Các API giữ nguyên định dạng Response, đảm bảo tính tương thích với Frontend.

### 4. Tài liệu bổ sung (nếu có)
- Quy ước sử dụng Mapper đã được cập nhật vào `PROJECT_MEMORY.md`.

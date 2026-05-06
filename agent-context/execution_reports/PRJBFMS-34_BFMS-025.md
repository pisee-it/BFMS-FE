# Execution Report: PRJBFMS-34 (BFMS-025)
## Triển khai cấu trúc dữ liệu và Service cho Module Quảng cáo

### 1. Thông tin task
- **Jira ID:** PRJBFMS-34
- **Mô tả:** Xây dựng các thực thể, repository và logic nghiệp vụ cơ bản cho Module Quảng cáo.
- **Ngày hoàn thành:** 2026-04-23

### 2. Các thay đổi chính

#### Backend
- **Advertising Module:**
    - `AdCompany.java`, `AdContract.java`, `AdAssignment.java`: Các Entity chính.
    - `AdContractStatus.java`, `AdAssignmentStatus.java`: Các Enum quản lý trạng thái.
    - `AdCompanyRepository.java`, `AdContractRepository.java`, `AdAssignmentRepository.java`: Các Repository thao tác DB.
    - `AdService.java` & `AdServiceImpl.java`: Triển khai logic tạo công ty, hợp đồng, gán quảng cáo và phê duyệt.
    - **DTOs:** Tạo bộ Request/Response cho tất cả các thực thể quảng cáo.
- **Kiểm thử (Testing):**
    - `AdServiceTest.java`: Kiểm tra toàn bộ luồng nghiệp vụ quảng cáo.

### 3. Kết quả kiểm chứng
- **Unit Test:** ✅ Vượt qua toàn bộ các ca kiểm thử nghiệp vụ (tạo, duyệt, gán, xóa hợp đồng).
- **Ràng buộc:** Logic gỡ trạng thái quảng cáo xe buýt khi xóa hợp đồng hoạt động chính xác.

# Execution Report: PRJBFMS-45 (BFMS-036)
## Bean Validation & Global Exception Handler

### 1. Thông tin task
- **Jira ID:** PRJBFMS-45
- **Mô tả:** Triển khai cơ chế validation dữ liệu đầu vào cho DTO và bộ xử lý lỗi tập trung để trả về thông báo Tiếng Việt chuẩn hóa.
- **Ngày hoàn thành:** 2026-04-25

### 2. Các thay đổi chính

#### Backend
- **DTO Validation:**
    - `LoginRequest.java`: Thêm `@NotBlank` cho username/password.
    - `BusRequest.java`: Thêm `@NotBlank`, `@NotNull`, `@Min` (capacity, yom).
    - `RouteRequest.java`: Thêm `@NotBlank`, `@NotNull`, `@Min` (distances, price).
    - `AdAssignmentRequest.java`, `AdCompanyRequest.java`, `AdContractRequest.java`, `BusShiftRequest.java`, `CompleteShiftRequest.java`, `NodeRequest.java`: Bổ sung đầy đủ validation logic.
- **Controllers:**
    - Cập nhật annotation `@Valid` cho tất cả các endpoint nhận `@RequestBody` trong: `AuthController`, `BusController`, `RouteController`, `AdController`, `BusShiftController`, `NodeController`.
- **Exception Handling:**
    - `ErrorResponse.java`: Record mới định nghĩa cấu trúc lỗi trả về (status, message, errors map).
    - `GlobalExceptionHandler.java`: Class mới xử lý tập trung:
        - Validation errors (400 Bad Request)
        - Business logic errors (400 Bad Request)
        - Authentication errors (401 Unauthorized)
        - Authorization errors (403 Forbidden)
        - Unknown errors (500 Internal Server Error)

### 3. Kết quả kiểm chứng
- Đã kiểm tra code syntax và cấu trúc package đảm bảo tuân thủ `CODING_CONVENTIONS.md`.
- Toàn bộ thông báo lỗi đã được chuyển sang Tiếng Việt theo yêu cầu của Owner.
- Hệ thống đã sẵn sàng xử lý các trường hợp dữ liệu đầu vào không hợp lệ một cách chuyên nghiệp.

### 4. Tài liệu bổ sung
- Quy ước đặt tên và xử lý lỗi được cập nhật trong `PROJECT_MEMORY.md`.

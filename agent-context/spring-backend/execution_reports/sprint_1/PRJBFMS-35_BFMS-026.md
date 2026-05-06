# Execution Report: PRJBFMS-35 (BFMS-026)
## Triển khai AdController và API Phân quyền cho Module Quảng cáo

### 1. Thông tin task
- **Jira ID:** PRJBFMS-35
- **Mô tả:** Triển khai các điểm cuối REST API cho Module Quảng cáo và tích hợp phân quyền RBAC.
- **Ngày hoàn thành:** 2026-04-23

### 2. Các thay đổi chính

#### Backend
- **Advertising Module:**
    - `AdController.java`: Triển khai các endpoint cho Công ty (Companies), Hợp đồng (Contracts), và Phân bổ (Assignments).
- **Security:**
    - Tích hợp `@PreAuthorize` cho từng endpoint dựa trên vai trò: ADVERTISING, ADMIN, ACCOUNTANT, OWNER.

### 3. Kết quả kiểm chứng
- **API Endpoints:**
    - `POST/GET /api/v1/ads/companies`
    - `POST/GET /api/v1/ads/contracts`
    - `PATCH /api/v1/ads/contracts/{id}/approve`
    - `PATCH /api/v1/ads/contracts/{id}/request-delete`
    - `DELETE /api/v1/ads/contracts/{id}`
    - `POST /api/v1/ads/assignments`
- **RBAC:** Xác minh phân quyền hoạt động chính xác theo PROJECT_CONTEXT.md.

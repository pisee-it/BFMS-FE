# BFMS Backend Libraries & Tools

Tài liệu này ghi lại các thư viện và công cụ được sử dụng trong dự án Backend (Spring Boot).

## 1. Core Framework

- **Spring Boot 3.4.x**: Framework chính.
- **Spring Data JPA**: Quản lý truy xuất dữ liệu.
- **Spring Security**: Bảo mật hệ thống.

## 2. Database & Migration

- **PostgreSQL**: Hệ quản trị cơ sở dữ liệu.
- **Flyway**: Quản lý phiên bản database migration.

## 3. Utilities & Performance

- **Lombok**: Giảm thiểu boilerplate code (Getter, Setter, v.v.).
- **MapStruct**: Ánh xạ DTO - Entity tự động.
- **Dotenv-java**: Quản lý biến môi trường từ file `.env`.

## 4. Security & JWT

- **io.jsonwebtoken (jjwt)**: Xử lý JSON Web Token.

## 5. Report Generation

- **Apache POI (poi-ooxml)**: Xuất báo cáo định dạng Excel.

---

_Ghi chú: Các thư viện được quản lý thông qua `pom.xml`. Sử dụng `.\mvnw.cmd clean install` để nạp các dependency mới._

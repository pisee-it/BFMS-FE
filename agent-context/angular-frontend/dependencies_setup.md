# Hướng dẫn Cài đặt Thư viện (Dependencies) - BFMS Frontend

Tài liệu này ghi lại các lệnh cần thiết để thiết lập môi trường và thư viện cho dự án BFMS Frontend (Angular 21).

## 1. Cài đặt các thư viện chính (UI & Layout)

Sử dụng lệnh sau để cài đặt PrimeNG, TailwindCSS và các thư viện hỗ trợ:

```bash
npm install primeng primeicons tailwindcss @tailwindcss/postcss postcss chart.js lucide-angular @angular/animations
```

## 2. Cấu hình Theme PrimeNG (Phiên bản mới v18+)

Cài đặt bộ theme engine mới nhất của Prime UI:

```bash
npm install @primeuix/themes @primeuix/styled
```

## 3. Khởi tạo môi trường (Environments)

Nếu dự án chưa có thư mục `environments`, chạy lệnh sau:

```bash
npx ng generate environments
```

---

### Ghi chú quan trọng:
- Dự án sử dụng **TailwindCSS v4**, do đó không cần file `tailwind.config.js` truyền thống mà cấu hình trực tiếp qua `@import` trong `styles.scss`.
- Theme **Lara** được cấu hình động thông qua `providePrimeNG` trong `app.config.ts`.

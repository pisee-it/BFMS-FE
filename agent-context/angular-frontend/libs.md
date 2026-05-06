# BFMS Frontend Libraries & Installation

Tài liệu này ghi lại các thư viện quan trọng và lệnh cài đặt tương ứng cho dự án Frontend.

## 1. Core & UI Framework
- **Angular 21**: Framework chính.
- **PrimeNG v18+**: Bộ UI Component chính.
- **PrimeIcons**: Bộ icon của Prime.
- **@primeuix/themes**: Theme engine mới cho PrimeNG.

```bash
npm install primeng primeicons @primeuix/themes @primeuix/styled
```

## 2. Styling
- **TailwindCSS v4**: Framework CSS utility-first.
- **PostCSS**: Công cụ xử lý CSS.

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

## 3. Visualization & Icons
- **Chart.js**: Thư viện vẽ biểu đồ.
- **Lucide Angular**: Bộ icon hiện đại.

```bash
npm install chart.js lucide-angular
```

## 4. Animation
- **@angular/animations**: Hỗ trợ hiệu ứng chuyển động.

```bash
npm install @angular/animations
```

---
*Ghi chú: Luôn sử dụng `npm install` để đảm bảo tính nhất quán của `package-lock.json`.*

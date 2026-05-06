# Kiến thức: Ưu tiên sử dụng Interface thay vì Implementation (Programming to an Interface)

## 1. Khái niệm
Trong Java và Spring Boot, khi một thành phần (Component) phụ thuộc vào một thành phần khác (Service), chúng ta nên khai báo phụ thuộc thông qua **Interface** thay vì lớp triển khai cụ thể (**Concrete Implementation**).

Ví dụ:
- **Nên:** `private final NotificationService notificationService;`
- **Không nên:** `private final NotificationServiceImpl notificationService;`

## 2. Tại sao nên sử dụng Interface?

### 2.1. Loose Coupling (Giảm sự phụ thuộc)
Giúp các thành phần trong hệ thống ít phụ thuộc vào nhau hơn. Lớp gọi (Caller) không cần biết logic bên trong được triển khai như thế nào, nó chỉ quan tâm đến các phương thức mà Interface cung cấp.

### 2.2. Spring AOP & JDK Dynamic Proxies
Spring Framework sử dụng cơ chế Proxy để triển khai các tính năng như `@Transactional`, `@Async`, `@Cacheable`. 
- **JDK Dynamic Proxy:** Yêu cầu đối tượng phải triển khai ít nhất một Interface. Đây là cơ chế mặc định và tối ưu của Spring.
- **CGLIB:** Được sử dụng khi không có Interface, nhưng có thể gây ra vấn đề với các lớp `final` hoặc các phương thức không có constructor mặc định.

### 2.3. Dễ dàng Unit Test (Mocking)
Việc Mock một Interface trong Unit Test đơn giản và sạch sẽ hơn nhiều so với việc Mock một lớp cụ thể. Nó giúp tách biệt hoàn toàn logic của class đang test với các phụ thuộc bên ngoài.

### 2.4. Tính linh hoạt (Flexibility)
Cho phép dễ dàng thay đổi hoặc mở rộng các bản triển khai khác nhau (ví dụ: `EmailNotificationService` và `SmsNotificationService`) mà không làm thay đổi mã nguồn của các lớp sử dụng chúng.

## 3. Quy tắc áp dụng trong dự án BFMS
- Luôn inject **Service Interface** trong Controller và các Service khác.
- Không bao giờ inject trực tiếp các lớp có hậu tố `Impl`.
- Đảm bảo tính nhất quán trên toàn bộ codebase để dễ bảo trì và mở rộng.

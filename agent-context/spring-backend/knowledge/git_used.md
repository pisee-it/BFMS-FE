Hướng dẫn ghi đè nhánh Develop bằng Feature Branch
Sử dụng quy trình này khi bạn muốn nhánh `develop` lấy toàn bộ code mới nhất từ một nhánh feature (ví dụ: `feature/qa`) và chấp nhận ghi đè mọi khác biệt.

Quy trình thực hiện
1. Chuyển sang nhánh develop:

```

git checkout develop

```

2. Ép nhánh develop local giống hệt nhánh feature: Lệnh này sẽ trỏ nhánh develop local vào đúng vị trí commit mới nhất của nhánh feature.

```

git reset --hard feature/qa

```

3. Đẩy lên Server (Force Push): Vì lịch sử đã bị thay đổi, bạn cần dùng lệnh ép để cập nhật server.

```

git push origin develop -f

```


Lưu ý quan trọng
• Lệnh `reset --hard` sẽ xóa sạch các thay đổi chưa commit ở local.

• Lệnh `push -f` sẽ thay đổi lịch sử trên server, cần báo cho các thành viên khác trong team để họ `pull` lại bản mới nhất.

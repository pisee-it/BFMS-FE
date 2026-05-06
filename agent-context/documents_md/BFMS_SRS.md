# DỰ ÁN BFMS Bus Finance Management System
Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) - Phiên bản 1.2

## 1. Giới thiệu hệ thống

### 1.1 Mục đích
Tài liệu này đặc tả các yêu cầu cho hệ thống Quản lý Tài chính Xe buýt (BFMS). Mục tiêu chính là kiểm soát kinh tế đầu vào của xí nghiệp thông qua hai nguồn thu: vé xe (vé lượt, vé tháng) và quảng cáo decal trên thân xe.

### 1.2 Phạm vi dự án
Hệ thống BFMS được phát triển dưới dạng ứng dụng Web toàn diện (Full-stack Web Application), phục vụ đa dạng các tác nhân từ cấp quản lý chiến lược đến nhân sự vận hành thực địa, đảm bảo luồng thông tin tài chính và vận hành xuyên suốt.

## 2. Mô tả tổng quát

### 2.1 Bối cảnh sản phẩm
BFMS là một hệ thống quản trị trung tâm. Hệ thống tự động hóa tính toán doanh thu, thuế và quản lý phân bổ tài nguyên (xe, tuyến, hợp đồng quảng cáo) một cách đồng bộ.

### 2.2 Các tính năng chính
*   Quản lý nguồn thu từ vé (Lượt & Tháng).
*   Quản lý hợp đồng và phân bổ quảng cáo decal trên đầu xe (có xác thực thanh toán).
*   Quản lý vận hành (Tuyến xe, lộ trình, nốt chạy, lượt chạy).
*   Hệ thống báo cáo tài chính đa chiều, có tích hợp tính toán Thuế.

### 2.3 Các tác nhân
| Tác nhân (Actor) | Mô tả trách nhiệm & Quyền hạn |
| :--------------- | :---------------------------- |
| Owner (Chủ doanh nghiệp) | Xem báo cáo tài chính tổng hợp (doanh thu vé, quảng cáo) đã bao gồm các yếu tố về Thuế để đánh giá hiệu quả kinh doanh. |
| Accountant (Kế toán) | Xác nhận tiền thanh toán từ đối tác quảng cáo đã về tài khoản, đảm bảo hợp đồng chính thức có hiệu lực trên hệ thống. |
| Advertising (Người quản lý quảng cáo) | Đại diện làm việc với đối tác, chủ động điền thông tin chi tiết của hợp đồng và tải lên văn bản hợp đồng (file đính kèm/scan) lên hệ thống. |
| Staff (Lái xe & Phụ xe) | Chịu trách nhiệm vận hành và cập nhật số liệu thực tế tại hiện trường: nhập số lượng vé xe bán ra sau mỗi lượt xe chạy. |
| Admin (Quản trị viên) | Thực hiện CRUD thông tin xe buýt, lộ trình, nốt xe (giờ chạy). Nhận thông báo hợp đồng có hiệu lực từ Accountant để tiến hành phân bổ decal quảng cáo lên các xe cụ thể. |

## 3. Yêu cầu chức năng (User Stories)

| Actor | Module | User Story (VI) | Tiêu chí chấp nhận (Acceptance Criteria) |
| :---- | :----- | :-------------- | :--------------------------------------- |
| Owner | Báo cáo | Xem báo cáo tài chính tổng hợp có tính toán Thuế. | Hiển thị tổng doanh thu, các khoản khấu trừ Thuế và lợi nhuận ròng. |
| Staff | Vận hành | Cập nhật số lượng vé sau mỗi lượt xe. | Trạng thái chuyển đổi sang "Hoàn thành"; Doanh thu cập nhật qua Transaction. |
| Advertising | Quảng cáo | Tạo yêu cầu hợp đồng và tải lên file scan hợp đồng. | Hệ thống lưu trữ thông tin đối tác, số lượng xe và link file đính kèm. Trạng thái ban đầu là "Chờ duyệt". |
| Accountant | Quảng cáo | Xác nhận tiền đã về và duyệt hiệu lực hợp đồng. | Đổi trạng thái hợp đồng thành "Có hiệu lực"; Gửi thông báo cho Admin. |
| Admin | Quảng cáo | Phân bổ quảng cáo lên các xe sau khi hợp đồng có hiệu lực. | Chỉ chọn được các xe chưa dán full vị trí; Lưu trạng thái phân bổ. |
| Admin | Hệ thống | CRUD thông tin Tuyến, Xe, Nốt xe. | Lưu trữ đầy đủ thông tin phương tiện và lịch trình chạy dự kiến. |
| ALL | Xác thực | Đăng xuất khỏi hệ thống. | Refresh Token bị hủy bỏ; Phiên làm việc kết thúc an toàn. |

## 4. Kiến trúc & Dữ liệu bổ sung

### 4.1 Cập nhật Data Dictionary
*   **AD_CONTRACT**: Bổ sung trường `contract_file_url` (lưu trữ file do Advertising tải lên), `approval_status` (Chờ duyệt / Đã thanh toán do Accountant quản lý).
*   **ECONOMY_REPORT**: Bổ sung trường `tax_deduction` (Khoản khấu trừ thuế) và `net_profit` (Lợi nhuận ròng sau thuế dành cho Owner).

-- Tài liệu đã được cập nhật theo cấu trúc Tác nhân mới (Phiên bản 1.2) --
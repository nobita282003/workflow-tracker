# NHẬT KÝ PHÁT TRIỂN & BÀN GIAO CÔNG VIỆC - WORKFLOW TRACKER

Nhật ký ghi nhận tiến độ phát triển dự án tính đến cuối phiên làm việc ngày **30/05/2026**. Tài liệu này giúp lập trình viên nắm bắt trạng thái dự án hiện tại và tiếp tục công việc dễ dàng trong phiên làm việc tiếp theo.

---

## 1. TIẾN ĐỘ ĐÃ HOÀN THÀNH (COMPLETED)

### A. Tài Liệu Kiến Trúc & Cấu Trúc Dữ Liệu (Mongoose Models)
* Đã hoàn thiện tài liệu **`ARCHITECTURE.md`** ghi nhận các giải pháp nghiệp vụ của Technical Lead (RBAC+ABAC, Soft Delete, Notification, Indexing AuditLog).
* Đã xây dựng xong **6 Database Models** cốt lõi không chứa comment rác, sử dụng cơ chế Direct Export chuẩn chỉnh:
  1. **`User.js`**: Quản lý người dùng, tự động mã hóa mật khẩu bằng bcrypt.
  2. **`Project.js`**: Quản lý dự án, lưu trữ `managers` và `members` phục vụ bảo mật tài nguyên chéo.
  3. **`Task.js`**: Quản lý công việc với đầy đủ trạng thái vòng đời (To Do, In Progress, In Review, Completed).
  4. **`Comment.js`**: Quản lý bình luận độc lập qua khóa ngoại `taskId` để tránh phình dữ liệu.
  5. **`AuditLog.js`**: Nhật ký lịch sử hệ thống, được đánh chỉ mục (Index) trên `projectId`, `taskId` và `createdAt`.
  6. **`Notification.js`**: Quản lý thông báo người dùng, được đánh chỉ mục trên `recipientId` phục vụ realtime.

### B. Cấu Hình Hệ Thống, Server & Xử Lý Lỗi
* Đã hoàn thành thiết lập điểm khởi chạy **`server.js`** kết nối CSDL MongoDB an toàn, tích hợp CORS và bảo mật HTTP headers.
* Thiết lập hệ thống xử lý lỗi tập trung toàn cục an toàn (`utils/appError.js`, `utils/catchAsync.js`, và `middlewares/errorHandler.js` đăng ký trong `server.js`).
* Tự động chuẩn hóa lỗi từ MongoDB (CastError, Duplicate Key, ValidationError) và lỗi Token JWT (JsonWebTokenError, TokenExpiredError) về dạng JSON chuẩn ở môi trường Production.

### C. Middlewares Bảo Mật & Phân Quyền Đa Tầng (RBAC + ABAC)
* **`middlewares/auth.js`**: Xác thực token JWT, trích xuất người dùng hiện tại an toàn.
* **`middlewares/authorize.js`**:
  * Phân quyền theo vai trò chính `restrictTo` (RBAC).
  * Phân quyền theo sở hữu tài nguyên `canManageProject` và `canManageTask` (ABAC). Bảo vệ tuyệt đối tài nguyên giữa các Manager và Member.

### D. Hệ Thống Router Định Phiên Bản API (Versioning Router)
* Triển khai cấu trúc routing phiên bản chuyên nghiệp `/api/v1/...` giúp hệ thống tương thích ngược và dễ mở rộng.
* Thiết lập các file định tuyến riêng biệt: `auth.routes.js`, `project.routes.js`, `task.routes.js`, `comment.routes.js`, `auditLog.routes.js` gộp chung tại `routes/v1/index.js`.

### E. Các API Controllers Cốt Lõi (Core Controllers)
* **`auth.controller.js`**: Xử lý luồng Đăng ký (Signup) và Đăng nhập (Login), phát hành Token JWT và ẩn mật khẩu trong dữ liệu phản hồi.
* **`project.controller.js`**: CRUD dự án tích hợp cơ chế lọc bảo mật (chỉ thấy dự án mình tham gia) và xóa mềm (Soft Delete).
* **`task.controller.js`**: CRUD công việc và đặc biệt xử lý **Rejection Flow** (khi bị Reject sẽ bắt buộc nhập lý do, tự động lưu Comment lý do, ghi nhật ký AuditLog và chuyển trạng thái ngược lại về In Progress).
* **`comment.controller.js`**: Cho phép bình luận trên task, phân quyền sửa/xóa cho tác giả và Manager quản trị dự án kiểm duyệt.
* **`auditLog.controller.js`**: Truy vấn lịch sử biến động dữ liệu theo từng Dự án hoặc Task cụ thể (tối ưu hóa tốc độ nhờ Database Index).

---

## 2. TRẠNG THÁI HIỆN TẠI (CURRENT STATE)
* **Database & Models:** Hoạt động hoàn hảo và đồng bộ.
* **Middlewares & Error Handlers:** Sẵn sàng kiểm soát bảo mật và lỗi cho toàn bộ API.
* **API Endpoints:** Đã định nghĩa và liên kết đầy đủ tất cả các routes cốt lõi của hệ thống backend.

---

## 3. KẾ HOẠCH CHO PHIÊN LÀM VIỆC TIẾP THEO (NEXT STEPS)
* Tích hợp hệ thống thông báo thời gian thực (Realtime Notification) sử dụng **Socket.io** và gửi thông báo qua **Email** (sử dụng Nodemailer) cho các sự kiện quan trọng (như được giao task mới, task bị từ chối, đến hạn chót).
* Viết bộ tài liệu hướng dẫn kiểm thử các API bằng Postman hoặc Swagger để chuẩn bị bàn giao cho đội Frontend.

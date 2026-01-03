# 🚛 CITA Logistics - Hệ thống Quản lý Vận chuyển & Kho hàng

**CITA Logistics** là giải pháp phần mềm toàn diện dành cho các doanh nghiệp vận tải vừa và nhỏ, hỗ trợ quản lý quy trình từ đặt hàng, điều phối vận chuyển đến quản lý kho bãi và báo cáo doanh thu.

---

## 🌟 Tính năng chính

* **Quản lý Đơn hàng:** Tạo, sửa, hủy và theo dõi trạng thái đơn hàng (Đã tạo -> Đang vận chuyển -> Giao thành công).
* **Quản lý Kho hàng:** Nhập kho, Xuất kho và Kiểm tra tồn kho thời gian thực.
* **Quản lý Tài khoản:** Phân quyền Quản trị viên (Admin) và Khách hàng (Customer).
* **Báo cáo Thống kê:** Biểu đồ doanh thu trực quan, phân tách doanh thu thực nhận và công nợ COD.

---

## 🛠️ Công nghệ sử dụng

* **Frontend:** ReactJS (Vite)
* **Backend:** Node.js + Express
* **Database:** MySQL 8.0
* **DevOps:** Docker & Docker Compose

---

## 🚀 Hướng dẫn Cài đặt & Chạy (Sử dụng Docker)

Dự án đã được đóng gói hoàn chỉnh theo tiêu chuẩn DevOps. Bạn không cần cài đặt Node.js hay MySQL trên máy, chỉ cần **Docker Desktop**.

### Bước 1: Chuẩn bị
Đảm bảo bạn đã cài đặt **Docker Desktop** và nó đang hoạt động (icon cá voi xanh/thuyền).

### Bước 2: Tải dự án
Clone repository này về máy tính hoặc tải file nén về giải nén:

```bash
git clone https://github.com/ttrang-2005/logistics-management-system.git
cd cita-logistics
```

### Bước 3: Chạy ứng dụng
Mở Terminal tại thư mục gốc của dự án (nơi có file `docker-compose.yml`) và chạy lệnh:

```bash
docker-compose up --build
```

> **Lưu ý:** Lần đầu chạy sẽ mất vài phút để Docker tải thư viện và khởi tạo Database.
> Khi thấy thông báo trên Terminal: `Server đang chạy cổng 8081...` và `ready for connections`, hệ thống đã sẵn sàng.

### Bước 4: Truy cập

* 👉 **Trang web (Frontend):** [http://localhost:3000](http://localhost:3000)
* 👉 **API Server (Backend):** [http://localhost:8081](http://localhost:8081)

---

## 🔐 Tài khoản Demo

Dưới đây là các tài khoản có sẵn trong hệ thống để bạn kiểm thử (Dữ liệu từ `db.sql`):

| Vai trò | Tên đăng nhập | Mật khẩu | Chức năng truy cập |
| :--- | :--- | :--- | :--- |
| **Quản trị viên** | `admin` | `123456` | Toàn quyền (Kho, Duyệt đơn, Báo cáo) |
| **Khách hàng** | `nguyenvana` | `123456` | Đặt hàng, Xem lịch sử đơn |
| **Khách hàng** | `tranthib` | `123456` | Đặt hàng, Xem lịch sử đơn |

---

## 📂 Cấu trúc dự án

```plaintext
cita-logistics/
├── client/                 # Frontend (React + Vite)
│   ├── src/                # Mã nguồn React (Giao diện)
│   ├── nginx.conf          # Cấu hình Web Server Nginx
│   └── Dockerfile          # Cấu hình đóng gói Client
├── server/                 # Backend (Node.js + Express)
│   ├── db.js               # Kết nối Database (Connection Pool)
│   ├── index.js            # API Endpoints (Xử lý Logic)
│   └── Dockerfile          # Cấu hình đóng gói Server
├── db.sql                  # Script tạo bảng & Dữ liệu mẫu (Seed Data)
├── docker-compose.yml      # File cấu hình chạy toàn bộ hệ thống
└── README.md               # Hướng dẫn sử dụng
```

---

## ❓ Xử lý lỗi thường gặp (Troubleshooting)

**1. Làm sao để xóa sạch dữ liệu và chạy lại từ đầu?**
Nếu bạn muốn reset database về trạng thái ban đầu hoặc bị lỗi dữ liệu, hãy chạy lệnh sau để xóa sạch Volume:

```bash
docker-compose down -v
docker-compose up --build
```
*(Tham số `-v` rất quan trọng để xóa dữ liệu cũ trong Docker).*

**2. Lỗi font chữ tiếng Việt (bị lỗi ký tự lạ)?**
Dự án đã được cấu hình `utf8mb4`. Nếu vẫn bị lỗi hiển thị, hãy thực hiện lại mục 1 (xóa sạch dữ liệu cũ) để Docker nạp lại bảng mã mới.

**3. Lỗi "Port is already allocated"?**
Nếu báo lỗi cổng `3000` hoặc `8081` đã được sử dụng, hãy tắt các ứng dụng khác đang chạy trên cổng này, hoặc sửa file `docker-compose.yml` (ví dụ: đổi `"3000:80"` thành `"3001:80"`).

---

## 👨‍💻 Tác giả

Sinh viên thực hiện:
* **A47324 Phạm Linh Chi**
* **A48872 Lê Thị Thu Trang**

Trường: **Đại học Thăng Long**
Đồ án: **Web Quản lý và Vận chuyển Hàng hóa**

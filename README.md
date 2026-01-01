# 🚛 CITA Logistics - Hệ thống Quản lý Vận chuyển & Kho hàng

[cite_start]**CITA Logistics** là giải pháp phần mềm toàn diện dành cho các doanh nghiệp vận tải vừa và nhỏ, hỗ trợ quản lý quy trình từ đặt hàng, điều phối vận chuyển đến quản lý kho bãi và báo cáo doanh thu [cite: 11-21].

![Tech Stack](https://skillicons.dev/icons?i=react,nodejs,express,mysql,docker,vite)

---

## 🌟 Tính năng chính

* [cite_start]**Quản lý Đơn hàng:** Tạo, sửa, hủy và theo dõi trạng thái đơn hàng (Đã tạo -> Đang vận chuyển -> Giao thành công)[cite: 122, 127].
* [cite_start]**Quản lý Kho hàng:** Nhập kho, Xuất kho và Kiểm tra tồn kho thời gian thực[cite: 121].
* [cite_start]**Quản lý Tài khoản:** Phân quyền Quản trị viên (Admin) và Khách hàng (Customer) [cite: 124-126].
* [cite_start]**Báo cáo Thống kê:** Biểu đồ doanh thu trực quan, phân tách doanh thu thực nhận và công nợ COD[cite: 123].

---

## 🛠️ Công nghệ sử dụng

* [cite_start]**Frontend:** ReactJS (Vite) [cite: 104-106]
* [cite_start]**Backend:** Node.js + Express [cite: 107-109]
* [cite_start]**Database:** MySQL 8.0 [cite: 110-111]
* [cite_start]**DevOps:** Docker & Docker Compose [cite: 112-113]

---

## 🚀 Hướng dẫn Cài đặt & Chạy (Sử dụng Docker)

Dự án đã được đóng gói hoàn chỉnh theo tiêu chuẩn DevOps. [cite_start]Bạn không cần cài đặt Node.js hay MySQL trên máy, chỉ cần **Docker Desktop** [cite: 227-233].

### Bước 1: Chuẩn bị
Đảm bảo bạn đã cài đặt **Docker Desktop** và nó đang hoạt động (icon cá voi xanh/thuyền).

### Bước 2: Tải dự án
Clone repository này về máy tính hoặc tải file nén về giải nén:
```bash
git clone [https://github.com/Ten-Cua-Ban/cita-logistics.git](https://github.com/Ten-Cua-Ban/cita-logistics.git)
cd cita-logistics

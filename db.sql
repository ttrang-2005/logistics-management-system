SET NAMES 'utf8mb4';
DROP DATABASE IF EXISTS cita_logistics;
CREATE DATABASE cita_logistics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cita_logistics;

-- 1. Bảng Users (Người dùng)
CREATE TABLE Users (
    UserID VARCHAR(50) PRIMARY KEY,
    UserName VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Email VARCHAR(100),
    PhoneNum VARCHAR(15) NOT NULL,
    Address NVARCHAR(200),
    Role VARCHAR(20) NOT NULL -- 'ADMIN' hoặc 'CUSTOMER'
);

-- 2. Bảng Orders (Đơn hàng - Đã XÓA DriverID)
CREATE TABLE Orders (
    OrderID VARCHAR(50) PRIMARY KEY,
    CustomerID VARCHAR(50),
    
    -- Thông tin người gửi
    SenderName NVARCHAR(100),
    SenderPhone VARCHAR(15),
    SenderAddress NVARCHAR(200),
    SenderDistrict NVARCHAR(100), 
    SenderWard NVARCHAR(100),     
    
    -- Thông tin người nhận
    ReceiverName NVARCHAR(100),
    ReceiverPhone VARCHAR(15),
    ReceiverAddress NVARCHAR(200),
    ReceiverDistrict NVARCHAR(100),
    ReceiverWard NVARCHAR(100),     
    
    -- Thông tin hàng hóa & Thanh toán
    ProductName NVARCHAR(200), 
    Weight FLOAT, 
    Status NVARCHAR(50) DEFAULT 'Đã tạo đơn',
    TotalAmount FLOAT,
    PaymentMethod NVARCHAR(50),     
    
    OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP, 
    
    FOREIGN KEY (CustomerID) REFERENCES Users(UserID)
);

-- =======================================================
-- DỮ LIỆU MẪU (SEED DATA)
-- =======================================================

-- 1. Dữ liệu bảng Users (1 Admin + 9 Khách hàng)
INSERT INTO Users (UserID, UserName, Password, Name, Email, PhoneNum, Address, Role) VALUES 
('ADMIN01', 'admin', '123456', 'Quản Trị Viên', 'admin@cita.com', '0900000000', 'Trụ sở chính CITA', 'ADMIN'),
('USER01', 'nguyenvana', '123456', 'Nguyễn Văn A', 'a@gmail.com', '0912345678', '123 Xuân Thủy, Cầu Giấy', 'CUSTOMER'),
('USER02', 'tranthib', '123456', 'Trần Thị B', 'b@gmail.com', '0987654321', '45 Hàng Bài, Hoàn Kiếm', 'CUSTOMER'),
('USER03', 'lethic', '123456', 'Lê Thị C', 'c@gmail.com', '0911223344', '10 Nguyễn Trãi, Thanh Xuân', 'CUSTOMER'),
('USER04', 'phamvand', '123456', 'Phạm Văn D', 'd@gmail.com', '0922334455', 'KĐT Ciputra, Tây Hồ', 'CUSTOMER'),
('USER05', 'hoangthie', '123456', 'Hoàng Thị E', 'e@gmail.com', '0933445566', '88 Láng Hạ, Đống Đa', 'CUSTOMER'),
('USER06', 'vuvant', '123456', 'Vũ Văn T', 't@gmail.com', '0944556677', 'Times City, Hai Bà Trưng', 'CUSTOMER'),
('USER07', 'dangthih', '123456', 'Đặng Thị H', 'h@gmail.com', '0955667788', 'Vinhome Riverside, Long Biên', 'CUSTOMER'),
('USER08', 'buivank', '123456', 'Bùi Văn K', 'k@gmail.com', '0966778899', 'Hồ Gươm Plaza, Hà Đông', 'CUSTOMER'),
('USER09', 'dothim', '123456', 'Đỗ Thị M', 'm@gmail.com', '0977889900', 'Mỹ Đình, Nam Từ Liêm', 'CUSTOMER');

-- 2. Dữ liệu bảng Orders (10 Đơn hàng - Không còn thông tin tài xế)
INSERT INTO Orders (OrderID, CustomerID, SenderName, SenderPhone, SenderAddress, SenderDistrict, SenderWard, ReceiverName, ReceiverPhone, ReceiverAddress, ReceiverDistrict, ReceiverWard, ProductName, Weight, Status, TotalAmount, PaymentMethod, OrderDate) 
VALUES 
-- Đơn 1
('DH001', 'USER01', 'Nguyễn Văn A', '0912345678', '123 Xuân Thủy', 'Cầu Giấy', 'Dịch Vọng', 'Trần Thị B', '0987654321', '456 Láng', 'Đống Đa', 'Láng Thượng', '[Tài liệu] Hồ sơ xin việc', 0.5, 'Đã tạo đơn', 30000, 'COD', '2023-10-25 08:30:00'),

-- Đơn 2
('CITA002', 'USER02', 'Trần Thị B', '0987654321', '45 Hàng Bài', 'Hoàn Kiếm', 'Tràng Tiền', 'Lê Văn C', '0911223344', '10 Nguyễn Trãi', 'Thanh Xuân', 'Thanh Xuân Trung', '[Quần áo] Váy thiết kế', 1.2, 'Đang vận chuyển', 45000, 'Banking', '2023-10-26 09:00:00'),

-- Đơn 3
('CITA003', 'USER03', 'Lê Thị C', '0911223344', '10 Nguyễn Trãi', 'Thanh Xuân', 'Thanh Xuân Bắc', 'Phạm Văn D', '0922334455', 'KĐT Ciputra', 'Tây Hồ', 'Xuân La', '[Đồ điện tử] Laptop Dell', 2.5, 'Giao thành công', 150000, 'Momo', '2023-10-24 10:15:00'),

-- Đơn 4
('CITA004', 'USER04', 'Phạm Văn D', '0922334455', 'KĐT Ciputra', 'Tây Hồ', 'Phú Thượng', 'Hoàng Thị E', '0933445566', '88 Láng Hạ', 'Đống Đa', 'Láng Hạ', '[Thực phẩm] Hoa quả sạch', 5.0, 'Giao thất bại', 75000, 'COD', '2023-10-26 11:30:00'),

-- Đơn 5
('CITA005', 'USER01', 'Nguyễn Văn A', '0912345678', '123 Xuân Thủy', 'Cầu Giấy', 'Dịch Vọng Hậu', 'Vũ Văn T', '0944556677', 'Times City', 'Hai Bà Trưng', 'Vĩnh Tuy', '[Hàng dễ vỡ] Bộ ấm chén', 3.0, 'Đã hủy', 60000, 'COD', '2023-10-27 14:00:00'),

-- Đơn 6
('CITA006', 'USER05', 'Hoàng Thị E', '0933445566', '88 Láng Hạ', 'Đống Đa', 'Quốc Tử Giám', 'Đặng Thị H', '0955667788', 'Vinhome Riverside', 'Long Biên', 'Phúc Lợi', '[Khác] Ghế văn phòng', 10.0, 'Đang vận chuyển', 200000, 'Banking', '2023-10-27 15:45:00'),

-- Đơn 7
('CITA007', 'USER06', 'Vũ Văn T', '0944556677', 'Times City', 'Hai Bà Trưng', 'Minh Khai', 'Bùi Văn K', '0966778899', 'Hồ Gươm Plaza', 'Hà Đông', 'Mộ Lao', '[Tài liệu] Hợp đồng kinh tế', 0.2, 'Đã tạo đơn', 25000, 'Momo', '2023-10-28 08:00:00'),

-- Đơn 8
('CITA008', 'USER07', 'Đặng Thị H', '0955667788', 'Vinhome Riverside', 'Long Biên', 'Việt Hưng', 'Đỗ Thị M', '0977889900', 'Mỹ Đình', 'Nam Từ Liêm', 'Mỹ Đình 1', '[Quần áo] Áo khoác mùa đông', 1.5, 'Giao thành công', 50000, 'COD', '2023-10-23 16:20:00'),

-- Đơn 9
('CITA009', 'USER08', 'Bùi Văn K', '0966778899', 'Hồ Gươm Plaza', 'Hà Đông', 'Văn Quán', 'Nguyễn Văn A', '0912345678', '123 Xuân Thủy', 'Cầu Giấy', 'Mai Dịch', '[Thực phẩm] Bánh kẹo', 2.0, 'Đang vận chuyển', 40000, 'COD', '2023-10-28 09:30:00'),

-- Đơn 10
('CITA010', 'USER09', 'Đỗ Thị M', '0977889900', 'Mỹ Đình', 'Nam Từ Liêm', 'Cầu Diễn', 'Trần Thị B', '0987654321', '45 Hàng Bài', 'Hoàn Kiếm', 'Hàng Bài', '[Đồ điện tử] Tai nghe Bluetooth', 0.3, 'Đã tạo đơn', 35000, 'Banking', '2023-10-28 10:45:00');

-- 1. Tạo bảng Kho hàng (Chỉ cần 1 kho chính cho đơn giản)
CREATE TABLE Warehouse (
    WarehouseID VARCHAR(20) PRIMARY KEY,
    WarehouseName NVARCHAR(100),
    Address NVARCHAR(200),
    Capacity INT -- Sức chứa
);

-- 2. Tạo bảng Sản phẩm (Lưu trữ hàng hóa trong kho)
CREATE TABLE Products (
    ProductID VARCHAR(20) PRIMARY KEY,
    ProductName NVARCHAR(100) NOT NULL,
    WarehouseID VARCHAR(20),
    Price FLOAT NOT NULL,
    QuantityInStock INT DEFAULT 0,
    Location VARCHAR(50), -- Vị trí kệ hàng (Ví dụ: Kệ A1, Kệ B2)
    FOREIGN KEY (WarehouseID) REFERENCES Warehouse(WarehouseID)
);

-- 3. Dữ liệu mẫu
INSERT INTO Warehouse (WarehouseID, WarehouseName, Address, Capacity) 
VALUES ('WH01', 'Kho Tổng CITA Hà Nội', '123 Láng Hòa Lạc', 10000);

INSERT INTO Products (ProductID, ProductName, WarehouseID, Price, QuantityInStock, Location) VALUES 
('SP001', 'Thùng Carton Lớn', 'WH01', 15000, 500, 'Kệ A-01'),
('SP002', 'Băng dính đóng hàng', 'WH01', 20000, 200, 'Kệ A-02'),
('SP003', 'Màng xốp hơi (Cuộn)', 'WH01', 150000, 50, 'Kệ B-01'),
('SP004', 'Tem in vận đơn', 'WH01', 50000, 1000, 'Kệ C-01');

CREATE TABLE WarehouseLogs (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID VARCHAR(20),
    ProductName NVARCHAR(100),
    ActionType NVARCHAR(20), -- 'Nhập kho' hoặc 'Xuất kho'
    Quantity INT,
    LogDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Note NVARCHAR(200), -- Ghi chú (VD: Nhập hàng mới, Xuất cho đơn hàng...)
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- 2. Thêm vài dữ liệu mẫu lịch sử
INSERT INTO WarehouseLogs (ProductID, ProductName, ActionType, Quantity, Note) 
VALUES ('SP001', 'Thùng Carton Lớn', 'Nhập kho', 500, 'Nhập hàng lần đầu');
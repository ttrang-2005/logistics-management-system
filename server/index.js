const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- AUTH ---
app.post('/api/register', (req, res) => {
    const { username, password, name, email, phone, address } = req.body;
    const userId = 'U' + Date.now(); 
    const sql = "INSERT INTO Users (UserID, UserName, Password, Name, Email, PhoneNum, Address, Role) VALUES (?, ?, ?, ?, ?, ?, ?, 'CUSTOMER')";
    db.query(sql, [userId, username, password, name, email, phone, address], (err, result) => {
        if(err) return res.json({Error: "Lỗi đăng ký"});
        return res.json({Status: "Success"});
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM Users WHERE UserName = ? AND Password = ?";
    db.query(sql, [username, password], (err, data) => {
        if(err) return res.json({Error: "Lỗi Server"});
        if(data.length > 0) return res.json({Status: "Success", Role: data[0].Role, UserID: data[0].UserID, Name: data[0].Name});
        return res.json({Error: "Sai thông tin đăng nhập"});
    });
});

// --- ORDERS (CẬP NHẬT: THÊM BỘ LỌC STATUS) ---
app.get('/api/orders', (req, res) => {
    const { userId, role, search, status } = req.query; // Thêm tham số status
    let sql = "SELECT * FROM Orders WHERE 1=1"; // Dùng 1=1 để dễ nối chuỗi điều kiện
    let params = [];

    if (role === 'CUSTOMER') {
        sql += " AND CustomerID = ?";
        params.push(userId);
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (search) {
        sql += " AND (OrderID LIKE ? OR ReceiverName LIKE ? OR ReceiverPhone LIKE ?)";
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Lọc theo trạng thái đơn hàng (Mới thêm)
    if (status && status !== 'All') {
        sql += " AND Status = ?";
        params.push(status);
    }

    sql += " ORDER BY OrderDate DESC";

    db.query(sql, params, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
});

app.get('/api/orders/:id', (req, res) => {
    const sql = "SELECT * FROM Orders WHERE OrderID = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if(err) return res.json({Error: "Lỗi"});
        if(data.length > 0) return res.json(data[0]);
        return res.json({Error: "Không tìm thấy"});
    });
});

// --- TẠO ĐƠN ---
app.post('/api/create-order', (req, res) => {
    const { 
        customerID, senderName, senderPhone, senderAddress, senderDistrict, senderWard,
        receiverName, receiverPhone, receiverAddress, receiverDistrict, receiverWard, 
        productName, weight, orderType 
    } = req.body;

    const sqlGetLastID = "SELECT OrderID FROM Orders WHERE OrderID LIKE 'CITA%' ORDER BY LENGTH(OrderID) DESC, OrderID DESC LIMIT 1";

    db.query(sqlGetLastID, (err, data) => {
        if (err) return res.json({Error: "Lỗi lấy mã đơn hàng"});

        let newOrderID = 'CITA001';
        if (data.length > 0) {
            const lastID = data[0].OrderID; 
            const numberPart = parseInt(lastID.replace('CITA', '')); 
            if (!isNaN(numberPart)) {
                newOrderID = 'CITA' + String(numberPart + 1).padStart(3, '0');
            }
        }

        const sqlInsert = `INSERT INTO Orders 
        (OrderID, CustomerID, 
         SenderName, SenderPhone, SenderAddress, SenderDistrict, SenderWard,
         ReceiverName, ReceiverPhone, ReceiverAddress, ReceiverDistrict, ReceiverWard,
         ProductName, Weight, Status, TotalAmount, PaymentMethod, OrderDate) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Chờ thanh toán', 0, NULL, NOW())`;

        const finalProductName = `[${orderType}] ${productName}`;

        db.query(sqlInsert, [
            newOrderID, customerID, 
            senderName, senderPhone, senderAddress, senderDistrict, senderWard,
            receiverName, receiverPhone, receiverAddress, receiverDistrict, receiverWard,
            finalProductName, weight
        ], (insertErr, result) => {
            if(insertErr) return res.json({Error: "Lỗi tạo đơn"});
            return res.json({Status: "Success", OrderID: newOrderID});
        });
    });
});

// --- THANH TOÁN ---
app.put('/api/confirm-payment', (req, res) => {
    const { orderId, totalAmount, paymentMethod } = req.body;
    const sql = "UPDATE Orders SET TotalAmount = ?, PaymentMethod = ?, Status = 'Đã tạo đơn' WHERE OrderID = ?";
    db.query(sql, [totalAmount, paymentMethod, orderId], (err, result) => {
        if(err) return res.json({Error: "Lỗi thanh toán"});
        return res.json({Status: "Success"});
    });
});

// --- CẬP NHẬT TRẠNG THÁI (ADMIN) ---
app.put('/api/orders/status/:id', (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    const sqlUpdateOrder = "UPDATE Orders SET Status = ? WHERE OrderID = ?";
    
    db.query(sqlUpdateOrder, [status, orderId], (err, result) => {
        if(err) return res.json({Error: "Lỗi cập nhật"});
        return res.json({Status: "Success"});
    });
});

// --- CUSTOMERS & REPORTS ---
app.get('/api/users/customers', (req, res) => {
    const sql = "SELECT * FROM Users WHERE Role = 'CUSTOMER'";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
});

app.get('/api/admin/orders/:customerId', (req, res) => {
    const customerId = req.params.customerId;
    const sql = "SELECT * FROM Orders WHERE CustomerID = ? ORDER BY OrderDate DESC";
    db.query(sql, [customerId], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
});

app.get('/api/report/revenue-details', (req, res) => {
    const sql = `
        SELECT 
            -- 1. Tiền Đã Nhận (Realized Revenue)
            -- Bao gồm: Đơn thanh toán trước (Banking/Momo) HOẶC Đơn COD đã giao thành công
            SUM(CASE 
                WHEN (PaymentMethod IN ('Banking', 'Momo') AND Status != 'Đã hủy') 
                  OR (PaymentMethod = 'COD' AND Status = 'Giao thành công') 
                THEN TotalAmount 
                ELSE 0 
            END) as TotalReceived,

            -- 2. Tiền Chờ Nhận (Pending Revenue)
            -- Chỉ tính đơn COD đang xử lý (Chưa giao xong)
            SUM(CASE 
                WHEN PaymentMethod = 'COD' AND Status IN ('Đã tạo đơn', 'Đang vận chuyển') 
                THEN TotalAmount 
                ELSE 0 
            END) as TotalPending,

            -- Tổng số đơn hàng (Không tính đơn hủy)
            COUNT(CASE WHEN Status != 'Đã hủy' THEN 1 END) as TotalOrders
        FROM Orders
    `;
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data[0]);
    });
});

// --- QUẢN LÝ KHO HÀNG (WAREHOUSE) ---

// 1. Xem danh sách tồn kho
app.get('/api/warehouse/products', (req, res) => {
    const sql = "SELECT * FROM Products ORDER BY QuantityInStock ASC"; 
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
});

// 2. Xem lịch sử kho (MỚI)
app.get('/api/warehouse/logs', (req, res) => {
    const sql = "SELECT * FROM WarehouseLogs ORDER BY LogDate DESC";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
});

// 3. Nhập kho (Cập nhật: GHI LOG)
app.post('/api/warehouse/import', (req, res) => {
    const { productId, productName, price, quantity, location } = req.body;
    
    // Câu lệnh ghi log nhập kho
    const logSql = "INSERT INTO WarehouseLogs (ProductID, ProductName, ActionType, Quantity, Note) VALUES (?, ?, 'Nhập kho', ?, 'Nhập hàng thủ công')";

    const checkSql = "SELECT * FROM Products WHERE ProductID = ?";
    db.query(checkSql, [productId], (err, data) => {
        if(err) return res.json({Error: "Lỗi kiểm tra"});

        if(data.length > 0) {
            // Cập nhật số lượng
            const updateSql = "UPDATE Products SET QuantityInStock = QuantityInStock + ? WHERE ProductID = ?";
            db.query(updateSql, [quantity, productId], (err2, result) => {
                if(err2) return res.json({Error: "Lỗi cập nhật kho"});
                
                // Ghi log sau khi update thành công
                db.query(logSql, [productId, data[0].ProductName, quantity]); 
                return res.json({Status: "Success", Message: "Đã cộng thêm số lượng vào kho"});
            });
        } else {
            // Thêm mới
            const insertSql = "INSERT INTO Products (ProductID, ProductName, WarehouseID, Price, QuantityInStock, Location) VALUES (?, ?, 'WH01', ?, ?, ?)";
            db.query(insertSql, [productId, productName, price, quantity, location], (err3, result) => {
                if(err3) return res.json({Error: "Lỗi thêm mới sản phẩm"});
                
                // Ghi log sau khi insert thành công
                db.query(logSql, [productId, productName, quantity]);
                return res.json({Status: "Success", Message: "Đã thêm sản phẩm mới vào kho"});
            });
        }
    });
});

// 4. Xuất kho (Cập nhật: GHI LOG)
app.post('/api/warehouse/export', (req, res) => {
    const { productId, quantity } = req.body;

    const checkSql = "SELECT * FROM Products WHERE ProductID = ?";
    db.query(checkSql, [productId], (err, data) => {
        if(err) return res.json({Error: "Lỗi kiểm tra"});
        if(data.length === 0) return res.json({Error: "Sản phẩm không tồn tại"});

        const currentStock = data[0].QuantityInStock;
        if(currentStock < quantity) {
            return res.json({Error: `Không đủ hàng! Tồn kho chỉ còn ${currentStock}`});
        }

        // Thực hiện trừ kho
        const updateSql = "UPDATE Products SET QuantityInStock = QuantityInStock - ? WHERE ProductID = ?";
        db.query(updateSql, [quantity, productId], (err2, result) => {
            if(err2) return res.json({Error: "Lỗi xuất kho"});
            
            // Ghi log xuất kho
            const logSql = "INSERT INTO WarehouseLogs (ProductID, ProductName, ActionType, Quantity, Note) VALUES (?, ?, 'Xuất kho', ?, 'Xuất hàng thủ công')";
            db.query(logSql, [productId, data[0].ProductName, quantity]);

            return res.json({Status: "Success"});
        });
    });
});
app.get('/', (req, res) => {
    res.json("Hello from CITA Logistics Backend!");
});
app.listen(8081, () => {
    console.log("Server đang chạy cổng 8081...");
});
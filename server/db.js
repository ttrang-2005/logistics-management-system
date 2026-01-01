const mysql = require('mysql');

// Sử dụng Pool để tự động quản lý kết nối và thử lại khi thất bại
const db = mysql.createPool({
    connectionLimit: 10, // Số lượng kết nối tối đa
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "cita_logistics",
    port: process.env.DB_PORT || 3306,
    charset: 'utf8mb4'
});

// Kiểm tra thử kết nối (chỉ để log ra màn hình cho bạn biết)
db.getConnection((err, connection) => {
    if (err) {
        console.error('⚠️ Database chưa sẵn sàng lúc khởi động (Server vẫn sẽ chạy và tự kết nối lại sau):', err.code);
    } else {
        console.log('✅ Đã kết nối Database thành công!');
        connection.release(); // Trả kết nối về hồ
    }
});

module.exports = db;
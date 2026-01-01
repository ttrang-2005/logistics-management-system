import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchOrders = (search = '') => {
        if (!user) return;
        axios.get(`http://localhost:8081/api/orders?userId=${user.UserID}&role=CUSTOMER&search=${search}`)
            .then(res => setOrders(res.data))
            .catch(err => toast.error("Không tải được đơn hàng"));
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = (orderId) => {
        if(window.confirm(`Bạn có chắc muốn hủy đơn hàng ${orderId} không?`)) {
            axios.put(`http://localhost:8081/api/orders/status/${orderId}`, { status: 'Đã hủy' })
                .then(res => {
                    if(res.data.Status === "Success") {
                        toast.success(`Đã hủy đơn hàng ${orderId} thành công!`);
                        fetchOrders();
                    } else {
                        toast.error("Lỗi khi hủy đơn");
                    }
                });
        }
    }

    const getStatusBadge = (status) => {
        if(status === 'Giao thành công') return 'bg-success';
        if(status === 'Giao thất bại' || status === 'Đã hủy') return 'bg-danger';
        if(status === 'Đang vận chuyển') return 'bg-primary';
        return 'bg-warning text-dark';
    }

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />
            
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-primary fw-bold">📦 Lịch Sử Đơn Hàng Của Bạn</h2>
                    <div className="d-flex">
                        <input type="text" className="form-control me-2" placeholder="Tìm mã vận đơn..." 
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                        <button className="btn btn-primary" onClick={() => fetchOrders(searchTerm)}>Tìm</button>
                    </div>
                </div>

                <div className="card shadow-sm border-0">
                    <div className="card-body p-0">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-primary text-uppercase small">
                                <tr>
                                    <th>Mã VĐ</th>
                                    <th>Người Nhận</th>
                                    <th>Hàng Hóa</th>
                                    <th>Tổng Tiền</th>
                                    <th>Trạng Thái</th>
                                    <th>Ngày Tạo</th>
                                    <th>Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? orders.map((order, index) => (
                                    <tr key={index}>
                                        <td className="fw-bold text-primary">{order.OrderID}</td>
                                        <td>
                                            <div className="fw-bold">{order.ReceiverName}</div>
                                            <small className="text-muted">{order.ReceiverAddress}</small>
                                        </td>
                                        <td>
                                            <div>{order.ProductName}</div>
                                            <small className="text-muted">{order.Weight} kg</small>
                                        </td>
                                        <td className="fw-bold text-danger">{order.TotalAmount?.toLocaleString()}đ</td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(order.Status)}`}>
                                                {order.Status}
                                            </span>
                                        </td>
                                        <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
                                        <td>
                                            {order.Status === 'Đã tạo đơn' ? (
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancelOrder(order.OrderID)}>
                                                    Hủy đơn
                                                </button>
                                            ) : (
                                                <span className="text-muted small">Không thể hủy</span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5">
                                            <div className="text-muted mb-3">Bạn chưa có đơn hàng nào</div>
                                            <Link to="/create-order" className="btn btn-primary">Tạo đơn ngay</Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
export default OrderHistory;
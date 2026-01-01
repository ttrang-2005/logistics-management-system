import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]); 
    const [products, setProducts] = useState([]); 
    const [warehouseLogs, setWarehouseLogs] = useState([]); 
    
    // State báo cáo cập nhật theo logic mới
    const [report, setReport] = useState({ TotalReceived: 0, TotalPending: 0, TotalOrders: 0 });
    
    const [activeTab, setActiveTab] = useState('orders');
    const [warehouseTab, setWarehouseTab] = useState('stock');
    
    // Bộ lọc & Tìm kiếm
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal & Form Kho
    const [showImportModal, setShowImportModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [warehouseForm, setWarehouseForm] = useState({ productId: '', productName: '', price: '', quantity: '', location: '' });

    const [selectedCustomer, setSelectedCustomer] = useState(null); 
    const [customerOrders, setCustomerOrders] = useState([]); 
    
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchData();
    }, [filterStatus]); 

    const fetchData = () => {
        // 1. Lấy đơn hàng
        axios.get(`http://localhost:8081/api/orders?userId=${user.UserID}&role=ADMIN&status=${filterStatus}&search=${searchTerm}`)
            .then(res => {
                if(Array.isArray(res.data)) setOrders(res.data);
            });
        
        // 2. Lấy báo cáo (API mới)
        axios.get('http://localhost:8081/api/report/revenue-details').then(res => setReport(res.data || {}));
        
        // 3. Khách hàng
        axios.get('http://localhost:8081/api/users/customers').then(res => {
            if(Array.isArray(res.data)) setCustomers(res.data);
        });
        
        // 4. Kho hàng
        axios.get('http://localhost:8081/api/warehouse/products').then(res => {
            if(Array.isArray(res.data)) setProducts(res.data);
        });

        // 5. Lịch sử kho
        axios.get('http://localhost:8081/api/warehouse/logs').then(res => {
            if(Array.isArray(res.data)) setWarehouseLogs(res.data);
            else setWarehouseLogs([]); 
        }).catch(() => setWarehouseLogs([]));
    }

    const handleSearchOrder = () => {
        fetchData();
    }

    // --- LOGIC KHO HÀNG ---
    const handleImportStock = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/api/warehouse/import', warehouseForm)
            .then(res => {
                if(res.data.Status === "Success") {
                    toast.success(res.data.Message);
                    setShowImportModal(false);
                    setWarehouseForm({ productId: '', productName: '', price: '', quantity: '', location: '' });
                    fetchData();
                } else {
                    toast.error(res.data.Error);
                }
            });
    }

    const handleExportStock = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/api/warehouse/export', {
            productId: warehouseForm.productId,
            quantity: warehouseForm.quantity
        }).then(res => {
            if(res.data.Status === "Success") {
                toast.success("Xuất kho thành công!");
                setShowExportModal(false);
                setWarehouseForm({ productId: '', productName: '', price: '', quantity: '', location: '' });
                fetchData();
            } else {
                toast.error(res.data.Error);
            }
        });
    }

    const updateStatus = (orderId, newStatus) => {
        axios.put(`http://localhost:8081/api/orders/status/${orderId}`, { status: newStatus })
            .then(res => {
                if(res.data.Status === "Success") {
                    toast.success("Cập nhật trạng thái thành công!");
                    fetchData();
                }
            });
    }

    const handleViewCustomerHistory = (customer) => {
        setSelectedCustomer(customer);
        axios.get(`http://localhost:8081/api/admin/orders/${customer.UserID}`)
            .then(res => {
                if(Array.isArray(res.data)) setCustomerOrders(res.data);
                else setCustomerOrders([]);
            });
    }

    return (
        <div className="container-fluid">
            <div className="row">
                {/* SIDEBAR */}
                <div className="col-md-2 bg-dark min-vh-100 p-3 text-white d-flex flex-column">
                    <h4 className="text-center mb-4 text-uppercase fw-bold text-warning">CITA Admin</h4>
                    <div className="nav flex-column nav-pills gap-2 flex-grow-1">
                        <button className={`nav-link text-start text-white ${activeTab === 'orders' ? 'active bg-primary' : ''}`} onClick={() => setActiveTab('orders')}>📦 Quản lý Đơn hàng</button>
                        <button className={`nav-link text-start text-white ${activeTab === 'warehouse' ? 'active bg-primary' : ''}`} onClick={() => setActiveTab('warehouse')}>🏭 Kho bãi & Hàng tồn</button>
                        <button className={`nav-link text-start text-white ${activeTab === 'customers' ? 'active bg-primary' : ''}`} onClick={() => setActiveTab('customers')}>👥 Khách hàng</button>
                        <button className={`nav-link text-start text-white ${activeTab === 'revenue' ? 'active bg-success' : 'bg-secondary'}`} onClick={() => setActiveTab('revenue')}>📊 Báo Cáo Doanh Thu</button>
                    </div>
                    <button className="btn btn-danger w-100 mt-3" onClick={()=>{localStorage.removeItem('user'); navigate('/');}}>Đăng xuất</button>
                </div>

                {/* MAIN CONTENT */}
                <div className="col-md-10 p-4 bg-light position-relative">
                    
                    {/* TAB BÁO CÁO DOANH THU (GIAO DIỆN MỚI) */}
                    {activeTab === 'revenue' && (
                        <div className="animate__animated animate__fadeIn">
                            <h2 className="mb-4 text-primary fw-bold">📊 Báo Cáo Tài Chính</h2>
                            
                            {/* Card Tổng quan */}
                            <div className="row mb-4">
                                <div className="col-12">
                                    <div className="card bg-primary text-white p-4 shadow border-0 rounded-3 text-center">
                                        <h5 className="opacity-75 text-uppercase letter-spacing-1">Tổng Giá Trị Đơn Hàng (Thực tế + Dự kiến)</h5>
                                        <h1 className="display-3 fw-bold my-2">
                                            {((report.TotalReceived || 0) + (report.TotalPending || 0)).toLocaleString()} <span className="fs-4">VNĐ</span>
                                        </h1>
                                        <p className="mb-0 fs-5"><span className="badge bg-white text-primary rounded-pill px-3">{report.TotalOrders} Đơn hàng</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="row g-4">
                                {/* Card Tiền Đã Nhận (Xanh lá) */}
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm h-100 border-start border-5 border-success">
                                        <div className="card-body text-center p-5">
                                            <div className="display-1 text-success mb-3"><i className="bi bi-check-circle-fill"></i></div>
                                            <h4 className="text-secondary text-uppercase">Doanh thu Thực tế</h4>
                                            <hr className="w-25 mx-auto my-3"/>
                                            <h2 className="text-success fw-bold">{(report.TotalReceived || 0).toLocaleString()} đ</h2>
                                            <p className="text-muted small">
                                                Tiền đã về tài khoản.<br/>
                                                (Bao gồm: Chuyển khoản, Momo và COD đã giao thành công)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Tiền Chờ Nhận (Vàng cam) */}
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm h-100 border-start border-5 border-warning">
                                        <div className="card-body text-center p-5">
                                            <div className="display-1 text-warning mb-3"><i className="bi bi-hourglass-split"></i></div>
                                            <h4 className="text-secondary text-uppercase">Tiền Chờ Thu (COD)</h4>
                                            <hr className="w-25 mx-auto my-3"/>
                                            <h2 className="text-warning fw-bold">{(report.TotalPending || 0).toLocaleString()} đ</h2>
                                            <p className="text-muted small">
                                                Tiền đang nằm ở đơn COD chưa giao xong.<br/>
                                                (Sẽ chuyển thành doanh thu thực khi Shipper giao thành công)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CÁC TAB KHÁC (GIỮ NGUYÊN CODE CŨ) */}
                    {activeTab === 'warehouse' && (
                        <div>
                            {/* ... Phần Kho hàng (Copy từ code cũ) ... */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="text-primary fw-bold">Quản lý Kho Hàng</h2>
                                <div>
                                    <button className="btn btn-success me-2" onClick={() => setShowImportModal(true)}>⬇️ Nhập kho</button>
                                    <button className="btn btn-danger" onClick={() => setShowExportModal(true)}>⬆️ Xuất kho</button>
                                </div>
                            </div>
                            <ul className="nav nav-tabs mb-3">
                                <li className="nav-item"><button className={`nav-link ${warehouseTab === 'stock' ? 'active fw-bold' : ''}`} onClick={() => setWarehouseTab('stock')}>📦 Tồn kho hiện tại</button></li>
                                <li className="nav-item"><button className={`nav-link ${warehouseTab === 'logs' ? 'active fw-bold' : ''}`} onClick={() => setWarehouseTab('logs')}>📜 Lịch sử Nhập/Xuất</button></li>
                            </ul>
                            <div className="card shadow-sm border-0"><div className="card-body table-responsive p-0">
                                {warehouseTab === 'stock' ? (
                                    <table className="table table-hover align-middle mb-0"><thead className="table-light"><tr><th>Mã SP</th><th>Tên SP</th><th>Vị trí</th><th>Giá vốn</th><th>Tồn kho</th><th>Trạng thái</th></tr></thead>
                                    <tbody>{products.map((p, i) => (<tr key={i}><td className="fw-bold">{p.ProductID}</td><td>{p.ProductName}</td><td><span className="badge bg-secondary">{p.Location}</span></td><td>{p.Price.toLocaleString()}đ</td><td className="fw-bold fs-5">{p.QuantityInStock}</td><td>{p.QuantityInStock < 10 ? <span className="badge bg-danger">Sắp hết</span> : <span className="badge bg-success">Sẵn sàng</span>}</td></tr>))}</tbody></table>
                                ) : (
                                    <table className="table table-striped align-middle mb-0"><thead className="table-light"><tr><th>Thời gian</th><th>Loại</th><th>Mã SP</th><th>Tên SP</th><th>SL</th><th>Ghi chú</th></tr></thead>
                                    <tbody>{warehouseLogs && warehouseLogs.map((log, i) => (<tr key={i}><td>{new Date(log.LogDate).toLocaleString()}</td><td><span className={`badge ${log.ActionType === 'Nhập kho' ? 'bg-success' : 'bg-danger'}`}>{log.ActionType === 'Nhập kho' ? '⬇️ Nhập' : '⬆️ Xuất'}</span></td><td className="fw-bold">{log.ProductID}</td><td>{log.ProductName}</td><td className="fw-bold">{log.Quantity}</td><td className="text-muted small"><i>{log.Note}</i></td></tr>))}</tbody></table>
                                )}
                            </div></div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div>
                            {/* ... Phần Đơn hàng (Copy từ code cũ) ... */}
                            <div className="d-flex justify-content-between align-items-center mb-4"><h2 className="text-primary fw-bold m-0">Quản lý Đơn hàng</h2><div className="d-flex gap-2"><input className="form-control" placeholder="Tìm mã vận đơn..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} /><button className="btn btn-secondary" onClick={handleSearchOrder}>Tìm</button><select className="form-select w-auto fw-bold text-primary border-primary" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}><option value="All">📋 Tất cả</option><option value="Đã tạo đơn">🟡 Đã tạo đơn</option><option value="Đang vận chuyển">🔵 Đang vận chuyển</option><option value="Giao thành công">🟢 Giao thành công</option><option value="Giao thất bại">🔴 Giao thất bại</option><option value="Đã hủy">⚫ Đã hủy</option></select></div></div>
                            <div className="card shadow-sm border-0"><div className="card-body table-responsive p-0">
                                <table className="table table-hover align-middle mb-0"><thead className="table-primary text-uppercase small"><tr><th>Mã VĐ</th><th style={{width: '30%'}}>Thông tin</th><th>Thanh Toán</th><th>Trạng Thái</th><th>Cập Nhật</th></tr></thead>
                                <tbody>{orders.length > 0 ? orders.map((o, i) => (<tr key={i}><td className="fw-bold text-primary">{o.OrderID}</td><td><div className="small">Gửi: <strong>{o.SenderName}</strong></div><div className="small">Nhận: <strong>{o.ReceiverName}</strong></div></td><td><span className="badge bg-light text-dark border">{o.PaymentMethod}</span><div className="fw-bold text-danger mt-1">{o.TotalAmount?.toLocaleString()}đ</div></td><td><span className={`badge ${o.Status==='Giao thành công'?'bg-success': o.Status==='Đang vận chuyển'?'bg-primary': o.Status==='Giao thất bại' || o.Status==='Đã hủy'?'bg-danger':'bg-warning text-dark'}`}>{o.Status}</span></td><td><select className="form-select form-select-sm" value={o.Status} onChange={(e) => updateStatus(o.OrderID, e.target.value)} disabled={o.Status === 'Giao thành công' || o.Status === 'Đã hủy'}><option value="Đã tạo đơn">Đã tạo đơn</option><option value="Đang vận chuyển">Đang vận chuyển</option><option value="Giao thành công">Giao thành công</option><option value="Giao thất bại">Giao thất bại</option></select></td></tr>)) : <tr><td colSpan="5" className="text-center py-4">Không tìm thấy đơn hàng nào.</td></tr>}</tbody></table>
                            </div></div>
                        </div>
                    )}

                    {activeTab === 'customers' && (
                        <div>
                            {/* ... Phần Khách hàng (Copy từ code cũ) ... */}
                            <h2 className="mb-4 text-primary fw-bold">Danh sách Khách hàng</h2>
                            <div className="card shadow-sm border-0"><div className="card-body table-responsive p-0">
                                <table className="table table-hover align-middle mb-0"><thead className="table-light"><tr><th>Mã KH</th><th>Họ tên</th><th>Liên hệ</th><th>Địa chỉ</th><th>Thao tác</th></tr></thead>
                                <tbody>{customers.map((c, index) => (<tr key={index}><td>{c.UserID}</td><td className="fw-bold">{c.Name}</td><td><div>{c.PhoneNum}</div><small className="text-muted">{c.Email}</small></td><td>{c.Address}</td><td><button className="btn btn-sm btn-outline-primary" onClick={() => handleViewCustomerHistory(c)}>📜 Xem đơn hàng</button></td></tr>))}</tbody></table>
                            </div></div>
                        </div>
                    )}

                    {/* MODAL CÁC LOẠI (NHẬP/XUẤT/LỊCH SỬ) - GIỮ NGUYÊN CODE CŨ */}
                    {showImportModal && (
                        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{zIndex: 1050}}>
                            <div className="bg-white rounded shadow p-4 w-50">
                                <h4 className="mb-3 text-success">⬇️ Nhập Kho Sản Phẩm</h4>
                                <form onSubmit={handleImportStock}>
                                    <div className="row g-3">
                                        <div className="col-md-6"><label className="form-label">Mã Sản Phẩm (SKU)</label><input className="form-control" required value={warehouseForm.productId} onChange={e=>setWarehouseForm({...warehouseForm, productId: e.target.value})} placeholder="VD: SP001" /></div>
                                        <div className="col-md-6"><label className="form-label">Tên Sản Phẩm</label><input className="form-control" value={warehouseForm.productName} onChange={e=>setWarehouseForm({...warehouseForm, productName: e.target.value})} placeholder="Nhập tên SP (nếu mới)" /></div>
                                        <div className="col-md-4"><label className="form-label">Số lượng</label><input type="number" className="form-control" required value={warehouseForm.quantity} onChange={e=>setWarehouseForm({...warehouseForm, quantity: e.target.value})} /></div>
                                        <div className="col-md-4"><label className="form-label">Giá nhập</label><input type="number" className="form-control" value={warehouseForm.price} onChange={e=>setWarehouseForm({...warehouseForm, price: e.target.value})} /></div>
                                        <div className="col-md-4"><label className="form-label">Vị trí kho</label><input className="form-control" value={warehouseForm.location} onChange={e=>setWarehouseForm({...warehouseForm, location: e.target.value})} placeholder="VD: Kệ A1" /></div>
                                        <div className="col-12 mt-4 text-end"><button type="button" className="btn btn-secondary me-2" onClick={()=>setShowImportModal(false)}>Hủy</button><button type="submit" className="btn btn-success">Xác nhận Nhập</button></div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {showExportModal && (
                        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{zIndex: 1050}}>
                            <div className="bg-white rounded shadow p-4 w-50">
                                <h4 className="mb-3 text-danger">⬆️ Xuất Kho Sản Phẩm</h4>
                                <form onSubmit={handleExportStock}>
                                    <div className="mb-3">
                                        <label className="form-label">Chọn Sản Phẩm</label>
                                        <select className="form-select" required value={warehouseForm.productId} onChange={e=>setWarehouseForm({...warehouseForm, productId: e.target.value})}>
                                            <option value="">-- Chọn sản phẩm --</option>
                                            {products.map(p => <option key={p.ProductID} value={p.ProductID}>{p.ProductName} (Tồn: {p.QuantityInStock})</option>)}
                                        </select>
                                    </div>
                                    <div className="mb-3"><label className="form-label">Số lượng xuất</label><input type="number" className="form-control" required value={warehouseForm.quantity} onChange={e=>setWarehouseForm({...warehouseForm, quantity: e.target.value})} /></div>
                                    <div className="mt-4 text-end"><button type="button" className="btn btn-secondary me-2" onClick={()=>setShowExportModal(false)}>Hủy</button><button type="submit" className="btn btn-danger">Xác nhận Xuất</button></div>
                                </form>
                            </div>
                        </div>
                    )}

                    {selectedCustomer && (
                        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{zIndex: 1050}}>
                            <div className="bg-white rounded shadow-lg p-4 w-75" style={{maxHeight: '90vh', overflowY: 'auto'}}>
                                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                                    <h4 className="m-0 text-primary">Lịch sử đơn hàng: <span className="fw-bold text-dark">{selectedCustomer.Name}</span></h4>
                                    <button className="btn btn-close" onClick={() => setSelectedCustomer(null)}></button>
                                </div>
                                {customerOrders.length > 0 ? (
                                    <table className="table table-bordered">
                                        <thead className="table-light"><tr><th>Mã Đơn</th><th>Người Nhận</th><th>Hàng Hóa</th><th>Tổng Tiền</th><th>Trạng Thái</th></tr></thead>
                                        <tbody>
                                            {customerOrders.map((order, i) => (
                                                <tr key={i}>
                                                    <td className="fw-bold">{order.OrderID}</td><td>{order.ReceiverName}</td><td>{order.ProductName}</td><td>{order.TotalAmount?.toLocaleString()}đ</td>
                                                    <td><span className="badge bg-secondary">{order.Status}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (<p className="text-center text-muted">Trống.</p>)}
                                <div className="text-end mt-3"><button className="btn btn-secondary" onClick={() => setSelectedCustomer(null)}>Đóng</button></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Dashboard;
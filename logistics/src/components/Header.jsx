import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Header() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    
    // State để quản lý việc đóng/mở menu
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('user');
        toast.info("Đã đăng xuất thành công");
        navigate('/');
    }

    // Hàm bật tắt menu
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
            <div className="container">
                {/* Logo chuyển về trang Home */}
                <Link className="navbar-brand fw-bold fs-3 fst-italic" to="/home">
                    <i className="bi bi-truck me-2"></i>CITA LOGISTICS
                </Link>
                
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item"><Link className="nav-link active" to="/home">Trang chủ</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/create-order">Tạo đơn hàng</Link></li>
                        <li className="nav-item"><a className="nav-link" href="#news">Tin tức</a></li>
                        <li className="nav-item"><a className="nav-link" href="#about">Về chúng tôi</a></li>
                    </ul>

                    <div className="d-flex align-items-center">
                        {user ? (
                            <div className="dropdown">
                                {/* Nút tên người dùng - Đã thêm sự kiện onClick */}
                                <button 
                                    className="btn btn-outline-light dropdown-toggle border-0 fw-bold d-flex align-items-center" 
                                    type="button" 
                                    onClick={toggleDropdown} // <-- Bắt sự kiện click tại đây
                                    aria-expanded={isDropdownOpen}
                                >
                                    <i className="bi bi-person-circle me-2 fs-5"></i>
                                    <span>Xin chào, {user.Name}</span>
                                </button>
                                
                                {/* Menu xổ xuống - Thêm class 'show' dựa vào state */}
                                <ul 
                                    className={`dropdown-menu dropdown-menu-end shadow ${isDropdownOpen ? 'show' : ''}`}
                                    style={{position: 'absolute', right: 0, top: '100%'}} // Đảm bảo vị trí đúng
                                >
                                    {/* Mục 1: Lịch sử đơn hàng */}
                                    <li>
                                        <Link 
                                            className="dropdown-item" 
                                            to="/order-history"  // <-- ĐÃ SỬA TẠI ĐÂY
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <i className="bi bi-clock-history me-2 text-primary"></i>
                                            Lịch sử đơn hàng
                                        </Link>
                                    </li>
                                                                        
                                    {/* Mục 2: Tạo đơn mới */}
                                    <li>
                                        <Link 
                                            className="dropdown-item" 
                                            to="/create-order"
                                            onClick={() => setIsDropdownOpen(false)} // Đóng menu khi click
                                        >
                                            <i className="bi bi-plus-circle me-2 text-success"></i>
                                            Tạo đơn mới
                                        </Link>
                                    </li>
                                    
                                    <li><hr className="dropdown-divider"/></li>
                                    
                                    {/* Mục 3: Đăng xuất */}
                                    <li>
                                        <button 
                                            className="dropdown-item text-danger fw-bold" 
                                            onClick={handleLogout}
                                        >
                                            <i className="bi bi-box-arrow-right me-2"></i>
                                            Đăng xuất
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <Link to="/" className="btn btn-light text-primary fw-bold">Đăng nhập</Link>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Lớp phủ vô hình để đóng menu khi click ra ngoài (Tùy chọn UX) */}
            {isDropdownOpen && (
                <div 
                    style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 900}} 
                    onClick={() => setIsDropdownOpen(false)}
                ></div>
            )}
        </nav>
    );
}

export default Header;
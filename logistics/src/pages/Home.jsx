import React from 'react';
import { Link } from 'react-router-dom';
// Import Header và Footer
import Header from '../components/Header';
import Footer from '../components/Footer';

function Home() {
    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />

            {/* --- HERO SECTION (BANNER) --- */}
            <div className="bg-primary text-white py-5 mb-5" 
                style={{backgroundImage: 'linear-gradient(45deg, #004e92, #000428)'}}>
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <h1 className="display-4 fw-bold mb-3 animate__animated animate__fadeInLeft">VẬN CHUYỂN SIÊU TỐC<br/>KẾT NỐI TOÀN CẦU</h1>
                            <p className="lead mb-4 opacity-75">Giải pháp Logistics thông minh, tin cậy cho mọi nhu cầu vận chuyển của bạn.</p>
                            <Link to="/create-order" className="btn btn-warning btn-lg fw-bold px-5 rounded-pill shadow-sm">
                                🚀 GỬI HÀNG NGAY
                            </Link>
                        </div>
                        <div className="col-lg-5 d-none d-lg-block text-center">
                            <i className="bi bi-box-seam display-1 opacity-50" style={{fontSize: '10rem'}}></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* --- PHẦN 1: LỊCH SỬ CÔNG TY --- */}
                <section id="about" className="mb-5">
                    <div className="row align-items-center bg-white p-4 rounded shadow-sm">
                        <div className="col-md-6">
                            <h5 className="text-primary fw-bold text-uppercase">Về chúng tôi</h5>
                            <h2 className="mb-3">Hành trình phát triển CITA Logistics</h2>
                            <p className="text-muted">
                                Được thành lập vào năm 2025 với sứ mệnh cách mạng hóa ngành vận tải nội địa. 
                                Khởi đầu từ một đội xe nhỏ tại Hà Nội, CITA Logistics đã không ngừng mở rộng mạng lưới, 
                                ứng dụng công nghệ 4.0 vào quản lý vận hành.
                            </p>
                            <p className="text-muted">
                                Đến nay, chúng tôi tự hào sở hữu đội ngũ nhân viên chuyên nghiệp, 
                                hệ thống kho bãi trải dài 3 miền và công nghệ theo dõi đơn hàng Real-time tiên tiến nhất.
                            </p>
                        </div>
                        <div className="col-md-6 text-center">
                            <img src="https://nncn.edu.vn/wp-content/uploads/2022/05/logistics.jpg" className="img-fluid rounded" alt="History" />
                        </div>
                    </div>
                </section>

                {/* --- PHẦN 2: TIN TỨC --- */}
                <section id="news" className="mb-5">
                    <h3 className="fw-bold mb-4 border-start border-5 border-primary ps-3">Tin tức & Sự kiện</h3>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm hover-shadow">
                                <div className="card-body">
                                    <span className="badge bg-danger mb-2">Mới</span>
                                    <h5 className="card-title fw-bold">Mở rộng tuyến giao hàng Đà Nẵng</h5>
                                    <p className="card-text small text-muted">CITA chính thức khai trương kho mới tại Đà Nẵng, rút ngắn thời gian giao hàng miền Trung chỉ còn 24h.</p>
                                </div>
                                <div className="card-footer bg-white border-0">
                                    <a href="#" className="text-decoration-none small">Xem chi tiết &rarr;</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <span className="badge bg-info mb-2">Công nghệ</span>
                                    <h5 className="card-title fw-bold">Ứng dụng AI vào phân loại hàng</h5>
                                    <p className="card-text small text-muted">Hệ thống phân loại tự động mới giúp giảm 99% sai sót trong quá trình nhập kho và xuất kho.</p>
                                </div>
                                <div className="card-footer bg-white border-0">
                                    <a href="#" className="text-decoration-none small">Xem chi tiết &rarr;</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <span className="badge bg-success mb-2">Khuyến mãi</span>
                                    <h5 className="card-title fw-bold">Ưu đãi giảm 20% tháng này</h5>
                                    <p className="card-text small text-muted">Nhập mã CITA2025 để được giảm ngay phí vận chuyển cho đơn hàng trên 5kg.</p>
                                </div>
                                <div className="card-footer bg-white border-0">
                                    <a href="#" className="text-decoration-none small">Xem chi tiết &rarr;</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    )
}
export default Home;
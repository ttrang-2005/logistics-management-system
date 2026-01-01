import React from 'react';

function Footer() {
    return (
        <footer className="bg-dark text-white py-5 mt-auto">
            <div className="container">
                <div className="row g-4">
                    <div className="col-md-4">
                        <h4 className="fw-bold text-primary mb-3">CITA LOGISTICS</h4>
                        <p className="text-secondary small">
                            Giải pháp vận chuyển toàn diện, kết nối mọi miền tổ quốc. 
                            Chúng tôi cam kết mang đến dịch vụ nhanh chóng, an toàn và tiết kiệm nhất.
                        </p>
                    </div>
                    <div className="col-md-4">
                        <h5 className="mb-3">Liên hệ</h5>
                        <ul className="list-unstyled text-secondary small">
                            <li className="mb-2">📍 Tòa nhà CITA, 123 Đường Số 1, Quận 1, TP.HCM</li>
                            <li className="mb-2">📞 Hotline: 1900 888 999</li>
                            <li className="mb-2">📧 Email: support@cita.com.vn</li>
                            <li>⏰ Giờ làm việc: 7:00 - 21:00 (Cả CN)</li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5 className="mb-3">Kết nối với chúng tôi</h5>
                        <div className="d-flex gap-3">
                            <button className="btn btn-outline-light btn-sm rounded-circle" style={{width: 35, height: 35}}>F</button>
                            <button className="btn btn-outline-light btn-sm rounded-circle" style={{width: 35, height: 35}}>I</button>
                            <button className="btn btn-outline-light btn-sm rounded-circle" style={{width: 35, height: 35}}>Y</button>
                        </div>
                        <p className="text-secondary small mt-3">Đăng ký nhận tin khuyến mãi:</p>
                        <div className="input-group input-group-sm">
                            <input type="text" className="form-control bg-secondary text-white border-0" placeholder="Email của bạn..." />
                            <button className="btn btn-primary">Gửi</button>
                        </div>
                    </div>
                </div>
                <hr className="border-secondary my-4" />
                <div className="text-center text-secondary small">
                    © 2025 Cita Logistics. Bảo lưu mọi quyền. | Chính sách bảo mật | Điều khoản sử dụng
                </div>
            </div>
        </footer>
    );
}

export default Footer;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/api/login', { username, password })
            .then(res => {
                if (res.data.Status === "Success") {
                    toast.success(`Chào mừng ${res.data.Name} quay trở lại!`);
                    localStorage.setItem('user', JSON.stringify(res.data));
                    if(res.data.Role === 'ADMIN') {
                        navigate('/admin');
                    } else {
                        navigate('/home');
                    }
                } else {
                    toast.error(res.data.Error);
                }
            })
            .catch(err => toast.error("Lỗi kết nối Server!"));
    }

    // URL ảnh nền bạn cung cấp
    const bgUrl = "https://mit.vn/wp-content/uploads/2023/11/freepik_37600472.jpg";

    return (
        <div 
            className="d-flex justify-content-center align-items-center vh-100"
            style={{
                // Tạo lớp phủ màu trắng mờ (0.5) đè lên ảnh để ảnh trông nhạt hơn
                backgroundImage: `linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4)), url('${bgUrl}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Form nổi bật với shadow lớn và nền trắng tinh */}
            <div className="bg-white p-5 rounded shadow-lg border border-2" style={{width: '400px', maxWidth: '90%'}}>
                <h2 className="text-center mb-4 text-primary fw-bold text-uppercase">Đăng Nhập</h2>
                <div className="text-center mb-4">
                    <i className="bi bi-person-circle display-1 text-secondary"></i>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Tên đăng nhập</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-person"></i></span>
                            <input type="text" placeholder="Nhập username" className="form-control" 
                                onChange={e => setUsername(e.target.value)} required/>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-bold">Mật khẩu</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-lock"></i></span>
                            <input type="password" placeholder="Nhập mật khẩu" className="form-control"
                                onChange={e => setPassword(e.target.value)} required/>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm">
                        ĐĂNG NHẬP
                    </button>
                    
                    <div className="text-center mt-4">
                        <span className="text-muted">Chưa có tài khoản? </span>
                        <Link to="/register" className="text-decoration-none fw-bold">Đăng ký ngay</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Login;
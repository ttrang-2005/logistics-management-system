import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Register() {
    const [values, setValues] = useState({
        username: '', password: '', name: '', email: '', phone: '', address: ''
    });
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/api/register', values)
            .then(res => {
                if(res.data.Status === "Success") {
                    toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
                    navigate('/'); 
                } else {
                    toast.error(res.data.Error);
                }
            })
            .catch(err => toast.error("Lỗi hệ thống!"));
    }

    // URL ảnh nền
    const bgUrl = "https://mit.vn/wp-content/uploads/2023/11/freepik_37600472.jpg";

    return (
        <div 
            className="d-flex justify-content-center align-items-center vh-100"
            style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4)), url('${bgUrl}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="bg-white p-5 rounded shadow-lg border border-2" style={{width: '600px', maxWidth: '95%'}}>
                <h2 className="text-center text-primary fw-bold mb-2">ĐĂNG KÝ THÀNH VIÊN</h2>
                <p className="text-center text-muted mb-4">Trở thành đối tác vận chuyển cùng CITA</p>
                
                <form onSubmit={handleRegister} className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label fw-bold small">Tên đăng nhập (*)</label>
                        <input type="text" className="form-control" onChange={e => setValues({...values, username: e.target.value})} required/>
                    </div>
                    <div className="col-md-6">
                         <label className="form-label fw-bold small">Mật khẩu (*)</label>
                        <input type="password" className="form-control" onChange={e => setValues({...values, password: e.target.value})} required/>
                    </div>
                    <div className="col-12">
                         <label className="form-label fw-bold small">Họ và tên (*)</label>
                        <input type="text" className="form-control" onChange={e => setValues({...values, name: e.target.value})} required/>
                    </div>
                    <div className="col-md-6">
                         <label className="form-label fw-bold small">Email</label>
                        <input type="email" className="form-control" onChange={e => setValues({...values, email: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                         <label className="form-label fw-bold small">Số điện thoại (*)</label>
                        <input type="text" className="form-control" onChange={e => setValues({...values, phone: e.target.value})} required/>
                    </div>
                    <div className="col-12">
                         <label className="form-label fw-bold small">Địa chỉ</label>
                        <input type="text" className="form-control" onChange={e => setValues({...values, address: e.target.value})} />
                    </div>
                    
                    <div className="col-12 mt-4">
                        <button className="btn btn-success w-100 fw-bold py-2 shadow-sm">ĐĂNG KÝ NGAY</button>
                    </div>
                    <div className="col-12 text-center">
                        <span className="text-muted">Đã có tài khoản? </span>
                        <Link to="/" className="text-decoration-none fw-bold">Quay lại Đăng nhập</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Register;
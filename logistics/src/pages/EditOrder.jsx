import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditOrder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8081/api/orders/${id}`)
            .then(res => {
                if(res.data.Status && res.data.Status !== 'Đã tạo đơn') {
                    alert("Đơn hàng này không thể chỉnh sửa được nữa!");
                    navigate('/home');
                }
                setFormData(res.data);
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8081/api/orders/update/${id}`, formData)
            .then(res => {
                if(res.data.Status === "Success") {
                    alert("Cập nhật đơn hàng thành công!");
                    navigate('/home');
                } else {
                    alert("Lỗi: " + res.data.Error);
                }
            });
    }

    if (!formData) return <div className="p-5 text-center">Đang tải dữ liệu...</div>;

    return (
        <div className="container mt-5">
            <h3 className="text-center text-primary mb-4">CHỈNH SỬA ĐƠN HÀNG: {id}</h3>
            <form onSubmit={handleSubmit} className="border p-4 rounded shadow bg-white">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <h5 className="text-danger">Người Gửi</h5>
                        <input className="form-control mb-2" value={formData.SenderName} onChange={e=>setFormData({...formData, SenderName: e.target.value})} placeholder="Họ tên"/>
                        <input className="form-control mb-2" value={formData.SenderPhone} onChange={e=>setFormData({...formData, SenderPhone: e.target.value})} placeholder="SĐT"/>
                        <input className="form-control mb-2" value={formData.SenderAddress} onChange={e=>setFormData({...formData, SenderAddress: e.target.value})} placeholder="Địa chỉ"/>
                    </div>
                    <div className="col-md-6 mb-3">
                        <h5 className="text-success">Người Nhận</h5>
                        <input className="form-control mb-2" value={formData.ReceiverName} onChange={e=>setFormData({...formData, ReceiverName: e.target.value})} placeholder="Họ tên"/>
                        <input className="form-control mb-2" value={formData.ReceiverPhone} onChange={e=>setFormData({...formData, ReceiverPhone: e.target.value})} placeholder="SĐT"/>
                        <input className="form-control mb-2" value={formData.ReceiverAddress} onChange={e=>setFormData({...formData, ReceiverAddress: e.target.value})} placeholder="Địa chỉ"/>
                    </div>
                    <div className="col-12 border-top pt-3">
                        <h5>Thông tin hàng hóa</h5>
                        <div className="d-flex gap-2">
                            <input className="form-control" value={formData.ProductName} onChange={e=>setFormData({...formData, ProductName: e.target.value})} placeholder="Tên hàng hóa"/>
                            <input className="form-control w-25" type="number" value={formData.Weight} onChange={e=>setFormData({...formData, Weight: e.target.value})} placeholder="KG"/>
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => navigate('/home')}>Hủy</button>
                    <button type="submit" className="btn btn-primary">LƯU THAY ĐỔI</button>
                </div>
            </form>
        </div>
    )
}
export default EditOrder;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Danh sách Quận/Huyện và Phường/Xã tương ứng tại Hà Nội
const HANOI_LOCATIONS = {
    "Ba Đình": ["Phúc Xá", "Trúc Bạch", "Vĩnh Phúc", "Cống Vị", "Liễu Giai", "Ngọc Hà", "Đội Cấn", "Kim Mã"],
    "Hoàn Kiếm": ["Phúc Tân", "Đồng Xuân", "Hàng Mã", "Hàng Buồm", "Hàng Đào", "Hàng Bồ", "Cửa Đông", "Lý Thái Tổ"],
    "Cầu Giấy": ["Dịch Vọng", "Mai Dịch", "Nghĩa Đô", "Nghĩa Tân", "Quan Hoa", "Trung Hòa", "Yên Hòa"],
    "Đống Đa": ["Cát Linh", "Văn Miếu", "Quốc Tử Giám", "Láng Thượng", "Láng Hạ", "Khâm Thiên", "Thổ Quan"],
    "Hai Bà Trưng": ["Bạch Đằng", "Bách Khoa", "Bạch Mai", "Cầu Dền", "Đống Mác", "Đồng Nhân", "Đồng Tâm"],
    "Hoàng Mai": ["Đại Kim", "Định Công", "Giáp Bát", "Hoàng Liệt", "Hoàng Văn Thụ", "Lĩnh Nam", "Mai Động"],
    "Thanh Xuân": ["Hạ Đình", "Khương Đình", "Khương Mai", "Khương Trung", "Kim Giang", "Nhân Chính", "Phương Liệt"],
    "Hà Đông": ["Biên Giang", "Đồng Mai", "Yên Nghĩa", "Dương Nội", "Hà Cầu", "La Khê", "Mộ Lao", "Nguyễn Trãi"],
    "Long Biên": ["Bồ Đề", "Cự Khối", "Đức Giang", "Gia Thụy", "Giang Biên", "Long Biên", "Ngọc Lâm", "Ngọc Thụy"],
    "Nam Từ Liêm": ["Cầu Diễn", "Đại Mỗ", "Mễ Trì", "Mỹ Đình 1", "Mỹ Đình 2", "Phú Đô", "Tây Mỗ", "Trung Văn"],
    "Bắc Từ Liêm": ["Cổ Nhuế 1", "Cổ Nhuế 2", "Đông Ngạc", "Đức Thắng", "Liên Mạc", "Minh Khai", "Phú Diễn"],
    "Tây Hồ": ["Bưởi", "Nhật Tân", "Phú Thượng", "Quảng An", "Thụy Khuê", "Tứ Liên", "Xuân La", "Yên Phụ"]
};

// Danh sách loại hàng hóa
const ORDER_TYPES = [
    "Tài liệu / Giấy tờ",
    "Thực phẩm / Đồ ăn",
    "Quần áo / Thời trang",
    "Đồ điện tử / Công nghệ",
    "Hàng dễ vỡ",
    "Khác"
];

function CreateOrder() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    
    // State form
    const [formData, setFormData] = useState({
        customerID: user?.UserID || '',
        
        // Sender Info
        senderName: user?.Name || '', 
        senderPhone: user?.PhoneNum || '', 
        senderAddress: user?.Address || '', // Số nhà/đường
        senderDistrict: '', 
        senderWard: '',
        
        // Receiver Info
        receiverName: '', 
        receiverPhone: '', 
        receiverAddress: '', // Số nhà/đường
        receiverDistrict: '', 
        receiverWard: '',
        
        orderType: 'Tài liệu / Giấy tờ', 
        weight: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate dữ liệu quan trọng
        if(!formData.senderDistrict || !formData.senderWard) {
            toast.warn("Vui lòng chọn Quận/Phường cho Người gửi!");
            return;
        }
        if(!formData.receiverDistrict || !formData.receiverWard) {
            toast.warn("Vui lòng chọn Quận/Phường cho Người nhận!");
            return;
        }

        // Lấy Loại hàng làm Tên hàng hóa
        const finalData = {
            ...formData,
            productName: formData.orderType 
        };

        axios.post('http://localhost:8081/api/create-order', finalData)
            .then(res => {
                if(res.data.Status === "Success") {
                    toast.info("Đang chuyển đến trang thanh toán...");
                    navigate(`/payment/${res.data.OrderID}`);
                } else {
                    toast.error("Lỗi: " + res.data.Error);
                }
            })
            .catch(err => {
                console.error(err);
                toast.error("Lỗi kết nối Server!");
            });
    }

    return (
        <div className="container py-5">
            <h2 className="text-center text-primary fw-bold mb-4">TẠO ĐƠN HÀNG MỚI</h2>
            
            {/* Thanh tiến trình */}
            <div className="d-flex justify-content-center mb-5">
                <div className="d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold" style={{width: 40, height: 40}}>1</div>
                    <span className="ms-2 fw-bold text-primary">Nhập thông tin</span>
                </div>
                <div className="bg-secondary mx-3" style={{width: 100, height: 2}}></div>
                <div className="d-flex align-items-center text-muted">
                    <div className="bg-light border text-secondary rounded-circle d-flex justify-content-center align-items-center fw-bold" style={{width: 40, height: 40}}>2</div>
                    <span className="ms-2">Thanh toán</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="row g-4 justify-content-center">
                <div className="col-lg-10">
                    <div className="bg-white p-4 rounded shadow-sm border">
                        
                        {/* 1. NGƯỜI GỬI */}
                        <h5 className="text-primary border-bottom pb-2 mb-3">1. Thông tin Người Gửi</h5>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label small fw-bold">Họ tên (*)</label>
                                <input className="form-control" value={formData.senderName} onChange={e=>setFormData({...formData, senderName: e.target.value})} required/>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small fw-bold">Số điện thoại (*)</label>
                                <input className="form-control" value={formData.senderPhone} onChange={e=>setFormData({...formData, senderPhone: e.target.value})} required/>
                            </div>
                        </div>
                        
                        {/* Địa chỉ người gửi: Quận/Phường/Chi tiết */}
                        <div className="row mb-3">
                             <div className="col-md-4">
                                <label className="form-label small fw-bold">Quận/Huyện (*)</label>
                                <select className="form-select" 
                                    value={formData.senderDistrict} 
                                    onChange={e => setFormData({...formData, senderDistrict: e.target.value, senderWard: ''})} 
                                    required>
                                    <option value="">-- Chọn Quận --</option>
                                    {Object.keys(HANOI_LOCATIONS).map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Phường/Xã (*)</label>
                                <select className="form-select" 
                                    value={formData.senderWard} 
                                    onChange={e => setFormData({...formData, senderWard: e.target.value})} 
                                    required 
                                    disabled={!formData.senderDistrict}>
                                    <option value="">-- Chọn Phường --</option>
                                    {formData.senderDistrict && HANOI_LOCATIONS[formData.senderDistrict].map(w => (
                                        <option key={w} value={w}>{w}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Số nhà, Tên đường (*)</label>
                                <input className="form-control" value={formData.senderAddress} onChange={e=>setFormData({...formData, senderAddress: e.target.value})} required/>
                            </div>
                        </div>

                        {/* 2. NGƯỜI NHẬN */}
                        <h5 className="text-success border-bottom pb-2 mb-3 mt-4">2. Thông tin Người Nhận</h5>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label small fw-bold">Họ tên người nhận (*)</label>
                                <input className="form-control" onChange={e=>setFormData({...formData, receiverName: e.target.value})} required/>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small fw-bold">Số điện thoại (*)</label>
                                <input className="form-control" onChange={e=>setFormData({...formData, receiverPhone: e.target.value})} required/>
                            </div>
                        </div>
                        <div className="row mb-3">
                            {/* Dropdown Quận/Huyện Người Nhận */}
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Quận/Huyện (*)</label>
                                <select className="form-select" 
                                    value={formData.receiverDistrict} 
                                    onChange={e => setFormData({...formData, receiverDistrict: e.target.value, receiverWard: ''})} 
                                    required>
                                    <option value="">-- Chọn Quận --</option>
                                    {Object.keys(HANOI_LOCATIONS).map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            
                            {/* Dropdown Phường/Xã Người Nhận */}
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Phường/Xã (*)</label>
                                <select className="form-select" 
                                    value={formData.receiverWard} 
                                    onChange={e => setFormData({...formData, receiverWard: e.target.value})} 
                                    required 
                                    disabled={!formData.receiverDistrict}>
                                    <option value="">-- Chọn Phường --</option>
                                    {formData.receiverDistrict && HANOI_LOCATIONS[formData.receiverDistrict].map(w => (
                                        <option key={w} value={w}>{w}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Số nhà, Tên đường (*)</label>
                                <input className="form-control" placeholder="VD: 12 Chùa Bộc" onChange={e=>setFormData({...formData, receiverAddress: e.target.value})} required/>
                            </div>
                        </div>

                        {/* 3. HÀNG HÓA */}
                        <h5 className="text-warning border-bottom pb-2 mb-3 mt-4">3. Thông tin Kiện hàng</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <label className="form-label small fw-bold">Loại đơn hàng</label>
                                <select className="form-select" value={formData.orderType} onChange={e=>setFormData({...formData, orderType: e.target.value})}>
                                    {ORDER_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small fw-bold">Trọng lượng (kg)</label>
                                <input type="number" step="0.1" className="form-control" placeholder="0.5" 
                                    onChange={e=>setFormData({...formData, weight: e.target.value})} required/>
                            </div>
                        </div>

                        <div className="text-center mt-5">
                            <button type="submit" className="btn btn-primary px-5 py-3 fw-bold rounded-pill shadow-sm">
                                TIẾP TỤC ĐẾN THANH TOÁN <i className="bi bi-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default CreateOrder;
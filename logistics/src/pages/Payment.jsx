import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Payment() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [feeDetails, setFeeDetails] = useState({ distance: 0, shipFee: 0, weightFee: 0, total: 0 });

    useEffect(() => {
        // Lấy thông tin đơn hàng vừa tạo
        axios.get(`http://localhost:8081/api/orders/${orderId}`)
            .then(res => {
                if(res.data) {
                    setOrder(res.data);
                    calculateFee(res.data);
                }
            })
            .catch(err => toast.error("Lỗi tải đơn hàng"));
    }, [orderId]);

    // Hàm GIẢ LẬP tính khoảng cách và cước phí
    const calculateFee = (orderData) => {
        // Giả lập khoảng cách từ 2km đến 15km ngẫu nhiên (Vì không có Map API)
        // Trong thực tế, bạn sẽ gọi API Google Maps tại đây
        const mockDistance = (Math.random() * (15 - 2) + 2).toFixed(1); 
        
        const pricePerKm = 5000; // 5k/1km
        const shipFee = mockDistance * pricePerKm;
        
        // Phí cân nặng: > 2kg thì mỗi kg thêm 5k
        let weightFee = 0;
        if(orderData.Weight > 2) {
            weightFee = (orderData.Weight - 2) * 5000;
        }

        setFeeDetails({
            distance: mockDistance,
            shipFee: Math.round(shipFee / 1000) * 1000, // Làm tròn
            weightFee: weightFee,
            total: Math.round(shipFee) + weightFee
        });
    }

    const handleConfirmPayment = () => {
        axios.put('http://localhost:8081/api/confirm-payment', {
            orderId: orderId,
            totalAmount: feeDetails.total,
            paymentMethod: paymentMethod
        }).then(res => {
            if(res.data.Status === "Success") {
                toast.success("Đặt hàng thành công! Tài xế sẽ sớm liên hệ.");
                navigate('/home');
            } else {
                toast.error("Lỗi thanh toán");
            }
        });
    }

    if(!order) return <div className="text-center p-5">Đang tải thông tin...</div>;

    return (
        <div className="container py-5">
            <h3 className="text-center text-primary fw-bold mb-4">THANH TOÁN ĐƠN HÀNG: {order.OrderID}</h3>
            
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow border-0">
                        <div className="card-body p-4">
                            
                            {/* THÔNG TIN VẬN CHUYỂN */}
                            <div className="alert alert-light border">
                                <div className="d-flex justify-content-between">
                                    <span>📍 <strong>Từ:</strong> {order.SenderAddress}</span>
                                    <span>➡️</span>
                                    <span>🏠 <strong>Đến:</strong> {order.ReceiverAddress} ({order.ReceiverDistrict})</span>
                                </div>
                                <div className="mt-2 text-center">
                                    <span className="badge bg-info text-dark">Khoảng cách ước tính: {feeDetails.distance} km</span>
                                </div>
                            </div>

                            {/* CHI TIẾT CƯỚC PHÍ */}
                            <h5 className="mb-3">💰 Chi tiết cước phí</h5>
                            <ul className="list-group mb-4">
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Phí vận chuyển ({feeDetails.distance} km x 5.000đ)</span>
                                    <span>{feeDetails.shipFee.toLocaleString()} đ</span>
                                </li>
                                {feeDetails.weightFee > 0 && (
                                    <li className="list-group-item d-flex justify-content-between">
                                        <span>Phụ phí quá tải ({order.Weight}kg)</span>
                                        <span>{feeDetails.weightFee.toLocaleString()} đ</span>
                                    </li>
                                )}
                                <li className="list-group-item d-flex justify-content-between bg-light fw-bold">
                                    <span>TỔNG THANH TOÁN</span>
                                    <span className="text-danger fs-5">{feeDetails.total.toLocaleString()} đ</span>
                                </li>
                            </ul>

                            {/* PHƯƠNG THỨC THANH TOÁN */}
                            <h5 className="mb-3">💳 Phương thức thanh toán</h5>
                            <div className="btn-group w-100 mb-4">
                                <input type="radio" className="btn-check" name="pay" id="cod" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                                <label className="btn btn-outline-secondary" htmlFor="cod">💵 Tiền mặt (COD)</label>

                                <input type="radio" className="btn-check" name="pay" id="banking" checked={paymentMethod === 'Banking'} onChange={() => setPaymentMethod('Banking')} />
                                <label className="btn btn-outline-primary" htmlFor="banking">🏦 Chuyển khoản</label>

                                <input type="radio" className="btn-check" name="pay" id="momo" checked={paymentMethod === 'Momo'} onChange={() => setPaymentMethod('Momo')} />
                                <label className="btn btn-outline-danger" htmlFor="momo">🟪 Ví Momo</label>
                            </div>

                            {/* HIỂN THỊ MÃ QR */}
                            {paymentMethod !== 'COD' && (
                                <div className="text-center bg-light p-3 rounded mb-4 animate__animated animate__fadeIn">
                                    <p className="fw-bold text-primary mb-2">Quét mã để thanh toán ngay</p>
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=THANHTOAN_${orderId}_${feeDetails.total}`} 
                                        alt="QR Code" 
                                        className="img-thumbnail"
                                    />
                                    <div className="mt-2 small text-muted">
                                        Nội dung CK: <strong>{order.OrderID}</strong>
                                    </div>
                                </div>
                            )}

                            <button className="btn btn-success w-100 py-3 fw-bold fs-5 shadow" onClick={handleConfirmPayment}>
                                ✅ XÁC NHẬN ĐẶT HÀNG
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Payment;
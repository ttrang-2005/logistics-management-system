import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RevenueReport() {
    const [report, setReport] = useState({ TotalCOD: 0, TotalPrepaid: 0, GrandTotal: 0, TotalOrders: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8081/api/report/revenue-details')
            .then(res => setReport(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary fw-bold">📊 BÁO CÁO DOANH THU CHI TIẾT</h2>
                <button className="btn btn-secondary" onClick={() => navigate('/admin')}>Quay lại Dashboard</button>
            </div>

            <div className="row g-4">
                {/* Tổng Doanh Thu */}
                <div className="col-12">
                    <div className="card bg-primary text-white p-4 shadow text-center">
                        <h3>TỔNG DOANH THU TOÀN BỘ</h3>
                        <h1 className="display-4 fw-bold">{(report.GrandTotal || 0).toLocaleString()} VNĐ</h1>
                        <p className="fs-5">Tổng số đơn hàng: {report.TotalOrders}</p>
                    </div>
                </div>

                {/* Phần Ship COD */}
                <div className="col-md-6">
                    <div className="card border-warning shadow h-100">
                        <div className="card-header bg-warning text-dark fw-bold text-center">
                            📦 DOANH THU SHIP COD (Tiền mặt)
                        </div>
                        <div className="card-body text-center d-flex flex-column justify-content-center">
                            <h2 className="text-warning">{(report.TotalCOD || 0).toLocaleString()} VNĐ</h2>
                            <p className="text-muted">Tiền thu hộ khi giao hàng thành công</p>
                        </div>
                    </div>
                </div>

                {/* Phần Chuyển khoản trước */}
                <div className="col-md-6">
                    <div className="card border-success shadow h-100">
                        <div className="card-header bg-success text-white fw-bold text-center">
                            💳 DOANH THU THANH TOÁN TRƯỚC (Banking/Momo)
                        </div>
                        <div className="card-body text-center d-flex flex-column justify-content-center">
                            <h2 className="text-success">{(report.TotalPrepaid || 0).toLocaleString()} VNĐ</h2>
                            <p className="text-muted">Đã thanh toán qua Momo hoặc Chuyển khoản</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RevenueReport;
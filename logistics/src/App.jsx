import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RevenueReport from './pages/RevenueReport';
import Home from './pages/Home';
import CreateOrder from './pages/CreateOrder';
import EditOrder from './pages/EditOrder';
import Payment from './pages/Payment';
import OrderHistory from './pages/OrderHistory';

const PrivateRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      {/* Cấu hình hiển thị Toast ở góc trên phải */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/order-history" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin/revenue" element={<PrivateRoute><RevenueReport /></PrivateRoute>} />

        <Route path="/create-order" element={<PrivateRoute><CreateOrder /></PrivateRoute>} />
        <Route path="/edit-order/:id" element={<PrivateRoute><EditOrder /></PrivateRoute>} />
        <Route path="/payment/:orderId" element={<PrivateRoute><Payment /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
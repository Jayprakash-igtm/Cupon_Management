import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import UserDashboard from './pages/UserDash';
import AdminDashboard from './pages/AdminDash';
import CouponManagement from './pages/CuponManager'
import ClaimedCouponsOverview from './pages/ClaimedCuponHistory.jsx'
import './App.css';

function App() {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manageCoupon" element={<CouponManagement/>} />
        <Route path="/admin/ClaimHistory" element={<ClaimedCouponsOverview/>} />
      </Routes>
    
  );
}

export default App;
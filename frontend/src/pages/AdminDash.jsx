import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState(null);
  const navigate = useNavigate();

  const viewCoupons = () => {
    setActiveView('coupons');
    navigate('/admin/manageCoupon');
  };

  const viewClaimHistory = () => {
    setActiveView('history');
    navigate('/admin/ClaimHistory');
  };

  const handleLogout = () => {
    Cookies.remove('adminToken');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Admin Dashboard Header */}
        <div className="relative bg-white rounded-2xl shadow-xl p-6 mb-8 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-200 rounded-full opacity-60"></div>
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-blue-200 rounded-full opacity-60"></div>
          
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-500">Manage coupons and view claim history</p>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg shadow-sm transition duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            className={`relative bg-white rounded-2xl shadow-lg p-6 text-left overflow-hidden transition duration-200 hover:shadow-xl ${
              activeView === 'coupons' ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={viewCoupons}
            disabled={isLoading}
          >
            {/* Decorative bar */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">View All Coupons</h3>
                <p className="text-gray-500">Manage active and expired coupon codes</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
            </div>
          </button>
          
          <button
            className={`relative bg-white rounded-2xl shadow-lg p-6 text-left overflow-hidden transition duration-200 hover:shadow-xl ${
              activeView === 'history' ? 'ring-2 ring-purple-500' : ''
            }`}
            onClick={viewClaimHistory}
            disabled={isLoading}
          >
            {/* Decorative bar */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Coupon Claim History</h3>
                <p className="text-gray-500">View user redemption data and analytics</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
          </button>
        </div>
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="relative bg-white rounded-2xl shadow-lg p-12 mb-8 flex justify-center items-center overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-purple-200 rounded-full opacity-60"></div>
            
            <div className="flex items-center gap-3 z-10">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-medium text-gray-700">Loading data...</span>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="relative bg-white rounded-2xl shadow-lg p-6 mb-8 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
            
            <div className="flex items-center z-10">
              <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
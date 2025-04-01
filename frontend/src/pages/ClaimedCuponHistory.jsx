import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClaimedCuponStyle.css';
import ClaimedCouponCard from '../component/Claimedcuponcard';

const ClaimedCouponsOverview = () => {
  const [claimedCoupons, setClaimedCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [couponCodeFilter, setCouponCodeFilter] = useState('');

  const fetchClaimedCoupons = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get('http://localhost:3030/admin/ClaimHistory', {
        params: { couponCode: couponCodeFilter },
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.data && response.data.data && response.data.data.coupons) {
        setClaimedCoupons(response.data.data.coupons);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const errorMessage = err.response
        ? `API call failed with status: ${err.response.status}`
        : err.message || 'An error occurred while fetching claimed coupons';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClaimedCoupons();
  }, [couponCodeFilter]);

  const handleCouponCodeFilterChange = (e) => {
    setCouponCodeFilter(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="relative bg-white rounded-2xl shadow-xl p-6 mb-8 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-200 rounded-full opacity-60"></div>
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-blue-200 rounded-full opacity-60"></div>

          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Claimed Coupons</h1>
              
            </div>
          </div>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Filter by Coupon Code"
            value={couponCodeFilter}
            onChange={handleCouponCodeFilterChange}
            className="coupon-filter-input w-full p-4 border rounded-lg shadow-sm"
          />
        </div>

        {isLoading && (
          <div className="relative bg-white rounded-2xl shadow-lg p-12 mb-8 flex justify-center items-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-purple-200 rounded-full opacity-60"></div>

            <div className="flex items-center gap-3 z-10">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-medium text-gray-700">Loading claimed coupons...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="relative bg-white rounded-2xl shadow-lg p-6 mb-8 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>

            <div className="flex items-center z-10">
              <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {claimedCoupons.length > 0 ? (
            claimedCoupons.map((coupon) => (
              <ClaimedCouponCard key={coupon._id} coupon={coupon} />
            ))
          ) : (
            <p className="text-center text-gray-600">No claimed coupons found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimedCouponsOverview;
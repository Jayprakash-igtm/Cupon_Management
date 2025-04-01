import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CouponStyle.css'; // Assuming you have some basic styling
import CouponCard from '../component/Cuponcard';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('coupons');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [editFormData, setEditFormData] = useState({
    code: '',
    value: '', // Changed discount to value to match your backend
    description: '',
    type: '',
    isActive: true,
  });

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setActiveView('coupons');

      const response = await axios.get('http://localhost:3030/admin/getallcoupons', {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.data && response.data.data && response.data.data.coupons) {
        setCoupons(response.data.data.coupons);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const errorMessage = err.response
        ? `API call failed with status: ${err.response.status}`
        : err.message || 'An error occurred while fetching coupons';

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleEditCoupon = (coupon) => {
    setCurrentCoupon(coupon);
    setEditFormData({
      code: coupon.code || '',
      value: coupon.value || '',
      description: coupon.description || '',
      type: coupon.type || '',
      isActive: coupon.isActive !== undefined ? coupon.isActive : true,
    });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      await axios.patch(`http://localhost:3030/admin/updateCoupon/${currentCoupon._id}`, editFormData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      setIsEditModalOpen(false);
      fetchCoupons();
    } catch (err) {
      setError('Failed to update coupon');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewCoupon = () => {
    setCurrentCoupon(null);
    setEditFormData({
      code: '',
      value: '',
      description: '',
      type: '',
      isActive: true,
    });
    setIsEditModalOpen(true);
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      await axios.post('http://localhost:3030/admin/addCoupon', editFormData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      setIsEditModalOpen(false);
      fetchCoupons();
    } catch (err) {
      setError('Failed to create coupon');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="relative bg-white rounded-2xl shadow-xl p-6 mb-8 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-200 rounded-full opacity-60"></div>
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-blue-200 rounded-full opacity-60"></div>

          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Coupon Management</h1>
              <p className="text-gray-500">Manage active and expired coupon codes</p>
            </div>
            <button
              onClick={handleAddNewCoupon}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg shadow-sm transition duration-200"
            >
              Add New Coupon
            </button>
          </div>
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
              <span className="text-lg font-medium text-gray-700">Loading coupons...</span>
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
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <CouponCard key={coupon._id} coupon={coupon} onEdit={() => handleEditCoupon(coupon)} />
            ))
          ) : (
            <p className="text-center text-gray-600">No coupons found.</p>
          )}
        </div>

        {isEditModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{currentCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h3>
                <button className="close-modal-btn" onClick={() => setIsEditModalOpen(false)}>
                  &times;
                </button>
              </div>
              <form onSubmit={currentCoupon ? handleSubmitEdit : handleCreateCoupon}>
                <div className="form-group">
                  <label htmlFor="code">Coupon Code</label>
                  <input type="text" id="code" name="code" value={editFormData.code} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="value">Value</label>
                  <input type="number" id="value" name="value" value={editFormData.value} onChange={handleInputChange} required placeholder="e.g. 20% or 10" />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea id="description" name="description" value={editFormData.description} onChange={handleInputChange} rows="3" />
                </div>

                <div className="form-group">
                  <label htmlFor="type">Type</label>
                  <textarea id="type" name="type" value={editFormData.type} onChange={handleInputChange} placeholder="e.g. percentage/fixed" />
                </div>

                <div className="form-group checkbox-group">
                  <input type="checkbox" id="isActive" name="isActive" checked={editFormData.isActive} onChange={handleInputChange} />
                  <label htmlFor="isActive">Active</label>
                </div>

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn" disabled={isLoading}>
                    {isLoading ? 'Saving...' : currentCoupon ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponManagement;
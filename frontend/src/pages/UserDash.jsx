import React, { useState, useEffect } from 'react';

const UserDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [claimedCoupon, setClaimedCoupon] = useState(null);
  const [error, setError] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const [cooldownMessage, setCooldownMessage] = useState('');

  const handleApiCall = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3030/user/claim', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      

      if (!response.ok) {
        if (data.status === 'fail' && data.cooldown) {
          setCooldown(data.cooldown.remaining);
          setCooldownMessage(`Try again in ${data.cooldown.humanReadable}`);
        }
        throw new Error(data.message || `Claim failed with status ${response.status}`);
      }

      if (data.data && data.data.coupon) {
        setClaimedCoupon(data.data.coupon);
        return;
      }

      throw new Error('Unexpected response format');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Format cooldown time for display
  const formatCooldown = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Timer effect to update cooldown
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prevCooldown) => prevCooldown - 1000); // Decrement every second
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Fetch claimed coupon on component mount
  useEffect(() => {
    const fetchClaimedCoupon = async () => {
      try {
        // Corrected endpoint
        const response = await fetch('http://localhost:3030/claimed', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.coupon) {
            setClaimedCoupon(data.data.coupon);
          }
        } else {
          console.error('Failed to fetch claimed coupon:', response.statusText);
        }
      } catch (err) {
        console.error('Error fetching claimed coupon:', err);
      }
    };

    fetchClaimedCoupon();
  }, []); // Run only once on mount

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Claim Coupon Card */}
        <div className="relative bg-white rounded-2xl shadow-xl p-8 mb-8 overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Want a Coupon!</h2>
            <p className="text-gray-500 mb-6">Click the button below</p>
            <div className="flex justify-center mb-6">
              <button
                className={`px-8 py-4 rounded-lg text-lg font-medium text-white shadow-lg transition duration-200 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isLoading || cooldown > 0 ? 'opacity-80 cursor-not-allowed' : ''
                }`}
                disabled={isLoading || cooldown > 0}
                onClick={handleApiCall}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : cooldown > 0 ? (
                  cooldownMessage || `Try again in ${formatCooldown(cooldown)}`
                ) : (
                  'Get a Coupon'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <h4 className="font-semibold">Error Occurred</h4>
            </div>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Claimed Coupon Display */}
        {claimedCoupon && (
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl mb-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Claimed Coupon</h3>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-2xl text-gray-800">{claimedCoupon.code}</h4>
                    <p className="text-gray-600 mt-1">{claimedCoupon.description}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {claimedCoupon.value}% OFF
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Coupon Type</p>
                    <p className="text-sm font-medium capitalize">{claimedCoupon.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Created at</p>
                    <p className="text-sm font-medium">
                      {claimedCoupon.createdAt ? new Date(claimedCoupon.createdAt).toLocaleDateString() : 'No expiry'}
                    </p>
                  </div>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={() => navigator.clipboard.writeText(claimedCoupon.code)}
                  >
                    Copy Code
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-200 rounded-full opacity-40"></div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;


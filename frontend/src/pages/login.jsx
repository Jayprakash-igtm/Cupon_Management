import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    
    try {
    
      const response = await axios.post('http://localhost:3030/admin/login', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true 
      });

      setTimeout(() => {
        setIsLoading(false);
         navigate('/admin/dashboard');
      }, 1500);

    } catch (error) {

      setIsLoading(false);
      if (error.response) {
        
        setError(error.response.data.message || 'Login failed');
      } else {
        setError('Network error. Please try again.');
      }
    }
  };

  const handleUserRedirect = () => {
    navigate('/user/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="relative w-full max-w-md px-6 py-12 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-200 rounded-full opacity-60"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-blue-200 rounded-full opacity-60"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Welcome </h2>
          <p className="text-center text-gray-500 mb-8">Sign in if you are Admin</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-medium" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <button
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ${
                isLoading ? 'opacity-80 cursor-not-allowed' : ''
              }`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <button 
              onClick={handleUserRedirect} 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-200"
            >
              Go to homepage if not Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
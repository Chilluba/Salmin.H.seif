import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to homepage and trigger admin modal
    navigate('/', { replace: true });
    
    // Small delay to ensure homepage loads, then trigger admin modal
    setTimeout(() => {
      const event = new CustomEvent('open-admin-dashboard');
      window.dispatchEvent(event);
    }, 100);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting to admin dashboard...</p>
      </div>
    </div>
  );
};
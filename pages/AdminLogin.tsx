import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FullAdminDashboard } from '../components/FullAdminDashboard';

export const AdminLogin: React.FC = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(true);

  const handleClose = () => {
    setIsAdminOpen(false);
    // Navigate back to homepage after closing
    setTimeout(() => {
      window.location.hash = '#/';
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4 font-display">Admin Dashboard</h1>
        <p className="text-gray-400 mb-8">Manage your portfolio content and settings</p>
      </motion.div>

      <FullAdminDashboard 
        isOpen={isAdminOpen} 
        onClose={handleClose} 
      />
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (await auth.login(password)) {
      onClose();
      navigate('/admin');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-[#121317] border border-[#27272A] rounded-lg shadow-xl w-full max-w-sm m-4 p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-[#A1A1AA] hover:text-white">
              <X size={24} />
            </button>
            <h2 className="font-accent text-3xl text-center text-white mb-4">Admin Access</h2>
            <p className="text-center text-sm text-[#A1A1AA] mb-6">Enter the password to access the settings panel.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password-input" className="sr-only">Password</label>
                <input
                  id="password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoFocus
                  className="w-full bg-[#0B0B0C] border border-[#27272A] rounded-md py-3 px-4 text-white placeholder:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-[#E50914]"
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                className="w-full bg-[#E50914] text-white font-bold py-3 px-4 rounded-md uppercase tracking-wider hover:bg-[#c11119] transition-colors"
              >
                Unlock
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
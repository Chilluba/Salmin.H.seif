import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Edit, Trash2, Save, Image, FileText, Briefcase, Settings as SettingsIcon, Lock, LogOut } from 'lucide-react';
import { ProjectAdmin } from './admin/ProjectAdmin';
import { WritingsAdmin } from './admin/WritingsAdmin';
import { WallpaperAdmin } from './admin/WallpaperAdmin';
import { LinksAdmin } from './admin/LinksAdmin';
import { AuthService } from '../services/authService';

interface FullAdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'wallpaper' | 'projects' | 'writings' | 'links' | 'security';

export const FullAdminDashboard: React.FC<FullAdminDashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('wallpaper');

  const tabs = [
    { id: 'wallpaper' as const, label: 'Background', icon: Image },
    { id: 'projects' as const, label: 'Projects', icon: Briefcase },
    { id: 'writings' as const, label: 'Writings', icon: FileText },
    { id: 'links' as const, label: 'Links', icon: SettingsIcon },
    { id: 'security' as const, label: 'Security', icon: Lock },
  ];

  const handleLogout = () => {
    AuthService.logout();
    onClose();
    window.history.pushState({}, '', '/');
  };

  // Security tab content
  const SecurityTab = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isChanging, setIsChanging] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsChanging(true);
      setMessage('');

      if (newPassword !== confirmPassword) {
        setMessage('New passwords do not match.');
        setIsChanging(false);
        return;
      }

      if (newPassword.length < 6) {
        setMessage('New password must be at least 6 characters long.');
        setIsChanging(false);
        return;
      }

      try {
        const success = AuthService.changePassword(currentPassword, newPassword);
        if (success) {
          setMessage('Password changed successfully!');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          setMessage('Current password is incorrect.');
        }
      } catch (error) {
        setMessage('An error occurred. Please try again.');
      } finally {
        setIsChanging(false);
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Security Settings</h3>
          <p className="text-gray-400 mb-6">
            Change your admin password to secure your portfolio.
          </p>
        </div>

        <div className="max-w-md">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                placeholder="Enter current password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                placeholder="Enter new password (min 6 characters)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                placeholder="Confirm new password"
                required
              />
            </div>

            {message && (
              <div className={`p-3 rounded-md text-sm ${
                message.includes('successfully') 
                  ? 'bg-green-600/20 border border-green-600/50 text-green-400'
                  : 'bg-red-600/20 border border-red-600/50 text-red-400'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isChanging}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isChanging ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Changing Password...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Change Password
                </>
              )}
            </button>
          </form>
        </div>

        <div className="pt-6 border-t border-gray-600">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#1a1a1a] border border-gray-700 rounded-lg w-full max-w-6xl h-[90vh] relative flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-3xl font-bold text-white font-display">
            Portfolio Admin
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-red-400 bg-red-400/10'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <IconComponent size={18} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-400"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full p-6 overflow-y-auto"
            >
              {activeTab === 'wallpaper' && <WallpaperAdmin />}
              {activeTab === 'projects' && <ProjectAdmin />}
              {activeTab === 'writings' && <WritingsAdmin />}
              {activeTab === 'links' && <LinksAdmin />}
              {activeTab === 'security' && <SecurityTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
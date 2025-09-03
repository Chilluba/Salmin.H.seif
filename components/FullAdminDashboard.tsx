import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Edit, Trash2, Save, Image, FileText, Briefcase, Settings as SettingsIcon } from 'lucide-react';
import { ProjectAdmin } from './admin/ProjectAdmin';
import { WritingsAdmin } from './admin/WritingsAdmin';
import { WallpaperAdmin } from './admin/WallpaperAdmin';
import { LinksAdmin } from './admin/LinksAdmin';

interface FullAdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'wallpaper' | 'projects' | 'writings' | 'links';

export const FullAdminDashboard: React.FC<FullAdminDashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('wallpaper');

  const tabs = [
    { id: 'wallpaper' as const, label: 'Wallpaper', icon: Image },
    { id: 'projects' as const, label: 'Projects', icon: Briefcase },
    { id: 'writings' as const, label: 'Writings', icon: FileText },
    { id: 'links' as const, label: 'Links', icon: SettingsIcon },
  ];

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
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
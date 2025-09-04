
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
// FIX: Imported `AnimatePresence` from `framer-motion` to resolve component not found errors.
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Save, Upload, Trash2 } from 'lucide-react';

const defaultContent = {
  tagline: 'Multidisciplinary Creative & Technologist',
  description: 'Blending business, technology, and art. Specializing in 3D design, videography, graphic design, and philosophical storytelling.',
};

export const Admin: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [tagline, setTagline] = useState('');
    const [description, setDescription] = useState('');
    const [wallpaper, setWallpaper] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        setTagline(localStorage.getItem('homeTagline') || defaultContent.tagline);
        setDescription(localStorage.getItem('homeDescription') || defaultContent.description);
        setWallpaper(localStorage.getItem('homeBackground'));
    }, []);

    const showStatusMessage = (message: string) => {
        setStatusMessage(message);
        setTimeout(() => setStatusMessage(''), 3000);
    };

    const handleContentSave = () => {
        localStorage.setItem('homeTagline', tagline);
        localStorage.setItem('homeDescription', description);
        showStatusMessage('Homepage content updated successfully!');
    };

    const handleWallpaperUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                localStorage.setItem('homeBackground', result);
                setWallpaper(result);
                showStatusMessage('Wallpaper updated successfully!');
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleRemoveWallpaper = () => {
        localStorage.removeItem('homeBackground');
        setWallpaper(null);
        showStatusMessage('Custom wallpaper removed.');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const inputStyle = "mt-1 block w-full bg-[#121317] border border-[#27272A] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#E50914] focus:border-[#E50914]";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
        >
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-display text-5xl md:text-7xl">Admin Panel</h1>
                <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#E50914] hover:bg-[#c11119] transition-colors"
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>

            <div className="bg-[#121317] border border-[#27272A] rounded-lg p-8 space-y-12">
                {/* Homepage Wallpaper Section */}
                <div>
                    <h2 className="font-accent text-3xl font-bold mb-4">Homepage Wallpaper</h2>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <p className="text-[#A1A1AA] mb-4">Upload a new background image for the homepage. For best results, use a high-resolution landscape image.</p>
                            <div className="flex gap-4">
                                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                                    <Upload size={16} /> Choose Image
                                    <input type="file" accept="image/*" className="hidden" onChange={handleWallpaperUpload} />
                                </label>
                                {wallpaper && (
                                     <button onClick={handleRemoveWallpaper} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors">
                                        <Trash2 size={16} /> Remove
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="w-full h-40 bg-[#0B0B0C] rounded-md overflow-hidden border border-[#27272A] flex items-center justify-center">
                           {wallpaper ? (
                               <img src={wallpaper} alt="Wallpaper preview" className="w-full h-full object-cover" />
                           ) : (
                               <p className="text-sm text-[#A1A1AA]">No custom wallpaper set</p>
                           )}
                        </div>
                    </div>
                </div>

                {/* Homepage Content Section */}
                <div>
                    <h2 className="font-accent text-3xl font-bold mb-4">Homepage Content</h2>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="tagline" className="block text-sm font-medium text-[#A1A1AA]">Tagline</label>
                            <input type="text" id="tagline" value={tagline} onChange={e => setTagline(e.target.value)} className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-[#A1A1AA]">Description</label>
                            <textarea id="description" rows={4} value={description} onChange={e => setDescription(e.target.value)} className={inputStyle}></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button onClick={handleContentSave} className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors">
                                <Save size={18} /> Save Content
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Message */}
            <AnimatePresence>
            {statusMessage && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#27272A] text-white py-3 px-6 rounded-lg shadow-lg"
                >
                    {statusMessage}
                </motion.div>
            )}
            </AnimatePresence>

        </motion.div>
    );
};

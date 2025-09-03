import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { wallpaperService, WallpaperConfig } from '../services/wallpaperService';
import { useWallpaperPreloader } from './WallpaperPreloader';
import { ImageUtils } from '../utils/imageUtils';

interface DynamicBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ 
  className = "", 
  children 
}) => {
  const [currentWallpaper, setCurrentWallpaper] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { preloadMultiple } = useWallpaperPreloader();

  useEffect(() => {
    loadTodayWallpaper();
    
    // Listen for admin config updates
    const handleConfigUpdate = () => {
      console.log('Admin config updated, regenerating wallpaper...');
      wallpaperService.forceRegenerate();
      loadTodayWallpaper();
    };

    window.addEventListener('wallpaper-config-updated', handleConfigUpdate);
    
    // Set up daily refresh at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const midnightTimeout = setTimeout(() => {
      loadTodayWallpaper();
      
      // Set up daily interval after the first midnight
      const dailyInterval = setInterval(loadTodayWallpaper, 24 * 60 * 60 * 1000);
      
      return () => clearInterval(dailyInterval);
    }, timeUntilMidnight);

    return () => {
      clearTimeout(midnightTimeout);
      window.removeEventListener('wallpaper-config-updated', handleConfigUpdate);
    };
  }, []);

  const loadTodayWallpaper = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get stored admin config or use defaults
      const adminConfig = getAdminConfig();
      
      const config: WallpaperConfig = {
        theme: 'deadpool',
        style: 'cartoon/anime/stylized',
        referenceImage: adminConfig.referenceImage,
        adminName: adminConfig.adminName
      };

      const wallpaperUrl = await wallpaperService.getTodayWallpaper(config);
      
      // Optimize wallpaper URL for current device
      const { width, height } = ImageUtils.getOptimalImageSize();
      const optimizedUrl = ImageUtils.getResponsiveImageUrl(wallpaperUrl, width, height);
      
      setCurrentWallpaper(optimizedUrl);
      
      // Preload fallback wallpapers for better performance
      const fallbackUrls = [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop&q=80',
      ];
      preloadMultiple(fallbackUrls).catch(console.warn);
      
      // Clean old wallpapers periodically
      wallpaperService.cleanOldWallpapers();
      
    } catch (err) {
      console.error('Error loading wallpaper:', err);
      setError('Failed to load wallpaper');
      // Use fallback wallpaper
      setCurrentWallpaper('https://i.imgur.com/Y5tM2nb.jpg');
    } finally {
      setIsLoading(false);
    }
  };

  const getAdminConfig = () => {
    try {
      const stored = localStorage.getItem('wallpaper-admin-config');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const handleImageError = () => {
    console.warn('Wallpaper failed to load, using fallback');
    // Cycle through fallback wallpapers if current one fails
    const fallbackWallpapers = [
      'https://i.imgur.com/Y5tM2nb.jpg',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop&q=80',
    ];
    
    const currentIndex = fallbackWallpapers.indexOf(currentWallpaper);
    const nextIndex = (currentIndex + 1) % fallbackWallpapers.length;
    setCurrentWallpaper(fallbackWallpapers[nextIndex]);
  };

  const handleRetryLoad = async () => {
    setError(null);
    await loadTodayWallpaper();
  };

  if (isLoading) {
    return (
      <div className={`absolute inset-0 z-0 bg-gradient-to-br from-red-900 via-black to-red-800 ${className}`}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/70 px-6 py-3 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 text-white">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Generating today's wallpaper...</span>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`absolute inset-0 z-0 bg-gradient-to-br from-red-900 via-black to-red-800 ${className}`}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute top-4 left-4 bg-red-600/90 px-4 py-2 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 text-white text-sm">
            <span>⚠️ {error}</span>
            <button 
              onClick={handleRetryLoad}
              className="underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      <motion.div
        key={currentWallpaper}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('${currentWallpaper}')`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          willChange: 'background-image'
        }}
        onError={handleImageError}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </motion.div>
      {children}
    </div>
  );
};
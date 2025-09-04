import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { wallpaperService, WallpaperConfig } from '../services/wallpaperService';
import { simpleWallpaperService } from '../services/simpleWallpaperService';
import { useWallpaperPreloader } from './WallpaperPreloader';
import { ImageUtils } from '../utils/imageUtils';
import { WALLPAPER_CONFIG } from '../config/wallpaperConfig';

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
      console.log('Admin config updated, regenerating Deadpool wallpaper...');
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
      console.log('🎨 Loading today\'s Deadpool wallpaper...');
      setIsLoading(true);
      setError(null);
      
      // Get stored admin config or use defaults
      const adminConfig = getAdminConfig();
      console.log('📋 Admin config loaded:', adminConfig);
      
      // Use simplified service for immediate results
      const isMobile = simpleWallpaperService.isMobileDevice();
      const simpleConfig = {
        hasReference: !!adminConfig.referenceImage,
        deviceType: isMobile ? 'mobile' as const : 'desktop' as const
      };
      
      console.log('📱 Device type:', simpleConfig.deviceType);
      
      // Get immediate wallpaper
      const immediateWallpaper = simpleWallpaperService.getTodayWallpaper(simpleConfig);
      console.log('⚡ Immediate Deadpool wallpaper:', immediateWallpaper);
      setCurrentWallpaper(immediateWallpaper);
      setIsLoading(false);
      
      // Try enhanced generation in background
      setTimeout(async () => {
        try {
          const config: WallpaperConfig = {
            theme: 'deadpool',
            style: 'cartoon/anime/stylized',
            referenceImage: adminConfig.referenceImage,
            adminName: adminConfig.adminName
          };

          console.log('🔧 Attempting enhanced Deadpool wallpaper generation...');
          const enhancedWallpaper = await wallpaperService.getTodayWallpaper(config);
          
          if (enhancedWallpaper && enhancedWallpaper !== immediateWallpaper) {
            console.log('🚀 Enhanced Deadpool wallpaper ready, updating...');
            setCurrentWallpaper(enhancedWallpaper);
          }
        } catch (enhancedError) {
          console.warn('Enhanced generation failed, keeping simple Deadpool wallpaper:', enhancedError);
        }
      }, 1000);
      
      // Dispatch event for status component
      window.dispatchEvent(new CustomEvent('wallpaper-generation-complete'));
      
    } catch (err) {
      console.error('❌ Error loading Deadpool wallpaper:', err);
      setError('Failed to load Deadpool wallpaper');
      // Use fallback Deadpool wallpaper
      const fallbackUrl = WALLPAPER_CONFIG.FALLBACK_WALLPAPERS[0];
      console.log('🔄 Using Deadpool fallback wallpaper:', fallbackUrl);
      setCurrentWallpaper(fallbackUrl);
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
    console.warn('Deadpool wallpaper failed to load, using fallback');
    // Cycle through Deadpool fallback wallpapers if current one fails
    const fallbackWallpapers = WALLPAPER_CONFIG.FALLBACK_WALLPAPERS;
    
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
              <span className="text-sm">Generating today's Deadpool wallpaper...</span>
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
          willChange: 'background-image'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Hidden img element for proper error handling */}
        <img 
          src={currentWallpaper} 
          alt="Deadpool-themed background" 
          className="hidden" 
          onError={handleImageError}
          onLoad={() => console.log('✅ Deadpool wallpaper loaded successfully:', currentWallpaper)}
        />
        
        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-20 left-4 bg-black/80 text-white p-2 rounded text-xs z-30">
            <div>Current Deadpool Wallpaper: {currentWallpaper}</div>
            <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
            <div>Error: {error || 'None'}</div>
          </div>
        )}
      </motion.div>
      {children}
    </div>
  );
};
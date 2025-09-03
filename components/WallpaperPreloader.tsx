import React, { useEffect } from 'react';

interface WallpaperPreloaderProps {
  wallpaperUrl: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const WallpaperPreloader: React.FC<WallpaperPreloaderProps> = ({
  wallpaperUrl,
  onLoad,
  onError
}) => {
  useEffect(() => {
    if (!wallpaperUrl) return;

    const img = new Image();
    
    img.onload = () => {
      console.log('Wallpaper preloaded successfully:', wallpaperUrl);
      onLoad?.();
    };
    
    img.onerror = (error) => {
      console.error('Failed to preload wallpaper:', error);
      onError?.();
    };
    
    img.src = wallpaperUrl;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [wallpaperUrl, onLoad, onError]);

  return null; // This component doesn't render anything
};

// Hook for preloading multiple wallpapers
export const useWallpaperPreloader = () => {
  const preloadWallpaper = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to preload: ${url}`));
      
      img.src = url;
    });
  };

  const preloadMultiple = async (urls: string[]): Promise<void> => {
    try {
      await Promise.all(urls.map(url => preloadWallpaper(url)));
      console.log('All wallpapers preloaded successfully');
    } catch (error) {
      console.warn('Some wallpapers failed to preload:', error);
    }
  };

  return {
    preloadWallpaper,
    preloadMultiple
  };
};
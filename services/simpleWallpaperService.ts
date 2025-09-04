// Simplified wallpaper service for immediate results
import { WALLPAPER_CONFIG } from '../config/wallpaperConfig';

export interface SimpleWallpaperConfig {
  hasReference: boolean;
  deviceType: 'desktop' | 'mobile';
}

export class SimpleWallpaperService {
  private desktopWallpapers = WALLPAPER_CONFIG.FALLBACK_WALLPAPERS;
  private mobileWallpapers = WALLPAPER_CONFIG.MOBILE_FALLBACK_WALLPAPERS;

  public getTodayWallpaper(config: SimpleWallpaperConfig): string {
    const today = new Date();
    const dayIndex = today.getDate();
    
    const wallpapers = config.deviceType === 'mobile' ? this.mobileWallpapers : this.desktopWallpapers;
    const variation = config.hasReference ? 1 : 0;
    const index = (dayIndex + variation) % wallpapers.length;
    
    const selectedWallpaper = wallpapers[index];
    console.log(`🎯 SimpleWallpaperService - Selected ${config.deviceType} Deadpool wallpaper ${index + 1}/${wallpapers.length}:`, selectedWallpaper);
    
    // Test the URL immediately
    this.testImageUrl(selectedWallpaper);
    
    return selectedWallpaper;
  }

  private testImageUrl(url: string): void {
    const img = new Image();
    img.onload = () => console.log('✅ Deadpool wallpaper URL is valid:', url);
    img.onerror = () => console.error('❌ Deadpool wallpaper URL failed to load:', url);
    img.src = url;
  }

  public isMobileDevice(): boolean {
    return window.innerWidth < 768;
  }
}

export const simpleWallpaperService = new SimpleWallpaperService();
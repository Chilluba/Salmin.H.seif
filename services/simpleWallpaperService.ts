// Simplified wallpaper service for immediate results

export interface SimpleWallpaperConfig {
  hasReference: boolean;
  deviceType: 'desktop' | 'mobile';
}

export class SimpleWallpaperService {
  private desktopWallpapers = [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608889175250-c3b0c1667d3a?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080&fit=crop&q=80',
    'https://i.imgur.com/Y5tM2nb.jpg', // Original fallback
  ];

  private mobileWallpapers = [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=768&h=1024&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=768&h=1024&fit=crop&q=80',
    'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=768&h=1024&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608889175250-c3b0c1667d3a?w=768&h=1024&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=768&h=1024&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=768&h=1024&fit=crop&q=80',
    'https://i.imgur.com/Y5tM2nb.jpg', // Original fallback
  ];

  public getTodayWallpaper(config: SimpleWallpaperConfig): string {
    const today = new Date();
    const dayIndex = today.getDate();
    
    const wallpapers = config.deviceType === 'mobile' ? this.mobileWallpapers : this.desktopWallpapers;
    const variation = config.hasReference ? 1 : 0;
    const index = (dayIndex + variation) % wallpapers.length;
    
    const selectedWallpaper = wallpapers[index];
    console.log(`🎯 SimpleWallpaperService - Selected ${config.deviceType} wallpaper ${index + 1}/${wallpapers.length}:`, selectedWallpaper);
    
    // Test the URL immediately
    this.testImageUrl(selectedWallpaper);
    
    return selectedWallpaper;
  }

  private testImageUrl(url: string): void {
    const img = new Image();
    img.onload = () => console.log('✅ Wallpaper URL is valid:', url);
    img.onerror = () => console.error('❌ Wallpaper URL failed to load:', url);
    img.src = url;
  }

  public isMobileDevice(): boolean {
    return window.innerWidth < 768;
  }
}

export const simpleWallpaperService = new SimpleWallpaperService();
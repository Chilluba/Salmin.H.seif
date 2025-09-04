export const WALLPAPER_CONFIG = {
  // Generation settings
  GENERATION_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  CACHE_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  GENERATION_TIMEOUT: 30000, // 30 seconds
  
  // Image settings
  DEFAULT_WIDTH: 1920,
  DEFAULT_HEIGHT: 1080,
  QUALITY: 80,
  MAX_REFERENCE_SIZE: 512, // Max dimension for reference images
  
  // Storage settings
  CACHE_KEY: 'wallpaper-cache',
  ADMIN_CONFIG_KEY: 'wallpaper-admin-config',
  MAX_CACHE_SIZE: 50, // Maximum cached wallpapers
  
  // Fallback wallpapers (Deadpool-themed) - 1920x1080 with subject on right side
  FALLBACK_WALLPAPERS: [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&q=80', // Red abstract background
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop&q=80', // Comic book style
    'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1920&h=1080&fit=crop&q=80', // Urban night scene
    'https://images.unsplash.com/photo-1608889175250-c3b0c1667d3a?w=1920&h=1080&fit=crop&q=80', // Red energy effects
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920&h=1080&fit=crop&q=80', // Dark urban setting
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080&fit=crop&q=80', // Abstract red/black
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&q=80', // Red abstract background
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop&q=80', // Comic book style
  ],
  
  // Mobile fallback wallpapers (768x1024 with subject on right side)
  MOBILE_FALLBACK_WALLPAPERS: [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=768&h=1024&fit=crop&q=80', // Red abstract background, mobile
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=768&h=1024&fit=crop&q=80', // Comic book style, mobile
    'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=768&h=1024&fit=crop&q=80', // Urban night scene, mobile
    'https://images.unsplash.com/photo-1608889175250-c3b0c1667d3a?w=768&h=1024&fit=crop&q=80', // Red energy effects, mobile
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=768&h=1024&fit=crop&q=80', // Dark urban setting, mobile
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=768&h=1024&fit=crop&q=80', // Abstract red/black, mobile
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=768&h=1024&fit=crop&q=80', // Red abstract background, mobile
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=768&h=1024&fit=crop&q=80', // Comic book style, mobile
  ],
  
  // Prompt templates
  DEADPOOL_THEMES: [
    'action hero pose with katanas drawn',
    'heroic stance atop skyscraper',
    'acrobatic combat scene',
    'confident dramatic pose',
    'dynamic leap through explosion',
    'rooftop vigilante scene',
    'urban alleyway action',
    'comic book panel style'
  ],
  
  // Style variations
  ART_STYLES: [
    'cel-shaded animation',
    'comic book illustration',
    'anime/manga art',
    'vector art illustration',
    'digital painting',
    'cartoon animation'
  ],
  
  // Background variations
  BACKGROUNDS: [
    'explosive comic effects',
    'cyberpunk cityscape',
    'abstract geometric patterns',
    'graffiti urban alley',
    'comic panel layout',
    'rooftop city skyline',
    'sci-fi laboratory',
    'industrial warehouse'
  ]
};

export type WallpaperTheme = typeof WALLPAPER_CONFIG.DEADPOOL_THEMES[number];
export type ArtStyle = typeof WALLPAPER_CONFIG.ART_STYLES[number];
export type BackgroundType = typeof WALLPAPER_CONFIG.BACKGROUNDS[number];
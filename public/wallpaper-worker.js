// Service Worker for Wallpaper Generation
// This handles the background generation of wallpapers

class WallpaperWorker {
  constructor() {
    this.apiKey = null;
    this.isGenerating = false;
    this.setupMessageListener();
  }

  setupMessageListener() {
    self.addEventListener('message', async (event) => {
      const { type, payload } = event.data;
      
      switch (type) {
        case 'SET_API_KEY':
          this.apiKey = payload.apiKey;
          break;
          
        case 'GENERATE_WALLPAPER':
          await this.generateWallpaper(payload);
          break;
          
        case 'PREGENERATE_TOMORROW':
          await this.pregenerateTomorrow(payload);
          break;
      }
    });
  }

  async generateWallpaper(config) {
    if (this.isGenerating) {
      console.log('Already generating Deadpool wallpaper, skipping...');
      return;
    }

    this.isGenerating = true;
    
    try {
      // For now, simulate the generation process
      await this.simulateGeneration(config);
      
      self.postMessage({
        type: 'WALLPAPER_GENERATED',
        payload: {
          success: true,
          url: this.getThemedWallpaper(config),
          date: config.date
        }
      });
      
    } catch (error) {
      console.error('Error generating Deadpool wallpaper:', error);
      
      self.postMessage({
        type: 'WALLPAPER_ERROR',
        payload: {
          success: false,
          error: error.message,
          date: config.date
        }
      });
    } finally {
      this.isGenerating = false;
    }
  }

  async pregenerateTomorrow(config) {
    // Schedule tomorrow's generation
    setTimeout(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      this.generateWallpaper({
        ...config,
        date: tomorrow.toISOString().split('T')[0]
      });
    }, 2000); // Small delay to not interfere with current generation
  }

  async simulateGeneration(config) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    // In a real implementation, this would call the Gemini API
    console.log('Generating Deadpool wallpaper with config:', config);
  }

  getThemedWallpaper(config) {
    // Deadpool-themed wallpapers - 1920x1080 with subject on right side
    const fallbacks = [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&q=80', // Red abstract background
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop&q=80', // Comic book style
      'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=1920&h=1080&fit=crop&q=80', // Urban night scene
      'https://images.unsplash.com/photo-1608889175250-c3b0c1667d3a?w=1920&h=1080&fit=crop&q=80', // Red energy effects
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920&h=1080&fit=crop&q=80', // Dark urban setting
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080&fit=crop&q=80', // Abstract red/black
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&q=80', // Red abstract background
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop&q=80', // Comic book style
    ];

    // Create deterministic selection based on date and config
    const today = new Date(config.date || new Date());
    const seed = today.getDate() + today.getMonth() * 31;
    const variation = config.referenceImage ? 1 : 0;
    const index = (seed + variation) % fallbacks.length;
    
    console.log(`Selected Deadpool wallpaper ${index + 1}/${fallbacks.length} for ${today.toDateString()}`);
    return fallbacks[index];
  }
}

// Initialize the worker
const worker = new WallpaperWorker();

console.log('Deadpool Wallpaper Worker initialized');
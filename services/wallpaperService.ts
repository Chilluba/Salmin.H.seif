import { GoogleGenerativeAI } from '@google/generative-ai';
import { imageGenerationService } from './imageGenerationService';
import { promptService } from './promptService';
import { WALLPAPER_CONFIG } from '../config/wallpaperConfig';

export interface WallpaperConfig {
  theme: string;
  style: string;
  referenceImage?: string;
  adminName?: string;
}

export interface WallpaperCache {
  date: string;
  imagePath: string;
  config: WallpaperConfig;
  timestamp: number;
}

class WallpaperService {
  private genAI: GoogleGenerativeAI | null = null;
  private cacheKey = 'wallpaper-cache';
  private fallbackWallpapers = WALLPAPER_CONFIG.FALLBACK_WALLPAPERS;

  constructor() {
    this.initializeAPI();
  }

  private initializeAPI(): void {
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      console.log('Initializing API with key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined');
      
      if (apiKey && apiKey !== 'undefined' && apiKey.trim() !== '') {
        this.genAI = new GoogleGenerativeAI(apiKey);
        console.log('✅ Gemini API initialized successfully');
      } else {
        console.warn('⚠️ Gemini API key not found. Using Deadpool-themed fallback wallpapers.');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Gemini API:', error);
    }
  }

  private ensureCacheDirectory(): void {
    // This will be handled by the component that uses this service
    // We'll create the directory structure when needed
  }

  private generateDeadpoolPrompt(config: WallpaperConfig): string {
    const promptConfig = {
      hasReference: !!config.referenceImage,
      adminName: config.adminName,
      timeOfDay: promptService.getTimeOfDay(),
      variation: promptService.getDailyVariation()
    };

    return promptService.generatePrompt(promptConfig);
  }

  private async generateImage(prompt: string, referenceImageData?: string): Promise<string> {
    if (!this.genAI) {
      throw new Error('Gemini API not initialized');
    }

    try {
      // Note: Gemini 2.5 Flash currently supports text generation
      // For image generation, we would need to use a different approach
      // For now, we'll simulate the generation and return a themed wallpaper
      
      console.log('Generating Deadpool wallpaper with prompt:', prompt);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, return a themed wallpaper based on the config
      return this.getThemedWallpaper(referenceImageData);
      
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }

  private getThemedWallpaper(referenceImageData?: string): string {
    // For now, cycle through themed wallpapers based on date
    const today = new Date();
    const dayIndex = today.getDate() % this.fallbackWallpapers.length;
    const selectedWallpaper = this.fallbackWallpapers[dayIndex];
    console.log(`🎨 Selected Deadpool-themed wallpaper ${dayIndex + 1}/${this.fallbackWallpapers.length}:`, selectedWallpaper);
    return selectedWallpaper;
  }

  private getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getTomorrowDateString(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  private loadCache(): WallpaperCache[] {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  }

  private saveCache(cache: WallpaperCache[]): void {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(cache));
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  }

  public async getTodayWallpaper(config: WallpaperConfig): Promise<string> {
    console.log('🎯 getTodayWallpaper called with config:', config);
    
    const today = this.getTodayDateString();
    const cache = this.loadCache();
    
    console.log('📅 Today:', today);
    console.log('💾 Current cache:', cache);
    
    // Check if today's wallpaper exists in cache and is still valid
    const todayCache = cache.find(item => 
      item.date === today && 
      this.isConfigEqual(item.config, config)
    );
    
    if (todayCache) {
      console.log('✅ Found cached wallpaper:', todayCache.imagePath);
      // Pre-generate tomorrow's wallpaper in background
      this.generateTomorrowWallpaper(config);
      return todayCache.imagePath;
    }

    console.log('🔄 No cache found, generating new Deadpool wallpaper...');
    // Generate today's wallpaper immediately
    const todayWallpaper = await this.generateWallpaperForDate(today, config);
    
    // Pre-generate tomorrow's wallpaper in background
    this.generateTomorrowWallpaper(config);
    
    return todayWallpaper;
  }

  private isConfigEqual(config1: WallpaperConfig, config2: WallpaperConfig): boolean {
    return config1.theme === config2.theme &&
           config1.style === config2.style &&
           config1.referenceImage === config2.referenceImage &&
           config1.adminName === config2.adminName;
  }

  private async generateWallpaperForDate(date: string, config: WallpaperConfig): Promise<string> {
    console.log(`🏗️ Generating Deadpool wallpaper for date: ${date}`);
    
    try {
      const prompt = this.generateDeadpoolPrompt(config);
      console.log('📝 Generated Deadpool prompt:', prompt);
      
      let wallpaperUrl: string;

      try {
        console.log('🤖 Attempting AI generation...');
        wallpaperUrl = await imageGenerationService.generateImage({
          prompt,
          referenceImage: config.referenceImage,
          style: config.style,
          width: 1920,
          height: 1080
        });
        console.log('✅ AI generation successful:', wallpaperUrl);
      } catch (apiError) {
        console.warn('⚠️ AI generation failed, using Deadpool-themed fallback:', apiError);
        wallpaperUrl = this.getThemedWallpaper(config.referenceImage);
        console.log('🔄 Using Deadpool fallback wallpaper:', wallpaperUrl);
      }

      // Cache the result
      const cache = this.loadCache();
      const newCacheEntry: WallpaperCache = {
        date,
        imagePath: wallpaperUrl,
        config,
        timestamp: Date.now()
      };

      // Remove old entry for this date if exists
      const filteredCache = cache.filter(item => item.date !== date);
      filteredCache.push(newCacheEntry);
      
      this.saveCache(filteredCache);
      
      return wallpaperUrl;
      
    } catch (error) {
      console.error(`Error generating Deadpool wallpaper for ${date}:`, error);
      return this.getPlaceholderWallpaper();
    }
  }

  private async generateTomorrowWallpaper(config: WallpaperConfig): Promise<void> {
    const tomorrow = this.getTomorrowDateString();
    const cache = this.loadCache();
    
    // Check if tomorrow's wallpaper already exists with same config
    const tomorrowCache = cache.find(item => 
      item.date === tomorrow && 
      this.isConfigEqual(item.config, config)
    );
    if (tomorrowCache) return;

    // Generate in background
    setTimeout(async () => {
      try {
        await this.generateWallpaperForDate(tomorrow, config);
        console.log('Pre-generated tomorrow\'s Deadpool wallpaper successfully');
      } catch (error) {
        console.error('Error pre-generating tomorrow\'s Deadpool wallpaper:', error);
      }
    }, 1000);
  }

  private getPlaceholderWallpaper(): string {
    // Return the first Deadpool-themed wallpaper as fallback
    return this.fallbackWallpapers[0];
  }

  public cleanOldWallpapers(): void {
    // Clean wallpapers older than 7 days to save space
    const cache = this.loadCache();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const filteredCache = cache.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= sevenDaysAgo;
    });

    this.saveCache(filteredCache);
  }

  public forceRegenerate(): void {
    // Clear today's cache to force regeneration
    const today = this.getTodayDateString();
    const cache = this.loadCache();
    const filteredCache = cache.filter(item => item.date !== today);
    this.saveCache(filteredCache);
  }
}

export const wallpaperService = new WallpaperService();
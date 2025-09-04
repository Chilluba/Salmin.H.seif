import { GoogleGenerativeAI } from '@google/generative-ai';
import { geminiImageService } from './geminiImageService';
import { WALLPAPER_CONFIG } from '../config/wallpaperConfig';

export interface ImageGenerationConfig {
  prompt: string;
  referenceImage?: string;
  style?: string;
  width?: number;
  height?: number;
}

export class ImageGenerationService {
  private genAI: GoogleGenerativeAI | null = null;
  private fallbackImages = WALLPAPER_CONFIG.FALLBACK_WALLPAPERS;

  constructor() {
    this.initializeAPI();
  }

  private initializeAPI(): void {
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      console.log('🔑 Image Generation Service - API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined');
      
      if (apiKey && apiKey !== 'undefined' && apiKey.trim() !== '') {
        this.genAI = new GoogleGenerativeAI(apiKey);
        console.log('✅ Image Generation Service - Gemini API initialized');
      } else {
        console.warn('⚠️ Image Generation Service - API key not found. Using Deadpool-themed fallback images.');
      }
    } catch (error) {
      console.error('❌ Image Generation Service - Failed to initialize Gemini API:', error);
    }
  }

  public async generateImage(config: ImageGenerationConfig): Promise<string> {
    try {
      if (geminiImageService.isAvailable()) {
        // Use Gemini for enhanced prompt generation
        let enhancedPrompt = config.prompt;
        
        try {
          enhancedPrompt = await geminiImageService.generateImagePrompt(config.prompt, config.referenceImage);
          console.log('Enhanced Deadpool prompt generated:', enhancedPrompt);
        } catch (promptError) {
          console.warn('Failed to enhance prompt, using original:', promptError);
        }

        // If reference image is provided, analyze it
        if (config.referenceImage) {
          try {
            const faceAnalysis = await geminiImageService.analyzeReferenceImage(config.referenceImage);
            enhancedPrompt += ` Character should incorporate these facial features: ${faceAnalysis}`;
          } catch (analysisError) {
            console.warn('Failed to analyze reference image:', analysisError);
          }
        }

        // For now, since direct image generation isn't available in Gemini 2.5 Flash,
        // we'll use the enhanced prompt information to select better fallbacks
        return this.getThemedFallback(config, enhancedPrompt);
        
      } else {
        console.log('Gemini API not available, using Deadpool-themed fallbacks');
        return this.getThemedFallback(config);
      }
    } catch (error) {
      console.error('Error generating Deadpool image:', error);
      return this.getThemedFallback(config);
    }
  }

  private async enhancePrompt(basePrompt: string, referenceImage?: string): Promise<string> {
    if (!this.genAI) return basePrompt;

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const enhancementPrompt = `
        Enhance this Deadpool image generation prompt to be more detailed and specific for creating a high-quality wallpaper:
        
        Original prompt: "${basePrompt}"
        
        Requirements:
        - Make it more descriptive and artistic
        - Include specific visual details
        - Ensure it's suitable for wallpaper generation
        - Keep the Deadpool theme strong
        - Make it cinematic and dynamic
        - Ensure the main subject is positioned on the right side of the image
        
        Return only the enhanced prompt, nothing else.
      `;

      const result = await model.generateContent(enhancementPrompt);
      const enhancedPrompt = result.response.text().trim();
      
      return enhancedPrompt || basePrompt;
    } catch (error) {
      console.error('Error enhancing Deadpool prompt:', error);
      return basePrompt;
    }
  }

  private getThemedFallback(config: ImageGenerationConfig, enhancedPrompt?: string): string {
    // Create a deterministic but varied selection based on the date and config
    const today = new Date();
    const seed = today.getDate() + today.getMonth() * 31;
    
    // Add variation based on whether there's a reference image and enhanced prompt
    let variation = config.referenceImage ? 1 : 0;
    if (enhancedPrompt) {
      // Use prompt content to influence selection
      variation += enhancedPrompt.length % 3;
    }
    
    const index = (seed + variation) % this.fallbackImages.length;
    
    console.log(`Selected Deadpool-themed wallpaper ${index + 1}/${this.fallbackImages.length} for ${today}`);
    return this.fallbackImages[index];
  }

  public async testGeneration(): Promise<boolean> {
    try {
      if (!this.genAI) return false;
      
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent("Test prompt");
      
      return !!result.response.text();
    } catch (error) {
      console.error('API test failed:', error);
      return false;
    }
  }
}

export const imageGenerationService = new ImageGenerationService();
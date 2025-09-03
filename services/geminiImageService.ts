import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiImageService {
  private genAI: GoogleGenerativeAI | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (apiKey && apiKey !== 'undefined' && apiKey.trim() !== '') {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.isInitialized = true;
        console.log('Gemini API initialized for image generation');
      } else {
        console.warn('Gemini API key not available. Image generation will use fallbacks.');
      }
    } catch (error) {
      console.error('Failed to initialize Gemini API:', error);
    }
  }

  public async generateImagePrompt(basePrompt: string, referenceImageData?: string): Promise<string> {
    if (!this.isInitialized || !this.genAI) {
      throw new Error('Gemini API not initialized');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      // Enhanced prompt for better image generation
      const enhancementPrompt = `
        Create an enhanced, detailed prompt for AI image generation based on this request:
        
        "${basePrompt}"
        
        Requirements for the enhanced prompt:
        1. Make it highly detailed and specific
        2. Include artistic style specifications
        3. Specify composition and lighting details
        4. Include technical quality requirements
        5. Ensure it's optimized for wallpaper generation
        6. Keep the Deadpool theme prominent
        7. Make it suitable for cartoon/anime style rendering
        
        ${referenceImageData ? 'Note: A reference face image will be provided separately for facial feature inspiration.' : ''}
        
        Return only the enhanced prompt, nothing else.
      `;

      const result = await model.generateContent(enhancementPrompt);
      const enhancedPrompt = result.response.text().trim();
      
      console.log('Enhanced prompt generated:', enhancedPrompt);
      return enhancedPrompt;
      
    } catch (error) {
      console.error('Error enhancing prompt with Gemini:', error);
      throw error;
    }
  }

  public async analyzeReferenceImage(imageData: string): Promise<string> {
    if (!this.isInitialized || !this.genAI) {
      throw new Error('Gemini API not initialized');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      // Convert base64 to proper format for Gemini
      const base64Data = imageData.split(',')[1];
      const mimeType = imageData.split(';')[0].split(':')[1];

      const analysisPrompt = `
        Analyze this reference face image and provide a detailed description of the facial features 
        that should be incorporated into a Deadpool character design. Focus on:
        
        1. Face shape and structure
        2. Eye characteristics
        3. Distinctive facial features
        4. Overall facial proportions
        
        Provide a concise description that can be used in an image generation prompt 
        to create a stylized cartoon/anime version of Deadpool with these facial characteristics.
        
        Keep the description under 100 words and focus on distinctive features only.
      `;

      const result = await model.generateContent([
        analysisPrompt,
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        }
      ]);
      
      const analysis = result.response.text().trim();
      console.log('Face analysis completed:', analysis);
      
      return analysis;
      
    } catch (error) {
      console.error('Error analyzing reference image:', error);
      throw error;
    }
  }

  public isAvailable(): boolean {
    return this.isInitialized;
  }

  public async testConnection(): Promise<boolean> {
    if (!this.isInitialized || !this.genAI) {
      return false;
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent("Test connection");
      return !!result.response.text();
    } catch (error) {
      console.error('Gemini API test failed:', error);
      return false;
    }
  }
}

export const geminiImageService = new GeminiImageService();
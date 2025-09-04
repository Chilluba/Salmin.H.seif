export interface BackgroundConfig {
  imageData?: string;
  uploadedAt?: Date;
}

export class BackgroundService {
  private static readonly STORAGE_KEY = 'homepage-background';

  public static saveBackground(imageData: string): void {
    try {
      const config: BackgroundConfig = {
        imageData,
        uploadedAt: new Date()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
      console.log('Background saved successfully');
    } catch (error) {
      console.error('Error saving background:', error);
    }
  }

  public static getBackground(): BackgroundConfig | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;
      
      const config: BackgroundConfig = JSON.parse(stored);
      return config;
    } catch (error) {
      console.error('Error loading background:', error);
      return null;
    }
  }

  public static removeBackground(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('Background removed successfully');
    } catch (error) {
      console.error('Error removing background:', error);
    }
  }

  public static hasBackground(): boolean {
    return this.getBackground() !== null;
  }
}
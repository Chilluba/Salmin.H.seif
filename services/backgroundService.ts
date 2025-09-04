export interface BackgroundConfig {
  imageUrl?: string;
}

export class BackgroundService {
  public static async getBackground(): Promise<BackgroundConfig | null> {
    try {
      const baseUrl = (typeof window !== 'undefined' && window.location?.origin) 
        ? window.location.origin
        : '';
      const response = await fetch(`${baseUrl}/background`, { cache: 'no-store' });
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      if (data.imageUrl === '/uploads/default-background.jpg' || !data.imageUrl) {
        return null;
      }
      // Return as relative path; callers should use same-origin
      return { imageUrl: data.imageUrl };
    } catch (error) {
      console.error('Error loading background:', error);
      return null;
    }
  }
}
export interface BackgroundConfig {
  imageUrl?: string;
}

export class BackgroundService {
  public static async getBackground(): Promise<BackgroundConfig | null> {
    try {
      const response = await fetch('http://localhost:3001/background');
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      if (data.imageUrl === '/uploads/default-background.jpg') {
        return null;
      }
      return { imageUrl: `http://localhost:3001${data.imageUrl}` };
    } catch (error) {
      console.error('Error loading background:', error);
      return null;
    }
  }
}
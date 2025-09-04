export interface BackgroundConfig {
  imageData?: string;
  uploadedAt?: Date;
  deviceId?: string;
}

export class BackgroundService {
  private static readonly STORAGE_KEY = 'homepage-background';
  private static readonly DEVICE_ID_KEY = 'device-id';

  private static getDeviceId(): string {
    try {
      let deviceId = localStorage.getItem(this.DEVICE_ID_KEY);
      if (!deviceId) {
        deviceId = this.generateDeviceId();
        localStorage.setItem(this.DEVICE_ID_KEY, deviceId);
      }
      return deviceId;
    } catch {
      return 'default';
    }
  }

  private static generateDeviceId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `${timestamp}-${random}`;
  }

  public static saveBackground(imageData: string): void {
    try {
      const deviceId = this.getDeviceId();
      const config: BackgroundConfig = {
        imageData,
        uploadedAt: new Date(),
        deviceId
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
      
      // Also save to sessionStorage for immediate access
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
      
      console.log('Background saved successfully');
    } catch (error) {
      console.error('Error saving background:', error);
    }
  }

  public static getBackground(): BackgroundConfig | null {
    try {
      // First try sessionStorage for immediate access
      let stored = sessionStorage.getItem(this.STORAGE_KEY);
      
      // If not in sessionStorage, try localStorage
      if (!stored) {
        stored = localStorage.getItem(this.STORAGE_KEY);
      }
      
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
      sessionStorage.removeItem(this.STORAGE_KEY);
      console.log('Background removed successfully');
    } catch (error) {
      console.error('Error removing background:', error);
    }
  }

  public static hasBackground(): boolean {
    return this.getBackground() !== null;
  }

  public static syncBackground(): void {
    try {
      // Sync between localStorage and sessionStorage
      const localStored = localStorage.getItem(this.STORAGE_KEY);
      const sessionStored = sessionStorage.getItem(this.STORAGE_KEY);
      
      if (localStored && !sessionStored) {
        sessionStorage.setItem(this.STORAGE_KEY, localStored);
      } else if (sessionStored && !localStored) {
        localStorage.setItem(this.STORAGE_KEY, sessionStored);
      }
    } catch (error) {
      console.error('Error syncing background:', error);
    }
  }

  public static clearOldBackgrounds(): void {
    try {
      // Keep only the most recent background
      const config = this.getBackground();
      if (config) {
        this.saveBackground(config.imageData!);
      }
    } catch (error) {
      console.error('Error clearing old backgrounds:', error);
    }
  }
}
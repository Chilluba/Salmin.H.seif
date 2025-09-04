export interface AuthConfig {
  password: string;
  lastChanged?: Date;
}

export class AuthService {
  private static readonly AUTH_KEY = 'admin-auth-config';
  private static readonly DEFAULT_PASSWORD = 'admin';

  public static isAuthenticated(): boolean {
    try {
      const token = sessionStorage.getItem('admin-auth-token');
      return token === 'authenticated';
    } catch {
      return false;
    }
  }

  public static login(password: string): boolean {
    try {
      const config = this.getAuthConfig();
      const correctPassword = config?.password || this.DEFAULT_PASSWORD;
      
      if (password === correctPassword) {
        sessionStorage.setItem('admin-auth-token', 'authenticated');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  public static logout(): void {
    try {
      sessionStorage.removeItem('admin-auth-token');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  public static changePassword(currentPassword: string, newPassword: string): boolean {
    try {
      const config = this.getAuthConfig();
      const correctPassword = config?.password || this.DEFAULT_PASSWORD;
      
      if (currentPassword !== correctPassword) {
        return false;
      }

      const newConfig: AuthConfig = {
        password: newPassword,
        lastChanged: new Date()
      };

      localStorage.setItem(this.AUTH_KEY, JSON.stringify(newConfig));
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  }

  public static getAuthConfig(): AuthConfig | null {
    try {
      const stored = localStorage.getItem(this.AUTH_KEY);
      if (!stored) return null;
      
      const config: AuthConfig = JSON.parse(stored);
      return config;
    } catch {
      return null;
    }
  }

  public static getDefaultPassword(): string {
    return this.DEFAULT_PASSWORD;
  }
}
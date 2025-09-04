export class AuthService {
  private static readonly TOKEN_KEY = 'admin-auth-token';

  public static isAuthenticated(): boolean {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      return !!token;
    } catch {
      return false;
    }
  }

  public static getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch {
      return null;
    }
  }

  public static async login(password: string): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(this.TOKEN_KEY, data.token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  public static logout(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}
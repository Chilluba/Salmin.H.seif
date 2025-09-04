import React, { createContext, useState, useContext, ReactNode } from 'react';

// The platform provides a 'frame' object on the window for global persistence

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to wait for the frame API to be ready
const getFrame = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const checkFrame = () => {
            if ((window as any).frame) {
                resolve((window as any).frame);
            } else if (attempts < 50) { // Timeout after ~2.5 seconds
                attempts++;
                setTimeout(checkFrame, 50);
            } else {
                reject(new Error("Frame API not available after multiple attempts."));
            }
        };
        checkFrame();
    });
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getPassword = async () => {
    try {
      const frame = await getFrame();
      return (await frame.storage.get('adminPassword')) || 'admin';
    } catch (error) {
      console.error("Failed to get password from global storage:", error);
      return 'admin'; // fallback to default
    }
  };

  const login = async (password: string) => {
    if (password === await getPassword()) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  
  const changePassword = async (newPassword: string) => {
      try {
        const frame = await getFrame();
        await frame.storage.set('adminPassword', newPassword);
      } catch (error) {
        console.error("Failed to set password in global storage:", error);
      }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
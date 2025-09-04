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
const getFrame = (): Promise<any | null> => {
    return new Promise((resolve) => {
        let attempts = 0;
        const checkFrame = () => {
            // Check for frame and frame.storage to be safe
            if ((window as any).frame && (window as any).frame.storage) {
                resolve((window as any).frame);
            } else if (attempts < 50) { // Timeout after ~2.5 seconds
                attempts++;
                setTimeout(checkFrame, 50);
            } else {
                resolve(null); // Not found, resolve with null instead of rejecting
            }
        };
        checkFrame();
    });
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getPassword = async () => {
    const frame = await getFrame();
    if (frame) {
      return (await frame.storage.get('adminPassword')) || 'admin';
    }
    // Fallback for local dev or if global storage fails
    return localStorage.getItem('adminPassword') || 'admin';
  };

  const login = async (password: string) => {
    if (password === await getPassword()) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  
  const changePassword = async (newPassword: string) => {
    const frame = await getFrame();
    if (frame) {
      await frame.storage.set('adminPassword', newPassword);
    } else {
      localStorage.setItem('adminPassword', newPassword);
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

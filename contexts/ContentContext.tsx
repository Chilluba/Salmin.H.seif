import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { DEFAULT_SITE_CONTENT } from '../data/defaultContent';
import { SiteContent } from '../types';

// The platform provides a 'frame' object on the window for global persistence

interface ContentContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => Promise<void>;
  isLoaded: boolean;
  lastSyncError: string | null;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

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


export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);

  const getAdminToken = () => localStorage.getItem('adminSyncToken') || '';

  useEffect(() => {
    const loadContent = async () => {
      const frame = await getFrame();
      let storedContentSource: string | null = null;
      
      try {
        const response = await fetch('/api/content', { cache: 'no-store' });
        if (response.ok) {
          const payload = await response.json();
          storedContentSource = JSON.stringify(payload);
          localStorage.setItem('siteContent', storedContentSource);
        } else {
          if (frame) {
            storedContentSource = await frame.storage.get('siteContent');
          } else {
            console.warn("Global storage API not found. Falling back to localStorage. Changes will not be synced across devices.");
            storedContentSource = localStorage.getItem('siteContent');
          }
        }
  
        if (storedContentSource) {
          const parsedContent = JSON.parse(storedContentSource);
          // Handle legacy background property for smooth upgrade.
          if (parsedContent.home && parsedContent.home.background) {
            delete parsedContent.home.background;
          }
          // A simple merge to ensure new properties from updates are included
          const mergedContent = { ...DEFAULT_SITE_CONTENT, ...parsedContent };
          setContent(mergedContent);
        } else {
          setContent(DEFAULT_SITE_CONTENT);
        }
      } catch (error) {
        console.error("Failed to load or parse content, using default.", error);
        setContent(DEFAULT_SITE_CONTENT);
      } finally {
        setIsLoaded(true);
      }
    };
    
    loadContent();
  }, []);

  const updateContent = async (newContent: SiteContent) => {
    setLastSyncError(null);
    setContent(newContent);
    const frame = await getFrame();
    const expectedVersion = newContent.meta?.version ?? 1;
    const contentString = JSON.stringify(newContent);

    try {
        const response = await fetch('/api/content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-token': getAdminToken(),
          },
          body: JSON.stringify({ content: newContent, expectedVersion }),
        });

        if (response.ok) {
          const updated = await response.json();
          setContent(updated);
          localStorage.setItem('siteContent', JSON.stringify(updated));
        } else if (response.status === 409) {
          const payload = await response.json();
          setContent(payload);
          localStorage.setItem('siteContent', JSON.stringify(payload));
          setLastSyncError('Someone else updated the site. Your changes were not saved. Please review the latest content and try again.');
          throw new Error('Content version conflict.');
        } else {
          const errorPayload = await response.json().catch(() => ({}));
          throw new Error(errorPayload.message || 'Failed to sync content.');
        }
    } catch (error) {
      console.error("Failed to save content:", error);
      setLastSyncError('Unable to sync content to the server. Changes are saved locally only.');
      if (frame) {
        await frame.storage.set('siteContent', contentString);
      } else {
        localStorage.setItem('siteContent', contentString);
      }
      throw error;
    }
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, isLoaded, lastSyncError }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

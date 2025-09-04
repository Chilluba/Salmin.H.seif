import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { DEFAULT_SITE_CONTENT } from '../data/defaultContent';
import { SiteContent } from '../types';

// The platform provides a 'frame' object on the window for global persistence

interface ContentContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => Promise<void>;
  isLoaded: boolean;
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

  useEffect(() => {
    const loadContent = async () => {
      const frame = await getFrame();
      let storedContentSource: string | null = null;
      
      try {
        if (frame) {
          storedContentSource = await frame.storage.get('siteContent');
        } else {
          console.warn("Global storage API not found. Falling back to localStorage. Changes will not be synced across devices.");
          storedContentSource = localStorage.getItem('siteContent');
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
    setContent(newContent);
    const frame = await getFrame();
    const contentString = JSON.stringify(newContent);

    try {
        if (frame) {
            await frame.storage.set('siteContent', contentString);
        } else {
            localStorage.setItem('siteContent', contentString);
        }
    } catch (error) {
      console.error("Failed to save content:", error);
    }
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, isLoaded }}>
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

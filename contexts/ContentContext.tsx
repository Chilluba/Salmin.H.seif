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


export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const frame = await getFrame();
        const storedContent = await frame.storage.get('siteContent');
        if (storedContent) {
          const parsedContent = JSON.parse(storedContent);
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
        console.error("Failed to load content from global storage", error);
        setContent(DEFAULT_SITE_CONTENT);
      } finally {
        setIsLoaded(true);
      }
    };
    
    loadContent();
  }, []);

  const updateContent = async (newContent: SiteContent) => {
    setContent(newContent);
    try {
      const frame = await getFrame();
      await frame.storage.set('siteContent', JSON.stringify(newContent));
    } catch (error) {
      console.error("Failed to save content to global storage", error);
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
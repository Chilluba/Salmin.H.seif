import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { DEFAULT_SITE_CONTENT } from '../data/defaultContent';
import { SiteContent } from '../types';

interface ContentContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => void;
  isLoaded: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedContent = localStorage.getItem('siteContent');
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
      console.error("Failed to load content from localStorage", error);
      setContent(DEFAULT_SITE_CONTENT);
    }
    setIsLoaded(true);
  }, []);

  const updateContent = (newContent: SiteContent) => {
    setContent(newContent);
    try {
      localStorage.setItem('siteContent', JSON.stringify(newContent));
    } catch (error) {
      console.error("Failed to save content to localStorage", error);
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
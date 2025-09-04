import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BackgroundService } from '../services/backgroundService';

interface SimpleBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export const SimpleBackground: React.FC<SimpleBackgroundProps> = ({ 
  className = "", 
  children 
}) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    loadBackground();
    
    // Listen for background updates
    const handleBackgroundUpdate = () => {
      loadBackground();
    };

    window.addEventListener('background-updated', handleBackgroundUpdate);
    
    return () => {
      window.removeEventListener('background-updated', handleBackgroundUpdate);
    };
  }, []);

  const loadBackground = () => {
    const config = BackgroundService.getBackground();
    if (config?.imageData) {
      setBackgroundImage(config.imageData);
    } else {
      setBackgroundImage(null);
    }
  };

  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      {backgroundImage ? (
        <motion.div
          key={backgroundImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('${backgroundImage}')`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            willChange: 'background-image'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-black"></div>
      )}
      {children}
    </div>
  );
};
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ColorThief from 'colorthief';
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
  const [dominantColor, setDominantColor] = useState<string>('rgba(0,0,0,0.4)');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const loadBackground = async () => {
      const config = await BackgroundService.getBackground();
      if (config?.imageUrl) {
        setBackgroundImage(config.imageUrl);
      } else {
        setBackgroundImage(null);
      }
    };

    loadBackground();
    
    const handleBackgroundUpdate = () => {
      loadBackground();
    };

    window.addEventListener('background-updated', handleBackgroundUpdate);
    
    return () => {
      window.removeEventListener('background-updated', handleBackgroundUpdate);
    };
  }, []);

  useEffect(() => {
    if (backgroundImage && imgRef.current) {
      const img = imgRef.current;
      // When using same-origin relative URLs, crossOrigin should be omitted
      img.removeAttribute('crossorigin');
      img.src = backgroundImage;
      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const color = colorThief.getColor(img);
          setDominantColor(`rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.4)`);
        } catch (e) {
          // If canvas is tainted or ColorThief fails, fall back gracefully
          setDominantColor('rgba(0,0,0,0.4)');
        }
      };
      img.onerror = () => {
        setBackgroundImage(null);
      };
    }
  }, [backgroundImage]);

  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      <img ref={imgRef} src={backgroundImage || ''} style={{ display: 'none' }} />
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
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center, transparent 50%, ${dominantColor})`
            }}
          ></div>
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-black"></div>
      )}
      {children}
    </div>
  );
};
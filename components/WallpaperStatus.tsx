import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface WallpaperStatus {
  isGenerating: boolean;
  lastGenerated?: Date;
  nextGeneration?: Date;
  error?: string;
  cacheSize: number;
}

export const WallpaperStatus: React.FC = () => {
  const [status, setStatus] = useState<WallpaperStatus>({
    isGenerating: false,
    cacheSize: 0
  });
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Listen for wallpaper events
    const handleGeneration = () => {
      setStatus(prev => ({ ...prev, isGenerating: true }));
    };

    const handleComplete = () => {
      setStatus(prev => ({ 
        ...prev, 
        isGenerating: false, 
        lastGenerated: new Date(),
        error: undefined
      }));
    };

    const handleError = (event: CustomEvent) => {
      setStatus(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: event.detail.error 
      }));
    };

    window.addEventListener('wallpaper-generation-start', handleGeneration);
    window.addEventListener('wallpaper-generation-complete', handleComplete);
    window.addEventListener('wallpaper-generation-error', handleError as EventListener);

    // Calculate next generation time
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    setStatus(prev => ({ ...prev, nextGeneration: tomorrow }));

    return () => {
      window.removeEventListener('wallpaper-generation-start', handleGeneration);
      window.removeEventListener('wallpaper-generation-complete', handleComplete);
      window.removeEventListener('wallpaper-generation-error', handleError as EventListener);
    };
  }, []);

  const formatTimeUntilNext = (): string => {
    if (!status.nextGeneration) return '';
    
    const now = new Date();
    const diff = status.nextGeneration.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-30">
      <button
        onClick={() => setShowStatus(!showStatus)}
        className="bg-black/70 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/80 transition-colors"
        title="Wallpaper Status"
      >
        {status.isGenerating ? (
          <RefreshCw className="w-5 h-5 animate-spin" />
        ) : status.error ? (
          <AlertCircle className="w-5 h-5 text-red-400" />
        ) : (
          <Check className="w-5 h-5 text-green-400" />
        )}
      </button>

      <AnimatePresence>
        {showStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-14 right-0 bg-black/90 text-white p-4 rounded-lg backdrop-blur-sm min-w-64"
          >
            <h3 className="font-semibold mb-3 text-red-400">Wallpaper Status</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {status.isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                    <span>Generating wallpaper...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Ready</span>
                  </>
                )}
              </div>

              {status.lastGenerated && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Last: {status.lastGenerated.toLocaleTimeString()}</span>
                </div>
              )}

              {status.nextGeneration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span>Next: {formatTimeUntilNext()}</span>
                </div>
              )}

              {status.error && (
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs">{status.error}</span>
                </div>
              )}

              <div className="pt-2 border-t border-gray-600">
                <span className="text-xs text-gray-400">
                  Cache: {status.cacheSize} wallpapers
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
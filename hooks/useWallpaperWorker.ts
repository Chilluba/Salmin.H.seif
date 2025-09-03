import { useEffect, useRef } from 'react';

interface WallpaperWorkerMessage {
  type: string;
  payload: any;
}

export const useWallpaperWorker = () => {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize worker
    try {
      workerRef.current = new Worker('/wallpaper-worker.js');
      
      workerRef.current.addEventListener('message', (event: MessageEvent<WallpaperWorkerMessage>) => {
        const { type, payload } = event.data;
        
        switch (type) {
          case 'WALLPAPER_GENERATED':
            console.log('Wallpaper generated:', payload);
            // Dispatch custom event for components to listen to
            window.dispatchEvent(new CustomEvent('wallpaper-worker-generated', { detail: payload }));
            break;
            
          case 'WALLPAPER_ERROR':
            console.error('Wallpaper generation error:', payload);
            window.dispatchEvent(new CustomEvent('wallpaper-worker-error', { detail: payload }));
            break;
        }
      });

      workerRef.current.addEventListener('error', (error) => {
        console.error('Worker error:', error);
      });

      // Set API key if available
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (apiKey) {
        workerRef.current.postMessage({
          type: 'SET_API_KEY',
          payload: { apiKey }
        });
      }

    } catch (error) {
      console.error('Failed to initialize wallpaper worker:', error);
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const generateWallpaper = (config: any) => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'GENERATE_WALLPAPER',
        payload: config
      });
    }
  };

  const pregenerateTomorrow = (config: any) => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'PREGENERATE_TOMORROW',
        payload: config
      });
    }
  };

  return {
    generateWallpaper,
    pregenerateTomorrow
  };
};
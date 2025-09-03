export interface ResponsiveImageConfig {
  baseUrl: string;
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export class ImageUtils {
  static getResponsiveImageUrl(baseUrl: string, width: number, height: number): string {
    // For Unsplash images, add responsive parameters
    if (baseUrl.includes('unsplash.com')) {
      const url = new URL(baseUrl);
      url.searchParams.set('w', width.toString());
      url.searchParams.set('h', height.toString());
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('q', '80');
      return url.toString();
    }
    
    return baseUrl;
  }

  static getOptimalImageSize(): { width: number; height: number } {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    // Calculate optimal size based on screen and pixel ratio
    const optimalWidth = Math.min(screenWidth * devicePixelRatio, 1920);
    const optimalHeight = Math.min(screenHeight * devicePixelRatio, 1080);
    
    return { width: optimalWidth, height: optimalHeight };
  }

  static createImageElement(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  static async preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
    try {
      const promises = urls.map(url => this.createImageElement(url));
      return await Promise.all(promises);
    } catch (error) {
      console.warn('Some images failed to preload:', error);
      throw error;
    }
  }

  static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => reject(new Error('Failed to load image for dimension calculation'));
      img.src = URL.createObjectURL(file);
    });
  }

  static resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Failed to read resized image'));
            reader.readAsDataURL(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/jpeg', 0.9);
      };
      
      img.onerror = () => reject(new Error('Failed to load image for resizing'));
      img.src = URL.createObjectURL(file);
    });
  }
}
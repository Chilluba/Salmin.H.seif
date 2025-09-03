import React, { useState, useRef } from 'react';
import { Upload, X, Save, RefreshCw } from 'lucide-react';
import { ImageUtils } from '../../utils/imageUtils';

interface AdminConfig {
  referenceImage?: string;
  adminName?: string;
}

export const WallpaperAdmin: React.FC = () => {
  const [config, setConfig] = useState<AdminConfig>(() => {
    try {
      const stored = localStorage.getItem('wallpaper-admin-config');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB.');
      return;
    }

    try {
      const resizedImageData = await ImageUtils.resizeImage(file, 512, 512);
      setPreviewImage(resizedImageData);
      setConfig(prev => ({ ...prev, referenceImage: resizedImageData }));
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try a different file.');
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setConfig(prev => ({ ...prev, referenceImage: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const saveConfig = async () => {
    try {
      setIsSaving(true);
      localStorage.setItem('wallpaper-admin-config', JSON.stringify(config));
      
      const event = new CustomEvent('wallpaper-config-updated', { detail: config });
      window.dispatchEvent(event);
      
      alert('Configuration saved successfully! The wallpaper will update immediately.');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Failed to save configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  const regenerateWallpaper = async () => {
    try {
      setIsRegenerating(true);
      
      const event = new CustomEvent('wallpaper-config-updated', { detail: config });
      window.dispatchEvent(event);
      
      alert('Wallpaper regeneration started! It will update shortly.');
    } catch (error) {
      console.error('Error regenerating wallpaper:', error);
      alert('Failed to regenerate wallpaper.');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Wallpaper Configuration</h3>
        <p className="text-gray-400 mb-6">
          Configure dynamic Deadpool-themed wallpapers with optional face personalization.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Admin Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Admin Name (optional)
            </label>
            <input
              type="text"
              value={config.adminName || ''}
              onChange={(e) => setConfig(prev => ({ ...prev, adminName: e.target.value }))}
              placeholder="Enter your name for personalized Deadpool"
              className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Reference Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reference Face Image (optional)
            </label>
            <div className="space-y-4">
              {!previewImage && !config.referenceImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-red-500 transition-colors"
                >
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-gray-400">Click to upload reference image</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewImage || config.referenceImage}
                    alt="Reference preview"
                    className="w-full h-32 object-cover rounded-lg border border-gray-600"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <button
                onClick={saveConfig}
                disabled={isSaving || isRegenerating}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Config
                  </>
                )}
              </button>
            </div>
            
            <button
              onClick={regenerateWallpaper}
              disabled={isSaving || isRegenerating}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isRegenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Regenerate Today's Wallpaper
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <div className="bg-[#2a2a2a] border border-gray-600 rounded-md p-4">
            <h4 className="text-white font-semibold mb-2">How it Works</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• New wallpapers generate automatically every 24 hours</li>
              <li>• Desktop (1920x1080) and mobile (768x1024) variants created</li>
              <li>• Reference image creates personalized Deadpool in cartoon style</li>
              <li>• System caches wallpapers for instant loading</li>
            </ul>
          </div>

          <div className="bg-blue-900/20 border border-blue-600 rounded-md p-4">
            <h4 className="text-blue-400 font-semibold mb-2">Current Status</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <div>Desktop wallpaper: Active</div>
              <div>Mobile wallpaper: Active</div>
              <div>Next generation: {new Date(Date.now() + 24*60*60*1000).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="bg-[#2a2a2a] border border-gray-600 rounded-md p-4">
            <p className="text-sm text-gray-300">
              <strong>Note:</strong> The reference image will be used to create a stylized cartoon/anime version 
              of Deadpool with your facial features. The result will be artistic, not photorealistic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
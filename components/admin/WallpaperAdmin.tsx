import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Save, Trash2 } from 'lucide-react';
import { BackgroundService } from '../../services/backgroundService';

export const WallpaperAdmin: React.FC = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(() => {
    const config = BackgroundService.getBackground();
    return config?.imageData || null;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('Image must be smaller than 10MB.');
      return;
    }

    setIsUploading(true);
    
    try {
      const imageData = await convertFileToBase64(file);
      setPreviewImage(imageData);
      BackgroundService.saveBackground(imageData);
      
      // Dispatch event to update background
      window.dispatchEvent(new CustomEvent('background-updated'));
      
      alert('Background image uploaded successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try a different file.');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const removeBackground = useCallback(() => {
    setPreviewImage(null);
    BackgroundService.removeBackground();
    window.dispatchEvent(new CustomEvent('background-updated'));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    alert('Background image removed. Homepage will now use black background.');
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Homepage Background</h3>
        <p className="text-gray-400 mb-6">
          Upload an image to set as the homepage background. If no image is uploaded, the background will be black.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Panel */}
        <div className="space-y-6">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragOver 
                ? 'border-red-500 bg-red-500/10' 
                : 'border-gray-600 hover:border-red-500'
              }
            `}
          >
            {isUploading ? (
              <div className="space-y-4">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-white">Uploading image...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="mx-auto text-gray-400" size={48} />
                <div>
                  <p className="text-white font-medium">Drop image here or click to browse</p>
                  <p className="text-gray-400 text-sm mt-1">JPG, PNG, GIF up to 10MB</p>
                </div>
              </div>
            )}
          </div>

          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Remove Button */}
          {previewImage && (
            <button
              onClick={removeBackground}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Remove Background Image
            </button>
          )}
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <div className="bg-[#2a2a2a] border border-gray-600 rounded-md p-4">
            <h4 className="text-white font-semibold mb-4">Current Background</h4>
            {previewImage ? (
              <div className="space-y-4">
                <img
                  src={previewImage}
                  alt="Background preview"
                  className="w-full h-32 object-cover rounded-lg border border-gray-600"
                />
                <div className="text-sm text-gray-300">
                  <p>✓ Background image is set</p>
                  <p>✓ Image will be displayed on homepage</p>
                  <p>✓ Changes are automatically saved</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-full h-32 bg-black rounded-lg border border-gray-600 flex items-center justify-center">
                  <p className="text-gray-400">No background image set</p>
                </div>
                <div className="text-sm text-gray-300">
                  <p>• Homepage will use black background</p>
                  <p>• Upload an image to customize</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-900/20 border border-blue-600 rounded-md p-4">
            <h4 className="text-blue-400 font-semibold mb-2">How it Works</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Drag and drop or click to upload an image</li>
              <li>• Image will be automatically resized to fit the screen</li>
              <li>• Background is saved locally and persists across sessions</li>
              <li>• Remove button clears the background (returns to black)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
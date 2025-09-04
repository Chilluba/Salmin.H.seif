import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Save, Trash2 } from 'lucide-react';
import { BackgroundService } from '../services/backgroundService';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 font-display">
          Homepage Background
        </h2>

        <div className="space-y-6">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragOver 
                ? 'border-red-500 bg-red-500/10' 
                : 'border-gray-600 hover:border-red-500'
              }
            `}
          >
            {isUploading ? (
              <div className="space-y-3">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-white text-sm">Uploading image...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="mx-auto text-gray-400" size={32} />
                <div>
                  <p className="text-white font-medium">Drop image here or click to browse</p>
                  <p className="text-gray-400 text-xs mt-1">JPG, PNG, GIF up to 10MB</p>
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

          {/* Current Background Preview */}
          {previewImage && (
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm">Current Background</h4>
              <img
                src={previewImage}
                alt="Background preview"
                className="w-full h-24 object-cover rounded-lg border border-gray-600"
              />
              <button
                onClick={removeBackground}
                className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Trash2 size={14} />
                Remove Background
              </button>
            </div>
          )}

          {/* Info Text */}
          <div className="bg-[#2a2a2a] border border-gray-600 rounded-md p-3">
            <p className="text-xs text-gray-300">
              <strong>Note:</strong> Upload an image to set as the homepage background. 
              If no image is uploaded, the background will be black. Changes are automatically saved.
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
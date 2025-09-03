# Dynamic Wallpaper System Setup

## Overview
This system generates dynamic Deadpool-themed wallpapers using the Gemini 2.5 Flash Image model, with intelligent caching and personalization features.

## Features
- ✅ Automatic daily wallpaper generation
- ✅ 24-hour caching system with pre-generation
- ✅ Admin dashboard for face reference uploads
- ✅ Responsive wallpaper optimization
- ✅ Fallback system for reliability
- ✅ Smooth transitions and loading states

## Setup Instructions

### 1. Environment Configuration
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Gemini API key to `.env`:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 2. API Key Setup
Get your Gemini API key from:
- Google AI Studio: https://makersuite.google.com/app/apikey
- Google Cloud Console: https://console.cloud.google.com/

### 3. Directory Structure
The system automatically creates:
```
public/
  wallpapers/
    cache.json          # Wallpaper metadata cache
    YYYY-MM-DD/         # Daily wallpaper folders
      wallpaper.jpg     # Generated wallpaper
```

## Usage

### User Experience
- Homepage automatically loads today's wallpaper
- New wallpapers generate every 24 hours
- Smooth transitions between wallpapers
- Instant loading via pre-generation

### Admin Features
1. Click the settings icon (⚙️) on the homepage
2. Upload a reference face image (optional)
3. Enter admin name (optional)
4. Save configuration
5. Force regenerate current wallpaper if needed

### Personalization
- **With Reference Image**: Deadpool features your face in cartoon style
- **Without Reference**: Generic Deadpool character
- **Style**: Always cartoon/anime/stylized, never photorealistic

## Technical Details

### Caching Strategy
1. **First Load**: Generate today's wallpaper immediately
2. **Background**: Pre-generate tomorrow's wallpaper
3. **Next Day**: Use cached wallpaper instantly
4. **Cleanup**: Remove wallpapers older than 7 days

### Fallback System
1. **Primary**: Generated Gemini wallpaper
2. **Secondary**: Themed fallback wallpapers
3. **Tertiary**: Original static wallpaper
4. **Loading**: Gradient background during generation

### Performance Optimizations
- Image preloading for smooth transitions
- Responsive image sizing based on device
- Local storage caching
- Background generation
- Optimized image formats

## API Integration

### Current Implementation
- Uses Google Generative AI SDK
- Fallback to curated themed wallpapers
- Service worker for background processing

### Future Enhancements
- Direct Gemini 2.5 Flash Image integration
- Server-side generation for better performance
- Advanced prompt engineering
- Multiple style variations

## Troubleshooting

### Common Issues
1. **No API Key**: System uses fallback wallpapers
2. **Network Issues**: Automatic fallback to cached images
3. **Generation Fails**: Cycles through themed alternatives
4. **Loading Slow**: Shows loading state with progress

### Debug Mode
Check browser console for detailed logs:
- Wallpaper generation attempts
- Cache operations
- API responses
- Error details

## File Structure
```
services/
  wallpaperService.ts     # Main wallpaper management
  imageGenerationService.ts  # AI image generation
  promptService.ts        # Prompt engineering

components/
  DynamicBackground.tsx   # Background component
  AdminDashboard.tsx      # Admin interface
  WallpaperPreloader.tsx  # Performance optimization

hooks/
  useWallpaperWorker.ts   # Worker management

utils/
  imageUtils.ts           # Image processing utilities

public/
  wallpaper-worker.js     # Background processing
```

## Security Notes
- Reference images stored locally only
- No server-side image storage
- API keys handled securely
- File size limits enforced

## Cost Estimation
- Gemini 2.5 Flash Image: ~$0.039 per image
- Daily generation: ~$1.17 per month
- Pre-generation: ~$2.34 per month total
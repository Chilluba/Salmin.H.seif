import { WALLPAPER_CONFIG } from '../config/wallpaperConfig';

export interface PromptConfig {
  hasReference: boolean;
  adminName?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  variation: number;
}

export class PromptService {
  private baseDeadpoolPrompts = [
    "A dynamic stylized cartoon illustration of Deadpool in an epic action pose, leaping through the air with katanas drawn, against a vibrant comic book explosion background with bold red and black color scheme",
    "Deadpool in a heroic stance atop a skyscraper at sunset, cape flowing dramatically, city skyline in background, rendered in anime/cartoon style with cel-shading and vibrant colors",
    "Action-packed scene of Deadpool in combat, surrounded by comic book-style motion lines and impact effects, dramatic lighting, cartoon/anime art style with high contrast colors",
    "Deadpool performing an acrobatic flip with weapons spinning, set against a graffiti-covered urban wall, street art aesthetic, stylized cartoon rendering with bold outlines",
    "Cinematic wide shot of Deadpool standing confidently in a dramatic pose, explosion effects in background, comic book panel style with speech bubbles and onomatopoeia effects"
  ];

  private backgroundVariations = [
    "explosive comic book background with 'BAM!' and 'POW!' effects",
    "cyberpunk cityscape at night with neon lights and rain",
    "abstract geometric patterns in red and black",
    "graffiti-covered urban alleyway with dramatic lighting",
    "comic book panel layout with dynamic action lines",
    "rooftop scene with city skyline and dramatic clouds",
    "laboratory or tech facility with sci-fi elements",
    "warehouse or industrial setting with dramatic shadows"
  ];

  private styleModifiers = [
    "cel-shaded animation style",
    "comic book illustration style",
    "anime/manga art style",
    "vector art illustration",
    "digital painting style",
    "cartoon animation style"
  ];

  public generatePrompt(config: PromptConfig): string {
    const variation = config.variation % this.baseDeadpoolPrompts.length;
    const backgroundVariation = config.variation % this.backgroundVariations.length;
    const styleVariation = config.variation % this.styleModifiers.length;
    
    let basePrompt = this.baseDeadpoolPrompts[variation];
    const background = this.backgroundVariations[backgroundVariation];
    const style = this.styleModifiers[styleVariation];

    // Modify prompt based on reference image
    if (config.hasReference && config.adminName) {
      basePrompt = basePrompt.replace(
        'Deadpool',
        `Deadpool with facial features inspired by ${config.adminName}, maintaining the iconic red mask but with personalized facial structure visible through stylized cartoon interpretation`
      );
    }

    // Add time-of-day lighting
    const lightingEffect = this.getLightingForTime(config.timeOfDay);

    const fullPrompt = `
      ${basePrompt}, featuring ${background}, ${lightingEffect}.
      
      Art style: ${style}, high quality digital artwork, 1920x1080 wallpaper resolution.
      
      Visual requirements:
      - Bold, vibrant colors with strong contrast
      - Clean composition suitable for desktop wallpaper
      - Cartoon/anime aesthetic, NOT photorealistic
      - Dynamic and energetic feel
      - Professional illustration quality
      
      Technical specs: High resolution, optimized for desktop display, vibrant color palette.
    `.trim();

    return fullPrompt;
  }

  private getLightingForTime(timeOfDay: string): string {
    switch (timeOfDay) {
      case 'morning':
        return 'soft golden morning light with warm tones';
      case 'afternoon':
        return 'bright daylight with clear, vibrant colors';
      case 'evening':
        return 'dramatic sunset lighting with orange and purple hues';
      case 'night':
        return 'moody night lighting with neon accents and deep shadows';
      default:
        return 'dynamic dramatic lighting';
    }
  }

  public getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  public getDailyVariation(): number {
    // Create a consistent but changing variation based on date
    const today = new Date();
    return today.getDate() + (today.getMonth() * 31);
  }
}

export const promptService = new PromptService();
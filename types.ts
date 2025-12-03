
export interface NavLink {
  name: string;
  path: string;
}

export enum ProjectCategory {
  ThreeD = "3D Modeling",
  Design = "Graphic Design",
  Video = "Videography",
  Websites = "Websites",
  Apps = "Apps",
  Games = "Games",
}

export interface ProjectDetailContent {
  type: 'image' | 'heading' | 'paragraph';
  content: string; // URL for image, text for heading/paragraph
}

export interface Project {
  id: number;
  title: string;
  category: ProjectCategory;
  description: string;
  imageUrl: string;
  tags: string[];
  liveUrl?: string;
  sourceUrl?: string;
  detailContent?: ProjectDetailContent[];
}

export interface Skill {
  name:string;
  level: number; // 0-100
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface WritingContent {
  type: 'heading' | 'paragraph';
  text: string;
}

export interface Writing {
  id: string;
  title: string;
  tagline: string;
  content: WritingContent[];
}

// --- New Content Management Types ---

export interface HomePageContent {
  tagline: string;
  description: string;
}

export interface AboutPageContent {
  philosophy1: string;
  philosophy2: string;
  skills: Skill[];
  timeline: TimelineEvent[];
}

export interface ContactPageContent {
  email: string;
  phone: string;
  location: string;
}

export interface SiteContent {
  home: HomePageContent;
  about: AboutPageContent;
  portfolio: Project[];
  writings: Writing[];
  contact: ContactPageContent;
}

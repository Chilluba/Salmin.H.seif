
export interface NavLink {
  name: string;
  path: string;
}

export enum ProjectCategory {
  ThreeD = "3D Modeling",
  Design = "Graphic Design",
  Video = "Videography",
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
}

export interface Skill {
  name: string;
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

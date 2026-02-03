import { SiteContent, ProjectCategory, Writing } from '../types';
import { THE_NATURE_OF_THE_SELF } from './defaultWritings';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  meta: {
    version: 1,
    updatedAt: new Date().toISOString(),
  },
  home: {
    tagline: 'Multidisciplinary Creative & Technologist',
    description: 'Blending business, technology, and art. Specializing in 3D design, videography, graphic design, and philosophical storytelling.',
  },
  about: {
    philosophy1: 'My work merges precision, creativity, and critical thinking, shaped by a deep exploration of consciousness, communication, and human understanding. I bring strategic value, adaptability, and innovation to every project and organization I engage with.',
    philosophy2: 'I independently specialize in 3D design, videography, graphic design, coding, and philosophical storytelling, aiming to create work that is not only aesthetically pleasing but also communicates a clear and compelling message.',
    skills: [
        { name: '3D Artistry (Blender, C4D)', level: 95 },
        { name: 'Graphic Design & Branding', level: 90 },
        { name: 'Videography & Editing', level: 92 },
        { name: 'Photography & Color Grading', level: 88 },
        { name: 'Python (Automation, AI, Backend)', level: 85 },
        { name: 'JavaScript (React, Node.js)', level: 80 },
        { name: 'Previsualization & Storyboarding', level: 90 },
        { name: 'Creative & Script Writing', level: 85 },
        { name: 'Customer Service & Communication', level: 98 },
    ],
    timeline: [
        { year: '2019', title: 'Start of Formal Education', description: 'Began journey at Mwalimu Nyerere Memorial Academy with a Certificate in Business Administration.' },
        { year: '2020', title: 'Professional Beginnings & Diploma', description: 'Started working as a Receptionist at FNE Crown Investment while pursuing a Diploma in Business Administration.' },
        { year: '2022', title: 'Expanding Creative Horizons', description: 'Graduated and ventured deeper into freelance creative work, including roles at Bixcom and Singularity Microfinance.' },
        { year: '2024', title: 'Azam Media Group & Creative Technologist', description: 'Joined Azam Media Group as a Customer Service Agent while continuing independent creative projects in 3D, coding, and storytelling.' },
    ],
  },
  portfolio: [
    {
      id: 1,
      title: 'Philosophical Video Series',
      category: ProjectCategory.Video,
      description: 'Producing a philosophical video series exploring consciousness and human perception, from scriptwriting to final edit.',
      imageUrl: 'https://i.imgur.com/Kx8pQyT.jpeg',
      tags: ['DaVinci Resolve', 'After Effects', 'Scriptwriting'],
      liveUrl: '#',
      detailContent: [
        { type: 'paragraph', content: 'This series was born from a deep curiosity about the nature of consciousness and how we perceive reality. Each episode tackles a different philosophical concept, presented through a visually engaging narrative, combining cinematic footage with intricate motion graphics.' },
        { type: 'image', content: 'https://i.imgur.com/xPpH82g.jpeg' },
        { type: 'heading', content: 'Production Process' },
        { type: 'paragraph', content: 'The production involved extensive research, scriptwriting, storyboarding, and post-production. We used a combination of DaVinci Resolve for color grading and editing, and After Effects for motion graphics to illustrate complex ideas in an accessible way.' },
      ]
    },
    {
      id: 2,
      title: 'AI-Powered Creative Tools',
      category: ProjectCategory.Apps,
      description: 'Developing Python-based automation tools and AI-powered creative systems to enhance artistic workflows.',
      imageUrl: 'https://i.imgur.com/OZuFn0G.jpeg',
      tags: ['Python', 'AI Agents', 'React', 'Node.js'],
      sourceUrl: '#',
      detailContent: [
        { type: 'paragraph', content: 'To streamline my creative process, I developed a suite of custom tools using Python. These tools automate repetitive tasks in video editing and 3D rendering, and leverage AI agents to generate conceptual ideas and scripts, significantly boosting productivity.' },
        { type: 'image', content: 'https://i.imgur.com/4N3cW6u.jpeg' },
        { type: 'heading', content: 'Tech Stack' },
        { type: 'paragraph', content: 'The backend is built with Python, utilizing libraries like OpenCV for image processing. The frontend, a simple control panel, is built with React and Node.js, providing an intuitive interface for interacting with the automation scripts.' },
      ]
    },
    {
      id: 3,
      title: 'Architectural Previsualization',
      category: ProjectCategory.ThreeD,
      description: 'Designing 3D environments and animated scenes for storytelling and previsualization of architectural concepts.',
      imageUrl: 'https://i.imgur.com/3QJjYqN.jpeg',
      tags: ['Blender', 'Cinema 4D', 'Marvelous Designer'],
      detailContent: [
        { type: 'paragraph', content: 'Using Blender and Cinema 4D, I create detailed 3D models and environments for architectural firms. This allows stakeholders to visualize and walk through spaces before they are built, helping to refine designs and make informed decisions.' },
        { type: 'image', content: 'https://i.imgur.com/a4y3p9H.jpeg' },
        { type: 'heading', content: 'Tools & Techniques' },
        { type: 'paragraph', content: 'My workflow includes modeling, texturing, lighting, and rendering. I also use Marvelous Designer for realistic cloth simulations, adding a layer of realism to interior visualizations.' },
      ]
    },
    {
      id: 4,
      title: 'Interactive Web Game',
      category: ProjectCategory.Games,
      description: 'A browser-based interactive game built with modern web technologies to showcase storytelling and development skills.',
      imageUrl: 'https://i.imgur.com/9iS2m2j.jpeg',
      tags: ['React', 'TypeScript', 'Framer Motion'],
      liveUrl: '#',
      sourceUrl: '#',
      detailContent: [
        { type: 'paragraph', content: 'This project was a challenge to combine my passion for storytelling with my coding skills. The result is a short, narrative-driven game that runs entirely in the browser, built with React for the UI and Framer Motion for smooth, engaging animations.' },
        { type: 'image', content: 'https://i.imgur.com/YwL9d8X.jpeg' },
        { type: 'heading', content: 'Development Highlights' },
        { type: 'paragraph', content: 'The state management is handled using React Context, and TypeScript ensures the codebase is robust and maintainable. The game features a branching narrative, where player choices affect the outcome of the story.' },
      ]
    },
    {
      id: 5,
      title: 'Corporate Branding Package',
      category: ProjectCategory.Design,
      description: 'Complete branding identity for a tech startup, including logo, brand guidelines, and marketing materials.',
      imageUrl: 'https://i.imgur.com/bC1F0wA.jpeg',
      tags: ['Adobe Illustrator', 'Adobe Photoshop'],
      liveUrl: '#',
      detailContent: [
        { type: 'paragraph', content: 'I worked closely with a new tech startup to develop their entire visual identity from the ground up. The goal was to create a modern, trustworthy, and scalable brand that would resonate with their target audience.' },
        { type: 'image', content: 'https://i.imgur.com/rS2Y0fH.jpeg' },
        { type: 'heading', content: 'Deliverables' },
        { type: 'paragraph', content: 'The final package included a primary logo and variations, a color palette, typography guidelines, and templates for business cards, presentations, and social media marketing. All assets were created using Adobe Illustrator and Photoshop.' },
      ]
    },
    {
      id: 6,
      title: 'Kinetic Typography for Azam TV',
      category: ProjectCategory.Video,
      description: 'A dynamic motion graphics piece for a promotional campaign, blending typography and visual effects.',
      imageUrl: 'https://i.imgur.com/4S0tYj8.jpeg',
      tags: ['After Effects', 'Premiere Pro'],
      liveUrl: '#',
      detailContent: [
        { type: 'paragraph', content: 'For a major promotional campaign at Azam TV, I designed and animated a kinetic typography video. The piece needed to be energetic, eye-catching, and clearly communicate the campaign\'s key messages in a short amount of time.' },
        { type: 'image', content: 'https://i.imgur.com/5tWfQ8r.jpeg' },
        { type: 'heading', content: 'Creative Process' },
        { type: 'paragraph', content: 'The project started with a storyboard and style frames. Once the concept was approved, I animated the text and graphics in After Effects, synchronizing the motion with a fast-paced music track. Final editing and sound design were completed in Premiere Pro.' },
      ]
    },
  ],
  writings: [THE_NATURE_OF_THE_SELF],
  contact: {
    email: 'salminhabibu2000@gmail.com',
    phone: '+255 692 156 182',
    location: 'Dar es Salaam, Tanzania',
  },
};

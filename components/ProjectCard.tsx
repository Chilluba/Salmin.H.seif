
import React from 'react';
// FIX: Added the `Variants` type from framer-motion to resolve type errors.
import { motion, Variants } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

// FIX: Explicitly typed with `Variants` to ensure type compatibility with framer-motion.
const cardVariants: Variants = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { type: 'spring', duration: 0.5 } },
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-[#121317] rounded-lg overflow-hidden border border-[#27272A] group"
    >
      <div className="relative overflow-hidden">
        <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
      </div>
      <div className="p-6">
        <h3 className="font-accent text-xl font-bold text-[#F5F7FA] mb-2">{project.title}</h3>
        <p className="text-sm text-[#A1A1AA] mb-4 h-16">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-[#27272A] text-xs text-[#A1A1AA] rounded">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="font-code text-xs text-[#E50914]">{project.category}</span>
          <div className="flex items-center space-x-4">
            {project.sourceUrl && (
              <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[#A1A1AA] hover:text-[#E50914] transition-colors">
                <Github size={20} />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#A1A1AA] hover:text-[#E50914] transition-colors">
                <ExternalLink size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

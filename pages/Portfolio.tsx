import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectCategory } from '../types';
import { useContent } from '../contexts/ContentContext';

const allCategories = [ProjectCategory.ThreeD, ProjectCategory.Design, ProjectCategory.Video];

export const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | 'All'>('All');
  const { content } = useContent();
  const projects = content.portfolio;

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') {
      return projects;
    }
    return projects.filter(p => p.category === activeFilter);
  }, [activeFilter, projects]);

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
      <h1 className="font-display text-5xl md:text-7xl text-center mb-4">Portfolio</h1>
      <p className="text-center text-lg text-[#A1A1AA] mb-8">
        A selection of my creative work.
      </p>

      <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-12">
        <button
          onClick={() => setActiveFilter('All')}
          className={`px-4 py-2 text-sm font-accent uppercase tracking-wider rounded-md transition-colors ${activeFilter === 'All' ? 'bg-[#E50914] text-white' : 'bg-[#121317] text-[#A1A1AA] hover:bg-[#27272A]'}`}
        >
          All
        </button>
        {allCategories.map(category => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-4 py-2 text-sm font-accent uppercase tracking-wider rounded-md transition-colors ${activeFilter === category ? 'bg-[#E50914] text-white' : 'bg-[#121317] text-[#A1A1AA] hover:bg-[#27272A]'}`}
          >
            {category}
          </button>
        ))}
      </div>

      <motion.div 
        layout 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

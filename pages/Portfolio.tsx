
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectCategory } from '../types';
import { useContent } from '../contexts/ContentContext';
import { PortfolioScene } from '../components/PortfolioScene';
import { Box as BoxIcon, Grid as GridIcon } from 'lucide-react';

const allCategories = Object.values(ProjectCategory);

export const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | '3d'>('3d');
  const { content } = useContent();
  const projects = content.portfolio;

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') {
      return projects;
    }
    return projects.filter(p => p.category === activeFilter);
  }, [activeFilter, projects]);

  return (
    <div className="relative min-h-screen">
      {/* View Mode Toggle & Filters */}
      <div className="fixed top-24 right-4 z-40 flex flex-col items-end gap-4 pointer-events-none">
          {/* Mode Switcher */}
          <div className="bg-[#121317]/90 backdrop-blur-md border border-[#27272A] p-1 rounded-lg flex pointer-events-auto">
             <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-[#E50914] text-white' : 'text-[#A1A1AA] hover:text-white'}`}
                title="Grid View"
             >
                <GridIcon size={20} />
             </button>
             <button 
                onClick={() => setViewMode('3d')}
                className={`p-2 rounded transition-colors ${viewMode === '3d' ? 'bg-[#E50914] text-white' : 'text-[#A1A1AA] hover:text-white'}`}
                title="3D Universe View"
             >
                <BoxIcon size={20} />
             </button>
          </div>

          {/* Filters (Only visible/interactive in Grid mode or overlay in 3D) */}
          <div className="bg-[#121317]/90 backdrop-blur-md border border-[#27272A] p-2 rounded-lg pointer-events-auto max-w-[200px] sm:max-w-none flex flex-wrap justify-end gap-2">
            <button
                onClick={() => setActiveFilter('All')}
                className={`px-3 py-1 text-xs font-accent uppercase tracking-wider rounded transition-all ${activeFilter === 'All' ? 'bg-[#E50914] text-white' : 'text-[#A1A1AA] hover:bg-[#27272A]'}`}
            >
                All
            </button>
            {allCategories.map(category => (
            <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-3 py-1 text-xs font-accent uppercase tracking-wider rounded transition-all ${activeFilter === category ? 'bg-[#E50914] text-white' : 'text-[#A1A1AA] hover:bg-[#27272A]'}`}
            >
                {category}
            </button>
            ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === '3d' ? (
             <motion.div 
                key="3d-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 w-full h-screen"
             >
                <PortfolioScene projects={filteredProjects} />
             </motion.div>
        ) : (
            <motion.div 
                key="grid-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 relative z-10 bg-[#0B0B0C] min-h-screen"
            >
                <div className="max-w-7xl mx-auto">
                    <h1 className="font-display text-5xl md:text-7xl mb-12">Portfolio</h1>
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                        {filteredProjects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                        </AnimatePresence>
                    </motion.div>
                    {filteredProjects.length === 0 && (
                        <p className="text-center text-[#A1A1AA] mt-20 text-xl">No projects found in this category.</p>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

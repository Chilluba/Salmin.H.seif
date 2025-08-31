import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const Home: React.FC = () => {
  return (
    <motion.div 
      className="min-h-[calc(100vh-10rem)] flex items-center justify-center text-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="relative z-10">
        <motion.h1
          className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] tracking-tighter text-[#F5F7FA] leading-none"
          variants={itemVariants}
        >
          SALMIN HABIBU SEIF
        </motion.h1>
        <motion.p className="font-accent text-xl sm:text-2xl md:text-3xl uppercase tracking-widest text-[#A1A1AA] mt-2" variants={itemVariants}>
          Multidisciplinary Creative & Technologist
        </motion.p>
        <motion.p className="max-w-2xl mx-auto mt-6 text-[#A1A1AA]" variants={itemVariants}>
          Blending business, technology, and art. Specializing in 3D design, videography, graphic design, coding, and philosophical storytelling.
        </motion.p>
        <motion.div variants={itemVariants} className="mt-10">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#E50914] text-[#F5F7FA] font-bold uppercase tracking-wider rounded-md hover:bg-[#FF3B3B] transition-colors transform hover:scale-105"
          >
            View My Work
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
      {/* Optional: Add background visual effects here */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" style={{
          backgroundImage: 'linear-gradient(to right, #27272A 1px, transparent 1px), linear-gradient(to bottom, #27272A 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}></div>
    </motion.div>
  );
};
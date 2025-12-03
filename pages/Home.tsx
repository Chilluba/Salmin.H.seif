
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const HOME_BACKGROUND_URL = "https://i.imgur.com/4qNSOOt.jpeg";

export const Home: React.FC = () => {
  const { content } = useContent();
  const { tagline, description } = content.home;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Layer */}
        <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: `url('${HOME_BACKGROUND_URL}')` }}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-black/40"></div>
        </div>

        {/* Content Layer */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
            <motion.div 
              className="max-w-5xl mx-auto text-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
                <motion.div 
                  variants={itemVariants}
                  className="inline-block mb-4 px-4 py-1 border border-[#e63946] rounded-full bg-black/50 backdrop-blur-md"
                >
                   <span className="font-code text-[#e63946] text-sm tracking-widest uppercase">Portfolio 2025</span>
                </motion.div>

                <motion.h1
                    className="font-display text-6xl sm:text-8xl md:text-9xl tracking-wide text-white leading-[0.9] mb-6 drop-shadow-2xl"
                    variants={itemVariants}
                >
                    SALMIN HABIBU SEIF
                </motion.h1>
                
                <motion.div variants={itemVariants} className="bg-black/40 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 max-w-3xl mx-auto shadow-2xl">
                    <p className="font-accent text-xl sm:text-2xl text-[#E50914] mb-4 tracking-wider">
                        {tagline}
                    </p>
                    <p className="text-lg sm:text-xl text-gray-300 leading-relaxed font-light">
                        {description}
                    </p>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-10">
                    <Link
                        to="/portfolio"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[#e63946] text-white font-display text-2xl tracking-wider hover:bg-[#d90429] transition-all transform hover:scale-105 hover:shadow-[0_0_20px_rgba(230,57,70,0.5)] rounded-sm"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)' }}
                    >
                        View My Work <ArrowRight size={24} />
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    </div>
  );
};

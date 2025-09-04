import React, { useState, useEffect } from 'react';
// FIX: Imported `Variants` type from framer-motion to resolve type errors.
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Settings } from 'lucide-react';
import { SimpleBackground } from '../components/SimpleBackground';
import { FullAdminDashboard } from '../components/FullAdminDashboard';

// FIX: Explicitly typed with `Variants` to ensure type compatibility with framer-motion.
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.5,
    },
  },
};

// FIX: Explicitly typed with `Variants` to ensure type compatibility with framer-motion.
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export const Home: React.FC = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    // Listen for admin dashboard open event from /login route
    const handleOpenAdmin = () => {
      setIsAdminOpen(true);
    };

    window.addEventListener('open-admin-dashboard', handleOpenAdmin);
    
    return () => {
      window.removeEventListener('open-admin-dashboard', handleOpenAdmin);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen -ml-4 sm:-ml-6 lg:-ml-8 -mt-8 md:-mt-16 flex items-center justify-center overflow-hidden">
        {/* Simple Background */}
        <SimpleBackground />
        
        {/* Admin Access Button */}
        <button
          onClick={() => setIsAdminOpen(true)}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
          title="Admin Dashboard"
        >
          <Settings size={20} />
        </button>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            {/* Left Side: Text Content */}
            <motion.div 
              className="md:col-span-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
                <div className="bg-black/50 p-6 sm:p-8 rounded-md border-4 border-white backdrop-blur-sm text-center md:text-left">
                    <motion.h1
                        className="font-display text-6xl sm:text-8xl md:text-9xl tracking-wider text-white leading-none"
                        // FIX: Changed `text-shadow` to `textShadow` for JSX style prop compatibility. This also resolves subsequent parsing errors.
                        style={{ textShadow: '4px 4px 0px #000' }}
                        variants={itemVariants}
                    >
                        SALMIN HABIBU SEIF
                    </motion.h1>
                    <motion.p className="font-accent text-xl sm:text-2xl uppercase tracking-widest text-gray-300 mt-2" variants={itemVariants}>
                        Multidisciplinary Creative & Technologist
                    </motion.p>
                    <motion.p className="max-w-2xl mx-auto md:mx-0 mt-6 text-gray-300" variants={itemVariants}>
                        Blending business, technology, and art. Specializing in 3D design, videography, graphic design, and philosophical storytelling.
                    </motion.p>
                    <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
                        <Link
                            to="/portfolio"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-[#e63946] text-white font-display text-2xl tracking-wider hover:bg-[#d90429] transition-colors transform hover:scale-105"
                            style={{
                                clipPath: 'polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)'
                            }}
                        >
                            View My Work <ArrowRight size={24} />
                        </Link>
                        {/* Quip in speech bubble */}
                        <div className="relative font-accent bg-white text-black py-2 px-4 rounded-lg">
                            <p>Or don't. Your loss, pal!</p>
                            <div className="absolute left-4 -bottom-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white"></div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Side: Character Image */}
            <motion.div 
                className="md:col-span-2 hidden md:flex justify-center items-end h-full"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            >
                <img src="https://i.imgur.com/gBwva9K.png" alt="Salmin Habibu Seif as a comic character" className="max-h-[90vh] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.7)]" />
            </motion.div>
        </div>
        
        {/* Admin Dashboard */}
        <FullAdminDashboard 
          isOpen={isAdminOpen} 
          onClose={() => setIsAdminOpen(false)} 
        />
    </div>
  );
};

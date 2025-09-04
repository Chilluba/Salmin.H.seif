
import React, { useState, useEffect, useRef } from 'react';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const defaultContent = {
  tagline: 'Multidisciplinary Creative & Technologist',
  description: 'Blending business, technology, and art. Specializing in 3D design, videography, graphic design, and philosophical storytelling.',
  background: 'https://i.imgur.com/Y5tM2nb.jpg'
};

export const Home: React.FC = () => {
  const [background, setBackground] = useState(defaultContent.background);
  const [tagline, setTagline] = useState(defaultContent.tagline);
  const [description, setDescription] = useState(defaultContent.description);
  const characterImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const customBg = localStorage.getItem('homeBackground');
    if (customBg) setBackground(customBg);

    const customTagline = localStorage.getItem('homeTagline');
    if (customTagline) setTagline(customTagline);

    const customDesc = localStorage.getItem('homeDescription');
    if (customDesc) setDescription(customDesc);
  }, []);

  useEffect(() => {
    const imageElement = characterImageRef.current;
    if (imageElement) {
      const handleLoad = () => {
        // Imgur's "not found" placeholder is a small image (e.g., 161x81).
        // A real character image should be significantly larger.
        // We set a threshold to hide the image element if it seems to be the placeholder.
        if (imageElement.naturalWidth < 200 || imageElement.naturalHeight < 200) {
          imageElement.style.display = 'none';
        }
      };

      const handleError = () => {
        imageElement.style.display = 'none';
      };

      imageElement.addEventListener('load', handleLoad);
      imageElement.addEventListener('error', handleError);
      
      // Handle cached images that might have already finished loading
      if (imageElement.complete && imageElement.naturalWidth > 0) {
          handleLoad();
      }

      // Cleanup listeners on component unmount
      return () => {
        imageElement.removeEventListener('load', handleLoad);
        imageElement.removeEventListener('error', handleError);
      };
    }
  }, []);


  return (
    <div className="relative w-screen h-screen -ml-4 sm:-ml-6 lg:-ml-8 -mt-24 md:-mt-32 flex items-center justify-center overflow-hidden box-border pt-24 md:pt-32">
        {/* Background Image */}
        <div 
            className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-500"
            style={{ backgroundImage: `url('${background}')` }}
        >
            <div className="absolute inset-0 bg-black/40"></div> {/* Overlay */}
        </div>

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
                        style={{ textShadow: '4px 4px 0px #000' }}
                        variants={itemVariants}
                    >
                        SALMIN HABIBU SEIF
                    </motion.h1>
                    <motion.p className="font-accent text-xl sm:text-2xl uppercase tracking-widest text-gray-300 mt-2" variants={itemVariants}>
                        {tagline}
                    </motion.p>
                    <motion.p className="max-w-2xl mx-auto md:mx-0 mt-6 text-gray-300" variants={itemVariants}>
                        {description}
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
                <img ref={characterImageRef} src="https://i.imgur.com/gBwva9K.png" alt="Salmin Habibu Seif as a comic character" className="max-h-[90vh] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.7)]" />
            </motion.div>
        </div>
    </div>
  );
};

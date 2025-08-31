import React, { useState, useEffect } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code } from 'lucide-react';
import { NAV_LINKS } from '../constants';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeLinkStyle = {
    color: '#E50914',
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0B0B0C]/80 backdrop-blur-lg border-b border-[#27272A]' : 'bg-transparent'}`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <RouterNavLink to="/" className="flex items-center space-x-2 text-2xl font-display tracking-wider text-[#F5F7FA] hover:text-[#E50914] transition-colors">
            <Code size={28} className="text-[#E50914]" />
            <span>SALMIN H. SEIF</span>
          </RouterNavLink>

          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <RouterNavLink
                key={link.name}
                to={link.path}
                className="font-accent uppercase tracking-widest text-[#A1A1AA] hover:text-[#F5F7FA] transition-colors"
                style={({ isActive }) => (isActive ? activeLinkStyle : {})}
              >
                {link.name}
              </RouterNavLink>
            ))}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#F5F7FA]">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#121317] border-t border-[#27272A]"
          >
            <motion.div 
                className="flex flex-col items-center space-y-6 py-8"
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
            >
              {NAV_LINKS.map((link) => (
                <motion.div key={link.name} variants={menuItemVariants}>
                    <RouterNavLink
                    to={link.path}
                    className="font-accent text-2xl uppercase tracking-widest text-[#A1A1AA] hover:text-[#F5F7FA] transition-colors"
                    onClick={() => setIsOpen(false)}
                    style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                    >
                    {link.name}
                    </RouterNavLink>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
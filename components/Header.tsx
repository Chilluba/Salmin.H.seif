
import React, { useState, useEffect } from 'react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Settings } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { PasswordModal } from './PasswordModal';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHomePage ? 'bg-[#0B0B0C]/80 backdrop-blur-lg border-b border-[#27272A]' : 'bg-transparent'}`;

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <header className={headerClass}>
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <RouterNavLink to="/" className="text-3xl font-display tracking-wider text-[#F5F7FA] hover:text-[#e63946] transition-colors">
              <span>SALMIN H. SEIF</span>
            </RouterNavLink>

            <div className="hidden md:flex items-center space-x-10">
              {NAV_LINKS.map((link) => (
                <RouterNavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => `nav-bubble ${isActive ? 'active' : ''}`}
                >
                  {link.name}
                </RouterNavLink>
              ))}
               <button 
                onClick={() => setIsPasswordModalOpen(true)} 
                className="text-[#A1A1AA] hover:text-[#e63946] transition-colors" 
                aria-label="Open Admin Settings"
                title="Settings"
              >
                  <Settings size={24} />
              </button>
            </div>

            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={() => setIsPasswordModalOpen(true)} 
                className="text-[#F5F7FA]"
                aria-label="Open Admin Settings"
              >
                  <Settings size={28} />
              </button>
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
              className="md:hidden bg-[#121317]/95 border-t border-[#27272A]"
            >
              <motion.div 
                  className="flex flex-col items-center space-y-8 py-8"
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
                        style={({ isActive }) => (isActive ? { color: '#e63946' } : {})}
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
      <PasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </>
  );
};

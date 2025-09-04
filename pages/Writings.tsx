
import React from 'react';
// FIX: Added the `Variants` type from framer-motion to resolve type errors.
import { motion, useScroll, useSpring, Variants } from 'framer-motion';
import { WRITINGS } from '../data/writings';

// FIX: Explicitly typed with `Variants` to ensure type compatibility with framer-motion.
const headingVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// FIX: Explicitly typed with `Variants` to ensure type compatibility with framer-motion.
const textBlockVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export const Writings: React.FC = () => {
  const essay = WRITINGS[0]; // For now, we're just displaying the first essay

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div
        className="fixed top-20 left-0 right-0 h-1 bg-[#E50914] origin-[0%]"
        style={{ scaleX }}
        aria-hidden="true"
      />
      <motion.div
        className="max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
      >
        <header className="text-center mb-12 md:mb-16">
          <motion.h1
            className="font-display text-5xl md:text-7xl text-[#F5F7FA] mb-2"
            variants={headingVariants}
          >
            {essay.title}
          </motion.h1>
          <motion.p
            className="font-accent text-lg md:text-xl text-[#A1A1AA] uppercase tracking-wider"
            variants={headingVariants}
          >
            {essay.tagline}
          </motion.p>
        </header>

        <article className="article-body text-[#A1A1AA] text-lg md:text-xl leading-relaxed space-y-6">
          {essay.content.map((block, index) => (
            <motion.div
              key={index}
              variants={textBlockVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {block.type === 'heading' ? (
                <h2 className="font-accent text-3xl md:text-4xl font-bold text-[#F5F7FA] mt-12 md:mt-16 mb-4">
                  {block.text}
                </h2>
              ) : (
                <p>
                  {block.text}
                </p>
              )}
            </motion.div>
          ))}
        </article>
      </motion.div>
    </>
  );
};

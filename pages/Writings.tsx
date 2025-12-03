
import React from 'react';
import { motion, useScroll, useSpring, Variants } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';

const headingVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const textBlockVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export const Writings: React.FC = () => {
  const { content } = useContent();
  const essay = content.writings[0];

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (!essay) {
    return (
      <div className="container mx-auto px-4 pt-32 text-center">
        <h1 className="font-display text-5xl">No Writings Found</h1>
        <p className="text-lg text-[#A1A1AA]">Add an article from the admin panel.</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="fixed top-24 left-0 right-0 h-1 bg-[#E50914] origin-[0%] z-40"
        style={{ scaleX }}
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-12">
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
                viewport={{ once: true, amount: 0.2 }}
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
      </div>
    </>
  );
};

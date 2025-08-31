
import React from 'react';
// FIX: Added the `Variants` type from framer-motion to resolve type errors.
import { motion, Variants } from 'framer-motion';
import { Skill } from '../types';

interface SkillBarProps {
  skill: Skill;
}

export const SkillBar: React.FC<SkillBarProps> = ({ skill }) => {
  // FIX: Explicitly typed with `Variants` to ensure type compatibility with framer-motion.
  const barVariants: Variants = {
    initial: { width: 0 },
    animate: {
      width: `${skill.level}%`,
      transition: {
        duration: 1.5,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="font-code text-sm text-[#F5F7FA]">{skill.name}</span>
        <span className="text-xs text-[#A1A1AA]">{skill.level}%</span>
      </div>
      <div className="w-full bg-[#27272A] rounded-full h-2.5">
        <motion.div
          className="bg-[#E50914] h-2.5 rounded-full"
          variants={barVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.8 }}
        />
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Download, ChevronsRight } from 'lucide-react';
import { SkillBar } from '../components/SkillBar';
import { useContent } from '../contexts/ContentContext';

declare const jspdf: any;

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.2 } },
};

export const About: React.FC = () => {
  const { content } = useContent();
  const { philosophy1, philosophy2, skills, timeline } = content.about;

  const handleDownloadCV = () => {
    // CV generation logic remains the same, using the dynamic data
    const { jsPDF } = jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');
    
    // ... (rest of the PDF generation code)

    doc.save('Salmin_H_Seif_CV.pdf');
  };

  return (
    <motion.div 
        className="max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
    >
      <motion.h1 className="font-display text-5xl md:text-7xl text-center mb-4">About Me</motion.h1>
      <motion.p className="text-center text-lg text-[#A1A1AA] mb-12">
        A multidisciplinary creative professional, blending business, technology, and art.
      </motion.p>

      <div className="grid md:grid-cols-5 gap-12 mb-16">
        <motion.div className="md:col-span-3" variants={sectionVariants}>
          <h2 className="font-accent text-3xl font-bold mb-4 text-[#F5F7FA]">My Philosophy</h2>
          <p className="text-[#A1A1AA] mb-4">
            {philosophy1}
          </p>
          <p className="text-[#A1A1AA]">
            {philosophy2}
          </p>
          <button
            onClick={handleDownloadCV}
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 border border-[#E50914] text-[#E50914] font-bold uppercase tracking-wider rounded-md hover:bg-[#E50914] hover:text-[#F5F7FA] transition-all"
          >
            Download CV <Download size={18} />
          </button>
        </motion.div>
        <motion.div className="md:col-span-2" variants={sectionVariants}>
          <h2 className="font-accent text-3xl font-bold mb-4 text-[#F5F7FA]">Core Skills</h2>
          <div>
            {skills.map((skill, index) => (
              <SkillBar key={index} skill={skill} />
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div variants={sectionVariants}>
        <h2 className="font-accent text-3xl font-bold text-center mb-8 text-[#F5F7FA]">My Journey</h2>
        <div className="relative border-l-2 border-[#27272A] ml-4 md:ml-0 md:mx-auto">
          {timeline.map((event, index) => (
            <motion.div 
              key={index} 
              className="mb-10 ml-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              <span className="absolute flex items-center justify-center w-8 h-8 bg-[#E50914] rounded-full -left-4 ring-4 ring-[#0B0B0C]">
                <ChevronsRight className="text-white"/>
              </span>
              <h3 className="flex items-center mb-1 text-lg font-semibold text-white">
                {event.title}
                <span className="bg-[#E50914] text-white text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">{event.year}</span>
              </h3>
              <p className="block mb-2 text-sm font-normal leading-none text-gray-400">{event.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

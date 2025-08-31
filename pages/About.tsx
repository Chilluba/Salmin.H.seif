import React from 'react';
import { motion } from 'framer-motion';
import { Download, ChevronsRight } from 'lucide-react';
import { SKILLS, TIMELINE } from '../constants';
import { SkillBar } from '../components/SkillBar';

// Declaring the jspdf global for TypeScript since it's loaded from a script tag.
declare const jspdf: any;

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.2 } },
};

export const About: React.FC = () => {

  const handleDownloadCV = () => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');

    const primaryColor = '#E50914';
    const textColor = '#333333';
    const lightTextColor = '#555555';
    const pageMargin = 40;
    const contentWidth = doc.internal.pageSize.getWidth() - pageMargin * 2;
    let cursorY = pageMargin;

    const checkPageBreak = (spaceNeeded: number) => {
        if (cursorY + spaceNeeded > doc.internal.pageSize.getHeight() - pageMargin) {
            doc.addPage();
            cursorY = pageMargin;
        }
    };

    // --- HEADER ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(textColor);
    doc.text('SALMIN HABIBU SEIF', pageMargin, cursorY);
    cursorY += 28;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.text('Multidisciplinary Creative & Technologist', pageMargin, cursorY);
    cursorY += 20;

    doc.setFontSize(9);
    doc.setTextColor(lightTextColor);
    const contactInfo = 'salminhabibu2000@gmail.com  |  +255 692 156 182  |  Dar es Salaam, Tanzania';
    doc.text(contactInfo, pageMargin, cursorY);
    cursorY += 25;

    doc.setDrawColor(primaryColor);
    doc.setLineWidth(1.5);
    doc.line(pageMargin, cursorY, contentWidth + pageMargin, cursorY);
    cursorY += 25;

    // --- SUMMARY ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text('PROFESSIONAL SUMMARY', pageMargin, cursorY);
    cursorY += 20;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    const summaryText = "My work merges precision, creativity, and critical thinking, shaped by a deep exploration of consciousness, communication, and human understanding. I bring strategic value, adaptability, and innovation to every project and organization I engage with. I independently specialize in 3D design, videography, graphic design, coding, and philosophical storytelling, aiming to create work that is not only aesthetically pleasing but also communicates a clear and compelling message.";
    const summaryLines = doc.splitTextToSize(summaryText, contentWidth);
    doc.text(summaryLines, pageMargin, cursorY);
    cursorY += summaryLines.length * 12 + 15;

    // --- CORE SKILLS ---
    checkPageBreak(150);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text('CORE SKILLS', pageMargin, cursorY);
    cursorY += 20;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    
    const midPoint = Math.ceil(SKILLS.length / 2);
    const skillsCol1 = SKILLS.slice(0, midPoint);
    const skillsCol2 = SKILLS.slice(midPoint);
    
    let initialY = cursorY;
    skillsCol1.forEach(skill => {
        doc.text(`• ${skill.name}`, pageMargin, cursorY);
        cursorY += 15;
    });

    let secondColY = initialY;
    skillsCol2.forEach(skill => {
        doc.text(`• ${skill.name}`, pageMargin + contentWidth / 2, secondColY);
        secondColY += 15;
    });
    cursorY = Math.max(cursorY, secondColY) + 15;

    // --- PROFESSIONAL JOURNEY ---
    checkPageBreak(80);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text('PROFESSIONAL JOURNEY', pageMargin, cursorY);
    cursorY += 20;

    TIMELINE.forEach(event => {
        checkPageBreak(60);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(textColor);
        doc.text(`${event.title} — ${event.year}`, pageMargin, cursorY);
        cursorY += 16;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(lightTextColor);
        const descLines = doc.splitTextToSize(event.description, contentWidth - 10); // small indent
        doc.text(descLines, pageMargin + 10, cursorY);
        cursorY += descLines.length * 12 + 15;
    });

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
            My work merges precision, creativity, and critical thinking, shaped by a deep exploration of consciousness, communication, and human understanding. I bring strategic value, adaptability, and innovation to every project and organization I engage with.
          </p>
          <p className="text-[#A1A1AA]">
            I independently specialize in 3D design, videography, graphic design, coding, and philosophical storytelling, aiming to create work that is not only aesthetically pleasing but also communicates a clear and compelling message.
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
            {SKILLS.map((skill, index) => (
              <SkillBar key={index} skill={skill} />
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div variants={sectionVariants}>
        <h2 className="font-accent text-3xl font-bold text-center mb-8 text-[#F5F7FA]">My Journey</h2>
        <div className="relative border-l-2 border-[#27272A] ml-4 md:ml-0 md:mx-auto">
          {TIMELINE.map((event, index) => (
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
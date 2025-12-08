import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';
import { motion, Variants } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';

const { useParams, Link, useNavigate } = ReactRouterDOM;

export const ProjectDetail: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { content } = useContent();
    const navigate = useNavigate();

    // Find project by ID, ensuring projectId is treated as a number for comparison
    const project = content.portfolio.find(p => p.id.toString() === projectId);

    // Effect to scroll to top on component mount
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [projectId]);

    if (!project) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 text-center py-20">
                <h1 className="font-display text-4xl mb-4">Project Not Found</h1>
                <p className="text-[#A1A1AA] mb-8">The project you're looking for doesn't seem to exist.</p>
                <Link to="/portfolio" className="inline-flex items-center gap-2 px-6 py-3 bg-[#e63946] text-white font-display text-xl tracking-wider hover:bg-[#d90429] transition-colors">
                    <ArrowLeft size={20} /> Back to Portfolio
                </Link>
            </div>
        );
    }
    
    const pageVariants: Variants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
      exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-12">
            <motion.div 
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="max-w-4xl mx-auto"
            >
                <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors mb-8 group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
                
                <header className="mb-8 border-b border-[#27272A] pb-8">
                    <span className="font-code text-sm text-[#E50914] uppercase">{project.category}</span>
                    <h1 className="font-display text-5xl md:text-7xl mt-2 mb-4">{project.title}</h1>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-[#27272A] text-xs text-[#F5F7FA] rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                </header>

                <img src={project.imageUrl} alt={project.title} className="w-full rounded-lg shadow-lg mb-8" />
                
                <div className="article-body text-[#A1A1AA] text-lg leading-relaxed space-y-6">
                    <p className="text-xl text-[#F5F7FA] italic">{project.description}</p>
                    {project.detailContent?.map((item, index) => {
                        switch (item.type) {
                            case 'heading':
                                return <h2 key={index} className="font-accent text-3xl md:text-4xl font-bold text-[#F5F7FA] mt-12 mb-4">{item.content}</h2>;
                            case 'paragraph':
                                return <p key={index}>{item.content}</p>;
                            case 'image':
                                return <img key={index} src={item.content} alt={`Project detail image ${index + 1}`} className="w-full rounded-lg my-8" />;
                            default:
                                return null;
                        }
                    })}
                </div>
                
                {(project.liveUrl || project.sourceUrl) && (
                <div className="flex items-center space-x-6 mt-12 pt-8 border-t border-[#27272A]">
                    {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-lg font-accent uppercase tracking-wider text-[#A1A1AA] hover:text-[#E50914] transition-colors">
                            View Live Project <ExternalLink size={20} />
                        </a>
                    )}
                    {project.sourceUrl && (
                        <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-lg font-accent uppercase tracking-wider text-[#A1A1AA] hover:text-[#E50914] transition-colors">
                            View Source <Github size={20} />
                        </a>
                    )}
                </div>
                )}
            </motion.div>
        </div>
    );
};

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Save, Download, Trash2, Home, User, Briefcase, Mail, Edit3, Settings, PlusCircle, X } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { SiteContent, Project, Skill, TimelineEvent, ProjectCategory, Writing, WritingContent, ProjectDetailContent } from '../types';

type AdminTab = 'home' | 'about' | 'portfolio' | 'writings' | 'contact' | 'settings';

const inputStyle = "mt-1 block w-full bg-[#121317] border border-[#27272A] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#E50914] focus:border-[#E50914]";
const buttonStyle = "inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors";
const modalOverlayStyle = "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm";
const modalContentStyle = "bg-[#121317] border border-[#27272A] rounded-lg shadow-xl w-full max-w-2xl m-4 p-8 relative max-h-[90vh] overflow-y-auto";

const emptyProject: Project = { id: Date.now(), title: '', category: ProjectCategory.Design, description: '', imageUrl: '', tags: [], liveUrl: '', sourceUrl: '', detailContent: [] };

export const Admin: React.FC = () => {
    const { logout, changePassword } = useAuth();
    const navigate = useNavigate();
    const { content, updateContent } = useContent();

    const [activeTab, setActiveTab] = useState<AdminTab>('home');
    const [statusMessage, setStatusMessage] = useState('');
    
    // Local state for forms
    const [homeState, setHomeState] = useState(content.home);
    const [aboutState, setAboutState] = useState(content.about);
    const [portfolioState, setPortfolioState] = useState(content.portfolio);
    const [writingsState, setWritingsState] = useState(content.writings);
    const [contactState, setContactState] = useState(content.contact);
    
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [editingSkill, setEditingSkill] = useState<{skill: Skill, index: number} | null>(null);
    const [editingTimeline, setEditingTimeline] = useState<{event: TimelineEvent, index: number} | null>(null);
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const showStatusMessage = (message: string) => {
        setStatusMessage(message);
        setTimeout(() => setStatusMessage(''), 3000);
    };

    const handleSave = async (section: keyof SiteContent, data: any) => {
        await updateContent({ ...content, [section]: data });
        showStatusMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} content updated successfully!`);
    };
    
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if(newPassword && newPassword === confirmPassword) {
            await changePassword(newPassword);
            showStatusMessage('Password updated successfully!');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            showStatusMessage('Passwords do not match.');
        }
    };

    const handleExportContent = () => {
        const contentString = JSON.stringify(content, null, 2);
        const blob = new Blob([contentString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'siteContent_backup.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showStatusMessage('Content exported as siteContent_backup.json!');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // --- Portfolio Logic ---
    const handleSaveProject = (project: Project) => {
        const existing = portfolioState.find(p => p.id === project.id);
        if (existing) {
            setPortfolioState(portfolioState.map(p => p.id === project.id ? project : p));
        } else {
            setPortfolioState([project, ...portfolioState]);
        }
        setEditingProject(null);
    };
    const handleDeleteProject = (id: number) => {
        setPortfolioState(portfolioState.filter(p => p.id !== id));
    };

    // --- About Logic (Skills / Timeline) ---
    const handleSaveSkill = (skill: Skill, index: number | null) => {
        const newSkills = [...aboutState.skills];
        if (index !== null) {
            newSkills[index] = skill;
        } else {
            newSkills.push(skill);
        }
        setAboutState({ ...aboutState, skills: newSkills });
        setEditingSkill(null);
    };
    const handleDeleteSkill = (index: number) => {
        setAboutState({...aboutState, skills: aboutState.skills.filter((_, i) => i !== index)});
    };
    
    const handleSaveTimeline = (event: TimelineEvent, index: number | null) => {
        const newTimeline = [...aboutState.timeline];
        if (index !== null) {
            newTimeline[index] = event;
        } else {
            newTimeline.push(event);
        }
        setAboutState({ ...aboutState, timeline: newTimeline });
        setEditingTimeline(null);
    };
    const handleDeleteTimeline = (index: number) => {
        setAboutState({...aboutState, timeline: aboutState.timeline.filter((_, i) => i !== index)});
    };
    
    // --- Writings Logic ---
    const handleWritingContentChange = (index: number, newBlock: WritingContent) => {
        const newContent = [...writingsState[0].content];
        newContent[index] = newBlock;
        setWritingsState([{...writingsState[0], content: newContent}]);
    };
    const addWritingBlock = (type: 'paragraph' | 'heading') => {
        const newBlock = { type, text: '' };
        setWritingsState([{...writingsState[0], content: [...writingsState[0].content, newBlock]}]);
    };
    const deleteWritingBlock = (index: number) => {
        setWritingsState([{...writingsState[0], content: writingsState[0].content.filter((_, i) => i !== index)}]);
    };
     const moveWritingBlock = (index: number, direction: 'up' | 'down') => {
        const newContent = [...writingsState[0].content];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newContent.length) return;
        [newContent[index], newContent[targetIndex]] = [newContent[targetIndex], newContent[index]];
        setWritingsState([{ ...writingsState[0], content: newContent }]);
    };
    
    const tabs: { id: AdminTab, label: string, icon: React.ReactNode }[] = [
        { id: 'home', label: 'Home', icon: <Home size={18}/> },
        { id: 'about', label: 'About', icon: <User size={18}/> },
        { id: 'portfolio', label: 'Portfolio', icon: <Briefcase size={18}/> },
        { id: 'writings', label: 'Writings', icon: <Edit3 size={18}/> },
        { id: 'contact', label: 'Contact', icon: <Mail size={18}/> },
        { id: 'settings', label: 'Settings', icon: <Settings size={18}/> },
    ];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-5xl mx-auto"
            >
                <div className="flex justify-between items-center mb-8">
                    <h1 className="font-display text-5xl md:text-7xl">Admin Panel</h1>
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#E50914] hover:bg-[#c11119] transition-colors"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="md:w-1/4">
                        <div className="bg-[#121317] border border-[#27272A] rounded-lg p-4">
                            <nav className="flex flex-row md:flex-col gap-2">
                            {tabs.map(tab => (
                                <button 
                                    key={tab.id} 
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${activeTab === tab.id ? 'bg-[#E50914] text-white' : 'text-[#A1A1AA] hover:bg-[#27272A] hover:text-white'}`}
                                >
                                    {tab.icon}
                                    <span className="hidden md:inline">{tab.label}</span>
                                </button>
                            ))}
                            </nav>
                        </div>
                    </aside>
                    
                    <main className="flex-1">
                        <div className="bg-[#121317] border border-[#27272A] rounded-lg p-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {activeTab === 'home' && (
                                        <div className="space-y-8">
                                            <div>
                                                <h2 className="font-accent text-3xl font-bold mb-4">Homepage Content</h2>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label htmlFor="tagline" className="block text-sm font-medium text-[#A1A1AA]">Tagline</label>
                                                        <input type="text" id="tagline" value={homeState.tagline} onChange={e => setHomeState({...homeState, tagline: e.target.value})} className={inputStyle} />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="description" className="block text-sm font-medium text-[#A1A1AA]">Description</label>
                                                        <textarea id="description" rows={4} value={homeState.description} onChange={e => setHomeState({...homeState, description: e.target.value})} className={inputStyle}></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <button onClick={() => handleSave('home', homeState)} className={buttonStyle}><Save size={18} /> Save Home</button>
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === 'about' && (
                                        <div className="space-y-8">
                                            <h2 className="font-accent text-3xl font-bold mb-4">About Page Content</h2>
                                            <div>
                                                <label htmlFor="philosophy1" className="block text-sm font-medium text-[#A1A1AA]">Philosophy (Paragraph 1)</label>
                                                <textarea id="philosophy1" rows={4} value={aboutState.philosophy1} onChange={e => setAboutState({...aboutState, philosophy1: e.target.value})} className={inputStyle}></textarea>
                                            </div>
                                            <div>
                                                <label htmlFor="philosophy2" className="block text-sm font-medium text-[#A1A1AA]">Philosophy (Paragraph 2)</label>
                                                <textarea id="philosophy2" rows={4} value={aboutState.philosophy2} onChange={e => setAboutState({...aboutState, philosophy2: e.target.value})} className={inputStyle}></textarea>
                                            </div>
                                            
                                            {/* Skills Management */}
                                            <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-accent text-2xl">Core Skills</h3>
                                                <button onClick={() => setEditingSkill({skill: {name: '', level: 80}, index: null})} className="inline-flex items-center gap-2 px-4 py-1 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700">
                                                    <PlusCircle size={16} /> Add Skill
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {aboutState.skills.map((skill, index) => (
                                                    <div key={index} className="flex items-center justify-between bg-[#0B0B0C] p-2 rounded">
                                                        <span>{skill.name} - {skill.level}%</span>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => setEditingSkill({skill, index})} className="text-blue-400 hover:text-blue-300">Edit</button>
                                                            <button onClick={() => handleDeleteSkill(index)} className="text-red-500 hover:text-red-400">Delete</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            </div>

                                            {/* Timeline Management */}
                                            <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-accent text-2xl">My Journey (Timeline)</h3>
                                                <button onClick={() => setEditingTimeline({event: {year: '', title: '', description: ''}, index: null})} className="inline-flex items-center gap-2 px-4 py-1 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700">
                                                    <PlusCircle size={16} /> Add Event
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {aboutState.timeline.map((event, index) => (
                                                    <div key={index} className="flex items-center justify-between bg-[#0B0B0C] p-2 rounded">
                                                        <span>{event.year} - {event.title}</span>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => setEditingTimeline({event, index})} className="text-blue-400 hover:text-blue-300">Edit</button>
                                                            <button onClick={() => handleDeleteTimeline(index)} className="text-red-500 hover:text-red-400">Delete</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <button onClick={() => handleSave('about', aboutState)} className={buttonStyle}><Save size={18} /> Save About</button>
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === 'portfolio' && (
                                        <div>
                                            <div className="flex justify-between items-center mb-6">
                                                <h2 className="font-accent text-3xl font-bold">Portfolio Projects</h2>
                                                <button onClick={() => setEditingProject({ ...emptyProject, id: Date.now() })} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700">
                                                    <PlusCircle size={18} /> Add Project
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                {portfolioState.map(project => (
                                                    <div key={project.id} className="flex items-center justify-between bg-[#0B0B0C] p-4 rounded-lg">
                                                        <div>
                                                            <h4 className="font-bold text-lg">{project.title}</h4>
                                                            <p className="text-sm text-gray-400">{project.category}</p>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <button onClick={() => setEditingProject(project)} className="text-blue-400 hover:text-blue-300 font-semibold">Edit</button>
                                                            <button onClick={() => handleDeleteProject(project.id)} className="text-red-500 hover:text-red-400 font-semibold"><Trash2 size={20}/></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-end mt-8">
                                                <button onClick={() => handleSave('portfolio', portfolioState)} className={buttonStyle}><Save size={18} /> Save Portfolio</button>
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === 'writings' && writingsState.length > 0 && (
                                        <div className="space-y-6">
                                            <h2 className="font-accent text-3xl font-bold">Edit Article</h2>
                                            <div>
                                                <label htmlFor="writing-title" className="block text-sm font-medium text-[#A1A1AA]">Title</label>
                                                <input type="text" id="writing-title" value={writingsState[0].title} onChange={e => setWritingsState([{...writingsState[0], title: e.target.value}])} className={inputStyle} />
                                            </div>
                                            <div>
                                                <label htmlFor="writing-tagline" className="block text-sm font-medium text-[#A1A1AA]">Tagline</label>
                                                <input type="text" id="writing-tagline" value={writingsState[0].tagline} onChange={e => setWritingsState([{...writingsState[0], tagline: e.target.value}])} className={inputStyle} />
                                            </div>
                                            <h3 className="font-accent text-2xl border-b border-[#27272A] pb-2">Content Blocks</h3>
                                            <div className="space-y-4">
                                                {writingsState[0].content.map((block, index) => (
                                                    <div key={index} className="bg-[#0B0B0C] p-4 rounded-md space-y-2">
                                                        <div className="flex justify-between items-center">
                                                            <select value={block.type} onChange={e => handleWritingContentChange(index, {...block, type: e.target.value as 'heading' | 'paragraph'})} className="bg-[#27272A] rounded p-1 text-sm">
                                                                <option value="paragraph">Paragraph</option>
                                                                <option value="heading">Heading</option>
                                                            </select>
                                                            <div className="flex gap-2">
                                                                <button onClick={() => moveWritingBlock(index, 'up')} disabled={index === 0} className="disabled:opacity-25">↑</button>
                                                                <button onClick={() => moveWritingBlock(index, 'down')} disabled={index === writingsState[0].content.length - 1} className="disabled:opacity-25">↓</button>
                                                                <button onClick={() => deleteWritingBlock(index)} className="text-red-500"><Trash2 size={16}/></button>
                                                            </div>
                                                        </div>
                                                        <textarea rows={block.type === 'heading' ? 2 : 5} value={block.text} onChange={e => handleWritingContentChange(index, {...block, text: e.target.value})} className={`${inputStyle} text-sm`}></textarea>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={() => addWritingBlock('paragraph')} className="text-sm bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">+ Paragraph</button>
                                                <button onClick={() => addWritingBlock('heading')} className="text-sm bg-purple-600 px-3 py-1 rounded hover:bg-purple-700">+ Heading</button>
                                            </div>
                                            <div className="flex justify-end mt-4">
                                                <button onClick={() => handleSave('writings', writingsState)} className={buttonStyle}><Save size={18} /> Save Writings</button>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'contact' && (
                                        <div className="space-y-8">
                                            <h2 className="font-accent text-3xl font-bold mb-4">Contact Information</h2>
                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium text-[#A1A1AA]">Email</label>
                                                    <input type="email" id="email" value={contactState.email} onChange={e => setContactState({...contactState, email: e.target.value})} className={inputStyle} />
                                                </div>
                                                <div>
                                                    <label htmlFor="phone" className="block text-sm font-medium text-[#A1A1AA]">Phone</label>
                                                    <input type="tel" id="phone" value={contactState.phone} onChange={e => setContactState({...contactState, phone: e.target.value})} className={inputStyle} />
                                                </div>
                                                <div>
                                                    <label htmlFor="location" className="block text-sm font-medium text-[#A1A1AA]">Location</label>
                                                    <input type="text" id="location" value={contactState.location} onChange={e => setContactState({...contactState, location: e.target.value})} className={inputStyle} />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <button onClick={() => handleSave('contact', contactState)} className={buttonStyle}><Save size={18} /> Save Contact</button>
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === 'settings' && (
                                        <div className="space-y-12">
                                            <div>
                                                <h2 className="font-accent text-3xl font-bold mb-4">Admin Settings</h2>
                                                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
                                                    <div>
                                                        <label htmlFor="new-password">New Password</label>
                                                        <input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inputStyle} />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="confirm-password">Confirm New Password</label>
                                                        <input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputStyle} />
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <button type="submit" className={buttonStyle}><Save size={18} /> Change Password</button>
                                                    </div>
                                                </form>
                                            </div>
                                            <div>
                                                <h2 className="font-accent text-3xl font-bold mb-4">Global Content Persistence</h2>
                                                <p className="text-[#A1A1AA] mb-4 text-sm">
                                                    All content changes are now saved automatically and are visible across all devices. The data is stored securely in the cloud. You no longer need to manually export and update content files.
                                                </p>
                                                <p className="text-[#A1A1AA] mb-4 text-sm">
                                                    You can still export your content as a JSON file for backup purposes.
                                                </p>
                                                <button
                                                    onClick={handleExportContent}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
                                                >
                                                    <Download size={16} /> Export Backup File
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </main>
                </div>

                {/* Modals */}
                <ProjectEditModal isOpen={!!editingProject} project={editingProject} onClose={() => setEditingProject(null)} onSave={handleSaveProject} />
                <SkillEditModal isOpen={!!editingSkill} skillData={editingSkill} onClose={() => setEditingSkill(null)} onSave={handleSaveSkill} />
                <TimelineEditModal isOpen={!!editingTimeline} timelineData={editingTimeline} onClose={() => setEditingTimeline(null)} onSave={handleSaveTimeline} />

                <AnimatePresence>
                    {statusMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#27272A] text-white py-3 px-6 rounded-lg shadow-lg z-[101]"
                        >
                            {statusMessage}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

// --- MODAL COMPONENTS ---

interface ProjectEditModalProps {
    isOpen: boolean;
    project: Project | null;
    onClose: () => void;
    onSave: (project: Project) => void;
}
const ProjectEditModal: React.FC<ProjectEditModalProps> = ({ isOpen, project, onClose, onSave }) => {
    const [formData, setFormData] = useState<Project>(emptyProject);

    React.useEffect(() => {
        setFormData(project || emptyProject);
    }, [project]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'tags') {
            setFormData({...formData, tags: value.split(',').map(tag => tag.trim())});
        } else {
            setFormData({...formData, [name]: value });
        }
    };

    const handleDetailContentChange = (index: number, newBlock: ProjectDetailContent) => {
        const newContent = [...(formData.detailContent || [])];
        newContent[index] = newBlock;
        setFormData({...formData, detailContent: newContent});
    };
    
    const addDetailBlock = (type: 'paragraph' | 'heading' | 'image') => {
        const newBlock = { type, content: '' };
        setFormData({...formData, detailContent: [...(formData.detailContent || []), newBlock]});
    };
    
    const deleteDetailBlock = (index: number) => {
        setFormData({...formData, detailContent: (formData.detailContent || []).filter((_, i) => i !== index)});
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;
    return (
        <div className={modalOverlayStyle} onClick={onClose}>
            <div className={modalContentStyle} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-[#A1A1AA] hover:text-white"><X/></button>
                <h2 className="font-accent text-3xl mb-6">{formData.id ? 'Edit Project' : 'Add New Project'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label>Title</label><input name="title" value={formData.title} onChange={handleChange} className={inputStyle} /></div>
                        <div><label>Category</label><select name="category" value={formData.category} onChange={handleChange} className={inputStyle}>{Object.values(ProjectCategory).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    </div>
                    <div><label>Description (for card)</label><textarea name="description" value={formData.description} onChange={handleChange} rows={3} className={inputStyle}></textarea></div>
                    <div><label>Cover Image URL</label><input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className={inputStyle} /></div>
                    <div><label>Tags (comma-separated)</label><input name="tags" value={formData.tags.join(', ')} onChange={handleChange} className={inputStyle} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div><label>Live URL (Optional)</label><input name="liveUrl" value={formData.liveUrl} onChange={handleChange} className={inputStyle} /></div>
                       <div><label>Source URL (Optional)</label><input name="sourceUrl" value={formData.sourceUrl} onChange={handleChange} className={inputStyle} /></div>
                    </div>

                    <div className="mt-6 border-t border-[#27272A] pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-accent text-2xl">Detail Page Content</h3>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => addDetailBlock('paragraph')} className="text-xs bg-blue-600 px-2 py-1 rounded hover:bg-blue-700">+ Para</button>
                                <button type="button" onClick={() => addDetailBlock('heading')} className="text-xs bg-purple-600 px-2 py-1 rounded hover:bg-purple-700">+ Head</button>
                                <button type="button" onClick={() => addDetailBlock('image')} className="text-xs bg-teal-600 px-2 py-1 rounded hover:bg-teal-700">+ Img</button>
                            </div>
                        </div>
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {(formData.detailContent || []).map((block, index) => (
                                <div key={index} className="bg-[#0B0B0C] p-3 rounded-md space-y-2">
                                    <div className="flex justify-between items-center">
                                        <select value={block.type} onChange={e => handleDetailContentChange(index, {...block, type: e.target.value as any})} className="bg-[#27272A] rounded p-1 text-xs">
                                            <option value="paragraph">Paragraph</option>
                                            <option value="heading">Heading</option>
                                            <option value="image">Image</option>
                                        </select>
                                        <button type="button" onClick={() => deleteDetailBlock(index)} className="text-red-500 hover:text-red-400"><Trash2 size={16}/></button>
                                    </div>
                                    <textarea
                                        rows={block.type === 'heading' ? 2 : (block.type === 'paragraph' ? 4 : 2)}
                                        value={block.content}
                                        placeholder={block.type === 'image' ? 'Image URL...' : 'Text content...'}
                                        onChange={e => handleDetailContentChange(index, {...block, content: e.target.value})}
                                        className={`${inputStyle} text-sm`}
                                    ></textarea>
                                </div>
                            ))}
                            {(formData.detailContent || []).length === 0 && <p className="text-center text-sm text-gray-500">No detail content yet. Add some!</p>}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4"><button type="submit" className={buttonStyle}><Save size={18}/> Save Project</button></div>
                </form>
            </div>
        </div>
    );
};

interface SkillEditModalProps {
    isOpen: boolean;
    skillData: { skill: Skill, index: number | null } | null;
    onClose: () => void;
    onSave: (skill: Skill, index: number | null) => void;
}
const SkillEditModal: React.FC<SkillEditModalProps> = ({ isOpen, skillData, onClose, onSave }) => {
    const [skill, setSkill] = useState<Skill>({name: '', level: 80});

    React.useEffect(() => {
        setSkill(skillData?.skill || {name: '', level: 80});
    }, [skillData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(skill, skillData?.index ?? null);
    };

    if (!isOpen) return null;
    return (
         <div className={modalOverlayStyle} onClick={onClose}>
            <div className={modalContentStyle} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-[#A1A1AA] hover:text-white"><X/></button>
                <h2 className="font-accent text-3xl mb-6">{skillData?.index !== null ? 'Edit Skill' : 'Add New Skill'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label>Skill Name</label><input value={skill.name} onChange={e => setSkill({...skill, name: e.target.value})} className={inputStyle}/></div>
                    <div><label>Proficiency Level: {skill.level}%</label><input type="range" min="0" max="100" value={skill.level} onChange={e => setSkill({...skill, level: parseInt(e.target.value, 10)})} className="w-full"/></div>
                    <div className="flex justify-end pt-4"><button type="submit" className={buttonStyle}><Save size={18}/> Save Skill</button></div>
                </form>
            </div>
        </div>
    );
};

interface TimelineEditModalProps {
    isOpen: boolean;
    timelineData: { event: TimelineEvent, index: number | null } | null;
    onClose: () => void;
    onSave: (event: TimelineEvent, index: number | null) => void;
}
const TimelineEditModal: React.FC<TimelineEditModalProps> = ({ isOpen, timelineData, onClose, onSave }) => {
    const [event, setEvent] = useState<TimelineEvent>({year: '', title: '', description: ''});
    
    React.useEffect(() => {
        setEvent(timelineData?.event || {year: '', title: '', description: ''});
    }, [timelineData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(event, timelineData?.index ?? null);
    };

    if (!isOpen) return null;
    return (
         <div className={modalOverlayStyle} onClick={onClose}>
            <div className={modalContentStyle} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-[#A1A1AA] hover:text-white"><X/></button>
                <h2 className="font-accent text-3xl mb-6">{timelineData?.index !== null ? 'Edit Timeline Event' : 'Add New Event'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1"><label>Year</label><input value={event.year} onChange={e => setEvent({...event, year: e.target.value})} className={inputStyle}/></div>
                        <div className="md:col-span-2"><label>Title</label><input value={event.title} onChange={e => setEvent({...event, title: e.target.value})} className={inputStyle}/></div>
                    </div>
                    <div><label>Description</label><textarea value={event.description} onChange={e => setEvent({...event, description: e.target.value})} rows={3} className={inputStyle}></textarea></div>
                    <div className="flex justify-end pt-4"><button type="submit" className={buttonStyle}><Save size={18}/> Save Event</button></div>
                </form>
            </div>
        </div>
    );
};

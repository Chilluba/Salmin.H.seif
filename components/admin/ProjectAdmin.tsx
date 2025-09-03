import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, ExternalLink, Github } from 'lucide-react';
import { Project, ProjectCategory } from '../../types';
import { PROJECTS } from '../../constants';

export const ProjectAdmin: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem('admin-projects');
      return stored ? JSON.parse(stored) : PROJECTS;
    } catch {
      return PROJECTS;
    }
  });
  
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const saveProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('admin-projects', JSON.stringify(updatedProjects));
    
    // Trigger update event for portfolio page
    window.dispatchEvent(new CustomEvent('projects-updated', { detail: updatedProjects }));
  };

  const handleAddNew = () => {
    const newProject: Project = {
      id: Math.max(...projects.map(p => p.id)) + 1,
      title: '',
      category: ProjectCategory.Design,
      description: '',
      imageUrl: 'https://picsum.photos/600/400',
      tags: [],
    };
    setEditingProject(newProject);
    setIsAddingNew(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject({ ...project });
    setIsAddingNew(false);
  };

  const handleSave = () => {
    if (!editingProject) return;

    if (!editingProject.title.trim() || !editingProject.description.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    let updatedProjects;
    if (isAddingNew) {
      updatedProjects = [...projects, editingProject];
    } else {
      updatedProjects = projects.map(p => p.id === editingProject.id ? editingProject : p);
    }

    saveProjects(updatedProjects);
    setEditingProject(null);
    setIsAddingNew(false);
  };

  const handleDelete = (projectId: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      saveProjects(updatedProjects);
    }
  };

  const handleCancel = () => {
    setEditingProject(null);
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Project Management</h3>
          <p className="text-gray-400">Add, edit, or remove portfolio projects.</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {/* Edit Form */}
      {editingProject && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#2a2a2a] border border-gray-600 rounded-lg p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white">
              {isAddingNew ? 'Add New Project' : 'Edit Project'}
            </h4>
            <button onClick={handleCancel} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                value={editingProject.title}
                onChange={(e) => setEditingProject(prev => prev ? { ...prev, title: e.target.value } : null)}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-red-500"
                placeholder="Project title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={editingProject.category}
                onChange={(e) => setEditingProject(prev => prev ? { ...prev, category: e.target.value as ProjectCategory } : null)}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-red-500"
              >
                {Object.values(ProjectCategory).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
              <textarea
                value={editingProject.description}
                onChange={(e) => setEditingProject(prev => prev ? { ...prev, description: e.target.value } : null)}
                rows={3}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-red-500"
                placeholder="Project description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
              <input
                type="url"
                value={editingProject.imageUrl}
                onChange={(e) => setEditingProject(prev => prev ? { ...prev, imageUrl: e.target.value } : null)}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-red-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={editingProject.tags.join(', ')}
                onChange={(e) => setEditingProject(prev => prev ? { ...prev, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) } : null)}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-red-500"
                placeholder="React, TypeScript, Design"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Live URL (optional)</label>
              <input
                type="url"
                value={editingProject.liveUrl || ''}
                onChange={(e) => setEditingProject(prev => prev ? { ...prev, liveUrl: e.target.value } : null)}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-red-500"
                placeholder="https://project-demo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Source URL (optional)</label>
              <input
                type="url"
                value={editingProject.sourceUrl || ''}
                onChange={(e) => setEditingProject(prev => prev ? { ...prev, sourceUrl: e.target.value } : null)}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-red-500"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Save Project
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Current Projects ({projects.length})</h4>
        <div className="grid gap-4">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layout
              className="bg-[#2a2a2a] border border-gray-600 rounded-lg p-4 flex items-center gap-4"
            >
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-16 h-16 object-cover rounded-md"
              />
              
              <div className="flex-1">
                <h5 className="text-white font-semibold">{project.title}</h5>
                <p className="text-gray-400 text-sm">{project.category}</p>
                <p className="text-gray-300 text-sm mt-1 line-clamp-2">{project.description}</p>
                <div className="flex gap-2 mt-2">
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {project.liveUrl && project.liveUrl !== '#' && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                    title="View Live"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
                {project.sourceUrl && project.sourceUrl !== '#' && (
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                    title="View Source"
                  >
                    <Github size={16} />
                  </a>
                )}
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
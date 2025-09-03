import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Eye } from 'lucide-react';
import { Writing, WritingContent } from '../../types';
import { WRITINGS } from '../../data/writings';

export const WritingsAdmin: React.FC = () => {
  const [writings, setWritings] = useState<Writing[]>(() => {
    try {
      const stored = localStorage.getItem('admin-writings');
      return stored ? JSON.parse(stored) : WRITINGS;
    } catch {
      return WRITINGS;
    }
  });
  
  const [editingWriting, setEditingWriting] = useState<Writing | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const saveWritings = (updatedWritings: Writing[]) => {
    setWritings(updatedWritings);
    localStorage.setItem('admin-writings', JSON.stringify(updatedWritings));
    
    // Trigger update event for writings page
    window.dispatchEvent(new CustomEvent('writings-updated', { detail: updatedWritings }));
  };

  const handleAddNew = () => {
    const newWriting: Writing = {
      id: `writing-${Date.now()}`,
      title: '',
      tagline: '',
      content: [
        { type: 'paragraph', text: '' }
      ],
    };
    setEditingWriting(newWriting);
    setIsAddingNew(true);
  };

  const handleEdit = (writing: Writing) => {
    setEditingWriting({ ...writing });
    setIsAddingNew(false);
  };

  const handleSave = () => {
    if (!editingWriting) return;

    if (!editingWriting.title.trim() || !editingWriting.tagline.trim()) {
      alert('Please fill in title and tagline.');
      return;
    }

    let updatedWritings;
    if (isAddingNew) {
      updatedWritings = [...writings, editingWriting];
    } else {
      updatedWritings = writings.map(w => w.id === editingWriting.id ? editingWriting : w);
    }

    saveWritings(updatedWritings);
    setEditingWriting(null);
    setIsAddingNew(false);
  };

  const handleDelete = (writingId: string) => {
    if (confirm('Are you sure you want to delete this writing?')) {
      const updatedWritings = writings.filter(w => w.id !== writingId);
      saveWritings(updatedWritings);
    }
  };

  const addContentBlock = (type: 'paragraph' | 'heading') => {
    if (!editingWriting) return;
    
    const newBlock: WritingContent = {
      type,
      text: ''
    };
    
    setEditingWriting(prev => prev ? {
      ...prev,
      content: [...prev.content, newBlock]
    } : null);
  };

  const updateContentBlock = (index: number, text: string) => {
    if (!editingWriting) return;
    
    setEditingWriting(prev => prev ? {
      ...prev,
      content: prev.content.map((block, i) => 
        i === index ? { ...block, text } : block
      )
    } : null);
  };

  const removeContentBlock = (index: number) => {
    if (!editingWriting) return;
    
    setEditingWriting(prev => prev ? {
      ...prev,
      content: prev.content.filter((_, i) => i !== index)
    } : null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Writing Management</h3>
          <p className="text-gray-400">Manage your philosophical writings and articles.</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <Plus size={16} />
          Add Writing
        </button>
      </div>

      {/* Edit Form */}
      {editingWriting && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#2a2a2a] border border-gray-600 rounded-lg p-6 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white">
              {isAddingNew ? 'Add New Writing' : 'Edit Writing'}
            </h4>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Eye size={14} />
                {previewMode ? 'Edit' : 'Preview'}
              </button>
              <button onClick={() => setEditingWriting(null)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
          </div>

          {!previewMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={editingWriting.title}
                  onChange={(e) => setEditingWriting(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-red-500"
                  placeholder="Writing title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tagline *</label>
                <input
                  type="text"
                  value={editingWriting.tagline}
                  onChange={(e) => setEditingWriting(prev => prev ? { ...prev, tagline: e.target.value } : null)}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-red-500"
                  placeholder="Brief description or tagline"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">Content Blocks</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addContentBlock('paragraph')}
                      className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                    >
                      + Paragraph
                    </button>
                    <button
                      onClick={() => addContentBlock('heading')}
                      className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                    >
                      + Heading
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {editingWriting.content.map((block, index) => (
                    <div key={index} className="relative group">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500 uppercase">{block.type}</span>
                        <button
                          onClick={() => removeContentBlock(index)}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      {block.type === 'heading' ? (
                        <input
                          type="text"
                          value={block.text}
                          onChange={(e) => updateContentBlock(index, e.target.value)}
                          className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-red-500 font-semibold"
                          placeholder="Heading text"
                        />
                      ) : (
                        <textarea
                          value={block.text}
                          onChange={(e) => updateContentBlock(index, e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-red-500"
                          placeholder="Paragraph text"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-2">{editingWriting.title}</h2>
              <p className="text-gray-400 mb-6">{editingWriting.tagline}</p>
              <div className="space-y-4">
                {editingWriting.content.map((block, index) => (
                  <div key={index}>
                    {block.type === 'heading' ? (
                      <h3 className="text-xl font-semibold text-white">{block.text}</h3>
                    ) : (
                      <p className="text-gray-300 leading-relaxed">{block.text}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Save Writing
            </button>
            <button
              onClick={() => setEditingWriting(null)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Writings List */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Published Writings ({writings.length})</h4>
        <div className="space-y-4">
          {writings.map((writing) => (
            <motion.div
              key={writing.id}
              layout
              className="bg-[#2a2a2a] border border-gray-600 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="text-white font-semibold text-lg">{writing.title}</h5>
                  <p className="text-gray-400 text-sm mt-1">{writing.tagline}</p>
                  <p className="text-gray-300 text-sm mt-2">
                    {writing.content.length} content blocks
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(writing)}
                    className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(writing.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
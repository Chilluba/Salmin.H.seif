import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, ExternalLink, Github, Linkedin, Mail } from 'lucide-react';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  isActive: boolean;
}

interface ContactInfo {
  email: string;
  location: string;
  phone?: string;
}

export const LinksAdmin: React.FC = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => {
    try {
      const stored = localStorage.getItem('admin-social-links');
      return stored ? JSON.parse(stored) : [
        { id: '1', platform: 'GitHub', url: 'https://github.com', icon: 'Github', isActive: true },
        { id: '2', platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin', isActive: true },
        { id: '3', platform: 'Email', url: 'mailto:contact@example.com', icon: 'Mail', isActive: true },
      ];
    } catch {
      return [];
    }
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => {
    try {
      const stored = localStorage.getItem('admin-contact-info');
      return stored ? JSON.parse(stored) : {
        email: 'contact@example.com',
        location: 'Your Location',
        phone: ''
      };
    } catch {
      return { email: '', location: '', phone: '' };
    }
  });

  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const saveLinks = (updatedLinks: SocialLink[]) => {
    setSocialLinks(updatedLinks);
    localStorage.setItem('admin-social-links', JSON.stringify(updatedLinks));
    
    window.dispatchEvent(new CustomEvent('social-links-updated', { detail: updatedLinks }));
  };

  const saveContactInfo = () => {
    localStorage.setItem('admin-contact-info', JSON.stringify(contactInfo));
    window.dispatchEvent(new CustomEvent('contact-info-updated', { detail: contactInfo }));
    alert('Contact information saved successfully!');
  };

  const handleAddNew = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: '',
      url: '',
      icon: 'ExternalLink',
      isActive: true
    };
    setEditingLink(newLink);
    setIsAddingNew(true);
  };

  const handleEdit = (link: SocialLink) => {
    setEditingLink({ ...link });
    setIsAddingNew(false);
  };

  const handleSave = () => {
    if (!editingLink) return;

    if (!editingLink.platform.trim() || !editingLink.url.trim()) {
      alert('Please fill in platform name and URL.');
      return;
    }

    let updatedLinks;
    if (isAddingNew) {
      updatedLinks = [...socialLinks, editingLink];
    } else {
      updatedLinks = socialLinks.map(link => link.id === editingLink.id ? editingLink : link);
    }

    saveLinks(updatedLinks);
    setEditingLink(null);
    setIsAddingNew(false);
  };

  const handleDelete = (linkId: string) => {
    if (confirm('Are you sure you want to delete this link?')) {
      const updatedLinks = socialLinks.filter(link => link.id !== linkId);
      saveLinks(updatedLinks);
    }
  };

  const toggleLinkActive = (linkId: string) => {
    const updatedLinks = socialLinks.map(link => 
      link.id === linkId ? { ...link, isActive: !link.isActive } : link
    );
    saveLinks(updatedLinks);
  };

  const iconOptions = [
    { value: 'Github', label: 'GitHub' },
    { value: 'Linkedin', label: 'LinkedIn' },
    { value: 'Mail', label: 'Email' },
    { value: 'ExternalLink', label: 'External Link' },
  ];

  return (
    <div className="space-y-8">
      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Contact Information</h3>
        
        <div className="bg-[#2a2a2a] border border-gray-600 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-red-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input
                type="text"
                value={contactInfo.location}
                onChange={(e) => setContactInfo(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-red-500"
                placeholder="Your City, Country"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone (optional)</label>
              <input
                type="tel"
                value={contactInfo.phone || ''}
                onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-red-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <button
            onClick={saveContactInfo}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            Save Contact Info
          </button>
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Social Links</h3>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <Plus size={16} />
            Add Link
          </button>
        </div>

        {/* Edit Form */}
        {editingLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2a2a2a] border border-gray-600 rounded-lg p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white">
                {isAddingNew ? 'Add New Link' : 'Edit Link'}
              </h4>
              <button onClick={() => setEditingLink(null)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Platform Name</label>
                <input
                  type="text"
                  value={editingLink.platform}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, platform: e.target.value } : null)}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-red-500"
                  placeholder="GitHub, LinkedIn, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                <select
                  value={editingLink.icon}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, icon: e.target.value } : null)}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-red-500"
                >
                  {iconOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
                <input
                  type="url"
                  value={editingLink.url}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, url: e.target.value } : null)}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-red-500"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={16} />
                Save Link
              </button>
              <button
                onClick={() => setEditingLink(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Links List */}
        <div className="space-y-3">
          {socialLinks.map((link) => (
            <motion.div
              key={link.id}
              layout
              className="bg-[#2a2a2a] border border-gray-600 rounded-lg p-4 flex items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h5 className="text-white font-semibold">{link.platform}</h5>
                  <span className={`px-2 py-1 text-xs rounded ${
                    link.isActive ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'
                  }`}>
                    {link.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm truncate">{link.url}</p>
              </div>

              <div className="flex gap-2">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                  title="Visit Link"
                >
                  <ExternalLink size={16} />
                </a>
                <button
                  onClick={() => toggleLinkActive(link.id)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    link.isActive 
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {link.isActive ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => handleEdit(link)}
                  className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
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
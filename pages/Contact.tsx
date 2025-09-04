import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const { content } = useContent();
  const contactInfo = content.contact;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      if (name && email && message) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    }, 1500);
  };

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
    >
      <h1 className="font-display text-5xl md:text-7xl text-center mb-4">Get In Touch</h1>
      <p className="text-center text-lg text-[#A1A1AA] mb-12">
        Have a project in mind or just want to say hello? I'd love to hear from you.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            <h2 className="font-accent text-3xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-4 text-[#A1A1AA]">
                <div className="flex items-center gap-4">
                    <Mail size={20} className="text-[#E50914]" />
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-white">{contactInfo.email}</a>
                </div>
                <div className="flex items-center gap-4">
                    <Phone size={20} className="text-[#E50914]" />
                    <a href={`tel:${contactInfo.phone}`} className="hover:text-white">{contactInfo.phone}</a>
                </div>
                <div className="flex items-center gap-4">
                    <MapPin size={20} className="text-[#E50914]" />
                    <span>{contactInfo.location}</span>
                </div>
            </div>
            <p className="mt-6 text-sm text-[#A1A1AA]">
                Response time is typically within 24-48 hours. I look forward to connecting!
            </p>
        </motion.div>
        
        <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#A1A1AA]">Name</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full bg-[#121317] border border-[#27272A] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#E50914] focus:border-[#E50914]" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#A1A1AA]">Email</label>
              <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full bg-[#121317] border border-[#2727A] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#E50914] focus:border-[#E50914]" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#A1A1AA]">Message</label>
              <textarea id="message" rows={5} value={message} onChange={e => setMessage(e.target.value)} required className="mt-1 block w-full bg-[#121317] border border-[#27272A] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#E50914] focus:border-[#E50914]"></textarea>
            </div>
          </div>
          <div className="mt-6">
            <button type="submit" disabled={status === 'sending'} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E50914] text-[#F5F7FA] font-bold uppercase tracking-wider rounded-md hover:bg-[#FF3B3B] transition-colors disabled:bg-gray-500">
              {status === 'sending' ? 'Sending...' : <>Send Message <Send size={18} /></>}
            </button>
          </div>
          {status === 'success' && <p className="mt-4 text-center text-green-400">Message sent successfully!</p>}
          {status === 'error' && <p className="mt-4 text-center text-red-400">Please fill out all fields.</p>}
        </motion.form>
      </div>
    </motion.div>
  );
};

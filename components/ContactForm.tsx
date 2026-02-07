import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    github: '',
    flair: 'User Flair',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [wordCount, setWordCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'message') {
      const words = value.trim().split(/\s+/).filter(Boolean);
      if (words.length > 200) return;
      setWordCount(words.length);
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        timestamp: new Date().toISOString(),
        responded: false,
        usageCount: 0,
      });

      setSubmitStatus('success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        github: '',
        flair: 'User Flair',
        message: '',
      });
      setWordCount(0);
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='py-16 bg-[#0e0e0e] flex justify-center'>
      <div className='w-full max-w-2xl px-10'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Contact Us</h2>

        <form onSubmit={handleSubmit} className='grid gap-4'>
          <input
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
            placeholder='Name'
            className='p-3 rounded-lg bg-black border border-white/30 text-sm focus:border-[#BDE038] focus:outline-none'
          />
          <input
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder='Phone'
            className='p-3 rounded-lg bg-black border border-white/30 text-sm focus:border-[#BDE038] focus:outline-none'
          />
          <input
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
            placeholder='Email'
            className='p-3 rounded-lg bg-black border border-white/30 text-sm focus:border-[#BDE038] focus:outline-none'
          />
          <input
            name='github'
            value={formData.github}
            onChange={handleChange}
            placeholder='GitHub Link (optional)'
            className='p-3 rounded-lg bg-black border border-white/30 text-sm focus:border-[#BDE038] focus:outline-none'
          />

          <select
            name='flair'
            value={formData.flair}
            onChange={handleChange}
            className='p-3 rounded-lg bg-black border border-white/30 text-sm focus:border-[#BDE038] focus:outline-none cursor-pointer'
          >
            <option>User Flair</option>
            <option>Bug Hunter</option>
            <option>Security Nerd</option>
            <option>Ship Fast</option>
            <option>Hackathon Goblin</option>
            <option>Paranoid but Right</option>
          </select>

          <textarea
            name='message'
            value={formData.message}
            onChange={handleChange}
            rows={5}
            required
            placeholder='Your message (max 200 words)'
            className='p-3 rounded-lg bg-black border border-white/30 text-sm focus:border-[#BDE038] focus:outline-none resize-none'
          />
          <div className='text-xs text-right text-gray-500'>{wordCount}/200 words</div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='mt-3 py-3 rounded-full bg-[#BDE038] text-black text-sm font-semibold hover:bg-[#a8c932] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSubmitting ? 'Submitting…' : 'Submit'}
          </button>

          {submitStatus === 'success' && (
            <div className='p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 text-sm text-center'>
              ✓ Message sent successfully!
            </div>
          )}
          {submitStatus === 'error' && (
            <div className='p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm text-center'>
              ✗ Failed to send message. Please try again.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

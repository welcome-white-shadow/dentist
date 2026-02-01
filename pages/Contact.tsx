
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from 'lucide-react';
import { db } from '../lib/db';
import { WebsiteContent } from '../types';
import LocationMap from '../components/LocationMap';

const Contact: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    const load = async () => {
      const [s, c] = await Promise.all([db.getSettings(), db.getContent()]);
      setSettings(s);
      setContent(c);
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.saveLead({
      type: 'contact',
      name: formData.name || 'Anonymous',
      phone: formData.phone || 'N/A',
      email: formData.email,
      message: formData.message || 'General Query'
    });
    alert("Message sent! We will get back to you soon.");
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  if (!settings || !content) return null;

  const inputClass = "w-full px-6 py-5 rounded-2xl bg-slate-50 border-none outline-none font-bold text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 transition-all";

  return (
    <div className="pb-20 bg-white font-inter">
      <header className="bg-slate-900 py-32 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">{content.contactPage.header}</h1>
          <p className="text-xl text-teal-400 max-w-2xl mx-auto font-medium">{content.contactPage.subhead}</p>
        </div>
      </header>

      <section className="py-20 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl flex flex-col items-center text-center space-y-4 border border-slate-100 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shadow-inner">
                <MapPin size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Our Location</h3>
              <p className="text-slate-600 leading-relaxed text-sm font-medium">{settings.location}</p>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl flex flex-col items-center text-center space-y-4 border border-slate-100 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                <Phone size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Call / WhatsApp</h3>
              <div className="flex flex-col gap-1">
                <a href={`tel:${settings.phone}`} className="text-blue-600 font-bold hover:underline">{settings.phone}</a>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl flex flex-col items-center text-center space-y-4 border border-slate-100 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner">
                <Mail size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Email Us</h3>
              <a href={`mailto:${settings.email}`} className="text-purple-600 font-bold hover:underline truncate w-full">{settings.email}</a>
            </div>
          </div>

          <div className="mt-16 max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 border border-slate-100 relative overflow-hidden">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-12 tracking-tight text-center">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={inputClass} />
                <input required type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={inputClass} />
              </div>
              <input required type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={inputClass} />
              <textarea required rows={5} placeholder="Your Message..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className={`${inputClass} resize-none`}></textarea>
              <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-2xl font-bold text-xl hover:bg-teal-600 transition-all flex items-center justify-center gap-3 shadow-2xl">
                <Send size={24} /> Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>
      <LocationMap />
    </div>
  );
};

export default Contact;

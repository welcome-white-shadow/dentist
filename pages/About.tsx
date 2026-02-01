
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, Target, Eye, CheckCircle2 } from 'lucide-react';
import { db } from '../lib/db';
import { WebsiteContent } from '../types';

const About: React.FC = () => {
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const [c, s] = await Promise.all([db.getContent(), db.getSettings()]);
      setContent(c);
      setSettings(s);
    };
    load();
  }, []);

  if (!content || !settings) return null;

  return (
    <div className="pb-24 bg-white">
      <header className="bg-slate-900 py-32 text-center text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">Clinic Legacy</h1>
          <p className="text-xl text-teal-400 max-w-2xl mx-auto font-medium">Redefining dental healthcare excellence in the heart of Jalgaon.</p>
        </div>
      </header>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-teal-600 font-bold uppercase tracking-[0.2em] text-xs">Our Heritage</h2>
                <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">{content.about.story.title}</h3>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  {content.about.story.description1}
                </p>
                <p className="text-lg text-slate-500 leading-relaxed">
                  {content.about.story.description2}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-10">
                <div className="bg-teal-50 p-10 rounded-[2.5rem] border border-teal-100 group hover:bg-teal-600 transition-all">
                  <h4 className="text-4xl font-extrabold text-teal-700 mb-2 group-hover:text-white">5,000+</h4>
                  <p className="text-slate-600 font-bold text-sm uppercase group-hover:text-teal-100">Happy Patients</p>
                </div>
                <div className="bg-blue-50 p-10 rounded-[2.5rem] border border-blue-100 group hover:bg-blue-600 transition-all">
                  <h4 className="text-4xl font-extrabold text-blue-700 mb-2 group-hover:text-white">ISO</h4>
                  <p className="text-slate-600 font-bold text-sm uppercase group-hover:text-blue-100">Quality Care</p>
                </div>
              </div>
            </div>
            <div className="relative group">
              <img src={content.about.story.image} alt="Clinic Interior" className="rounded-[3rem] shadow-2xl relative border-8 border-white" />
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2rem] shadow-2xl hidden md:flex items-center gap-6 border border-teal-50">
                <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center text-white"><Award size={36} /></div>
                <div>
                  <p className="font-extrabold text-slate-900 text-xl leading-none mb-1">A+ Excellence</p>
                  <p className="text-xs text-slate-400 font-bold uppercase">Global Standards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 space-y-6">
              <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center"><Target size={32} /></div>
              <h4 className="text-3xl font-extrabold text-slate-900 tracking-tight">Our Mission</h4>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">{content.about.mission}</p>
            </div>
            <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 space-y-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Eye size={32} /></div>
              <h4 className="text-3xl font-extrabold text-slate-900 tracking-tight">Our Vision</h4>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">{content.about.vision}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

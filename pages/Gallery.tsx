
import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { ClinicGallery, WebsiteContent } from '../types';
import { Maximize2, Filter, ImageIcon, Camera } from 'lucide-react';

const Gallery: React.FC = () => {
  const [gallery, setGallery] = useState<ClinicGallery[]>([]);
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [filter, setFilter] = useState<'all' | 'interior' | 'equipment' | 'environment'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [g, c] = await Promise.all([db.getGallery(), db.getContent()]);
        setGallery(g);
        setContent(c);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (!content || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Loading Showcase...</p>
        </div>
      </div>
    );
  }

  const filteredGallery = gallery.filter(item => filter === 'all' || item.category === filter);

  return (
    <div className="pb-24 bg-white font-inter">
      {/* HEADER SECTION */}
      <header className="bg-slate-900 py-32 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-4 animate-in fade-in slide-in-from-top duration-700">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-500/10 text-teal-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-teal-500/20">
            <Camera size={14} /> Clinical Excellence
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">{content.galleryPage.header}</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">{content.galleryPage.subhead}</p>
        </div>
      </header>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* FILTER CONTROLS */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="flex items-center gap-2 mr-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
              <Filter size={16} /> Filter by:
            </div>
            {(['all', 'interior', 'equipment', 'environment'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border ${
                  filter === cat
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xl shadow-teal-500/20'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-teal-500 hover:text-teal-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* GALLERY GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredGallery.length === 0 ? (
              <div className="col-span-full py-40 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-sm">
                  <ImageIcon size={40} />
                </div>
                <p className="text-slate-400 font-bold text-xl">No images found in this category.</p>
                <button onClick={() => setFilter('all')} className="mt-4 text-teal-600 font-bold text-sm hover:underline">Reset Filters</button>
              </div>
            ) : (
              filteredGallery.map((item, index) => (
                <div 
                  key={item.id} 
                  className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 animate-in fade-in zoom-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                       <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-1">{item.category}</span>
                       <h4 className="text-xl font-bold text-white mb-4">{item.title}</h4>
                       <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-lg hover:bg-teal-500 hover:text-white transition-all transform hover:scale-110">
                         <Maximize2 size={18} />
                       </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* QUALITY BADGE */}
          <div className="mt-32 p-12 md:p-20 rounded-[4rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl animate-in fade-in duration-1000">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
              <div className="w-24 h-24 bg-teal-600 rounded-3xl flex items-center justify-center shrink-0 shadow-2xl rotate-3">
                <Maximize2 size={48} />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight">Experience Sterility & Comfort.</h3>
                <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
                  Our clinic follows strict international sterilization protocols and utilizes state-of-the-art dental technology to ensure a safe environment for every patient.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;

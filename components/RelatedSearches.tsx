
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpRight } from 'lucide-react';
import { SEO_QUERIES } from '../constants';

const RelatedSearches: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center">
            <Search size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Explore Related Searches</h2>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {SEO_QUERIES.map((query, index) => (
            <Link
              key={index}
              to="/services"
              className="group flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-slate-200 text-sm font-medium text-slate-600 hover:border-teal-500 hover:text-teal-600 hover:shadow-lg hover:shadow-teal-500/5 transition-all"
            >
              <span>{query}</span>
              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-teal-500" />
            </Link>
          ))}
        </div>
        
        <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center md:text-left">
          Serving patients across Jalgaon, Bhusawal, and Khandesh region with premium dental care.
        </p>
      </div>
    </section>
  );
};

export default RelatedSearches;

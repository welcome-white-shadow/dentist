
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/db';
import { getIcon } from '../constants';
import { Service, WebsiteContent } from '../types';
import { Check, MessageCircle, ArrowRight } from 'lucide-react';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const [s, c, st] = await Promise.all([db.getServices(), db.getContent(), db.getSettings()]);
      setServices(s);
      setContent(c);
      setSettings(st);
    };
    load();
  }, []);

  if (!content || !settings) return null;

  return (
    <div className="pb-20">
      <header className="bg-teal-600 py-24 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">{content.servicesPage.header}</h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto font-medium">{content.servicesPage.subhead}</p>
        </div>
      </header>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 flex flex-col md:flex-row group">
                <div className="md:w-1/3 bg-teal-50 flex items-center justify-center p-12 group-hover:bg-teal-600 transition-all">
                  <div className="text-teal-600 group-hover:text-white transition-colors scale-[1.8] md:scale-[2.5]">
                    {getIcon(service.iconName, 48)}
                  </div>
                </div>
                <div className="md:w-2/3 p-10 flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">{service.title}</h3>
                    <p className="text-slate-500 mb-8 leading-relaxed font-medium">{service.longDescription}</p>
                    <div className="space-y-3 mb-10">
                      {service.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                          <Check className="text-teal-500" size={18} />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/book" className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-extrabold text-sm hover:bg-teal-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95">
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-10 tracking-tight leading-tight">{content.servicesPage.bannerTitle}</h2>
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
              {content.servicesPage.bannerText}
            </p>
            <Link to="/book" className="inline-flex items-center gap-4 px-12 py-6 bg-teal-600 text-white rounded-[2rem] font-extrabold text-2xl hover:bg-teal-700 transition-all shadow-2xl shadow-teal-500/30 active:scale-95">
              Request Full Diagnosis <ArrowRight size={28} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;

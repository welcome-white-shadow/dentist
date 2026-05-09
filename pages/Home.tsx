
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Star, CheckCircle2, MessageCircle, Award, Activity, 
  ShieldCheck, Microscope, Zap, UserCheck, GraduationCap, 
  HeartPulse, Sparkles, ChevronDown, Plus, Minus
} from 'lucide-react';
import { db } from '../lib/db';
import { Service, WebsiteContent, Testimonial, ClinicGallery } from '../types';
import { getIcon } from '../constants';
import LocationMap from '../components/LocationMap';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 py-6 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left gap-4"
      >
        <span className="text-xl font-bold text-slate-800">{question}</span>
        <div className={`shrink-0 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center transition-all ${isOpen ? 'bg-teal-600 border-teal-600 text-white rotate-180' : 'text-slate-400'}`}>
          <ChevronDown size={18} />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-slate-600 leading-relaxed font-medium">
          {answer}
        </p>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gallery, setGallery] = useState<ClinicGallery[]>([]);
  const [settings, setSettings] = useState<any>(null);
  
  useEffect(() => {
    const loadData = async () => {
      const [s, c, t, st, g] = await Promise.all([
        db.getServices(),
        db.getContent(),
        db.getTestimonials(),
        db.getSettings(),
        db.getGallery()
      ]);
      setServices(s);
      setContent(c);
      setTestimonials(t);
      setSettings(st);
      setGallery(g);
      document.title = `${st.name} | Advanced Painless Dentistry`;
    };
    loadData();
  }, []);

  if (!content || !settings) return null;

  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hello Doctor, I want to book an appointment at ${settings.name}.`)}`;

  return (
    <div className="overflow-hidden bg-white">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Static Background Image */}
        <img 
          src="https://images.weserv.nl/?url=https://lh3.googleusercontent.com/p/AF1QipN8s7UUfLza3_A46_w4uJCh8GBj5q4bs3DaWES3=s1600" 
          alt="Clips Dental Clinic" 
          className="absolute inset-0 w-full h-full object-cover z-0"
          loading="eager"
        />
        
        {/* Cinematic Overlay - Lightened */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/40 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-black/10 z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full pt-20">
          <div className="max-w-3xl">
            <div className="space-y-10 animate-in fade-in slide-in-from-left duration-1000">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-teal-500/20 backdrop-blur-md text-teal-300 rounded-full text-xs font-bold uppercase tracking-[0.2em] border border-teal-500/30">
                  <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
                  Advanced Microscopic Dentistry
                </div>
                <h1 className="text-6xl md:text-[6.5rem] font-extrabold text-white leading-[0.95] tracking-tight whitespace-pre-line">
                  {content.home.hero.headline}
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 max-w-xl leading-relaxed font-medium">
                  {content.home.hero.subheadline}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Link to="/book" className="group flex items-center justify-center gap-4 bg-teal-600 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-teal-700 transition-all shadow-2xl shadow-teal-500/40 active:scale-95">
                  Book Your Slot <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 px-12 py-6 rounded-2xl font-bold text-xl hover:bg-white/20 transition-all active:scale-95">
                  <MessageCircle size={24} /> WhatsApp
                </a>
              </div>

              <div className="flex items-center gap-8 pt-8 border-t border-white/10 w-fit">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden shadow-xl">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Patient" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-extrabold text-white text-lg">15,000+ Happy Patients</p>
                  <div className="flex text-teal-400 gap-1">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-teal-600 font-bold uppercase tracking-[0.3em] text-xs">Clinical Excellence</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Setting Benchmark Standards in Modern Dentistry</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Pain-Free Focus", desc: "Proprietary protocols ensuring 100% comfort during complex surgeries.", icon: <HeartPulse />, color: "rose" },
              { title: "Micro-Precision", desc: "Utilization of high-magnification microscopy for zero-error treatments.", icon: <Microscope />, color: "teal" },
              { title: "Gold Standard Hygiene", desc: "Rigorous 7-step sterilization following global ISO parameters.", icon: <ShieldCheck />, color: "blue" },
              { title: "Digital Workflow", desc: "Advanced intraoral scanning and digital imaging for perfect results.", icon: <Activity />, color: "indigo" }
            ].map((feature, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-teal-100 transition-all group">
                <div className={`w-14 h-14 bg-${feature.color}-50 text-${feature.color}-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-teal-600 group-hover:text-white transition-all`}>
                  {/* Fix: cast element to React.ReactElement<any> to avoid TS error on 'size' property */}
                  {React.cloneElement(feature.icon as React.ReactElement<any>, { size: 28 })}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPMENT SHOWCASE */}
      <section className="py-32 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 bg-teal-600/5 rounded-[4rem] blur-2xl"></div>
              <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white ring-1 ring-slate-200">
                <img 
                  src="https://images.weserv.nl/?url=https://lh3.googleusercontent.com/p/AF1QipNLdc12_3j07f9F5Xpb0cIfFjR-8pHWKWQxVXsR=s1600" 
                  alt="Advanced Dental Unit" 
                  className="w-full h-auto object-cover aspect-video hover:scale-105 transition-transform duration-1000"
                  loading="eager"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-600/10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-teal-600 font-bold uppercase tracking-[0.3em] text-xs">Our Equipment</h2>
                <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">Advanced High-Tech Dental Infrastructure</h3>
                <p className="text-xl text-slate-600 font-medium leading-relaxed">
                  We invest in the world's most advanced dental chairs and operatory systems to provide you with an ergonomic, safe, and ultra-comfortable treatment experience.
                </p>
              </div>
              
              <ul className="space-y-6">
                {[
                  "Computerized Patient Comfort Systems",
                  "Advanced LED Intraoral Imaging",
                  "Integrated High-Speed Handpieces",
                  "Premium Ergonomic Memory Foam Support"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-800 font-bold">
                    <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={14} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-32 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-teal-600 font-bold uppercase tracking-[0.3em] text-xs">Our Expertise</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">{content.home.intro.title}</h3>
              <p className="text-xl text-slate-500 font-medium">{content.home.intro.description}</p>
            </div>
            <Link to="/services" className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold border border-slate-200 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
              View All Specialities
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.slice(0, 6).map((service) => (
              <div key={service.id} className="bg-white rounded-[3.5rem] p-12 shadow-sm border border-slate-100 group flex flex-col h-full hover:shadow-2xl transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Service Image Header */}
                <div className="relative h-56 -mx-12 -mt-12 mb-10 overflow-hidden">
                  <img 
                    src={
                      service.id === 'general-dentistry' ? 'https://images.weserv.nl/?url=https://images.pexels.com/photos/3845806/pexels-photo-3845806.jpeg?auto=compress&cs=tinysrgb&w=800' :
                      service.id === 'root-canal' ? 'https://images.weserv.nl/?url=https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=800' :
                      service.id === 'teeth-whitening' ? 'https://images.weserv.nl/?url=https://images.pexels.com/photos/3845759/pexels-photo-3845759.jpeg?auto=compress&cs=tinysrgb&w=800' :
                      service.id === 'dental-implants' ? 'https://images.weserv.nl/?url=https://images.pexels.com/photos/3845722/pexels-photo-3845722.jpeg?auto=compress&cs=tinysrgb&w=800' :
                      service.id === 'braces-aligners' ? 'https://images.weserv.nl/?url=https://images.pexels.com/photos/4269493/pexels-photo-4269493.jpeg?auto=compress&cs=tinysrgb&w=800' :
                      service.id === 'pediatric-dentistry' ? 'https://images.weserv.nl/?url=https://images.pexels.com/photos/3845811/pexels-photo-3845811.jpeg?auto=compress&cs=tinysrgb&w=800' :
                      'https://images.weserv.nl/?url=https://images.pexels.com/photos/3845806/pexels-photo-3845806.jpeg?auto=compress&cs=tinysrgb&w=800'
                    } 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent"></div>
                  <div className="absolute bottom-4 left-12 w-12 h-12 bg-white/90 backdrop-blur shadow-xl rounded-2xl flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all">
                    {getIcon(service.iconName, 24)}
                  </div>
                </div>

                <h4 className="text-2xl font-bold text-slate-900 mb-5 tracking-tight group-hover:text-teal-600 transition-colors">{service.title}</h4>
                <p className="text-slate-500 mb-10 text-sm leading-relaxed font-medium">{service.description}</p>
                <div className="mt-auto">
                  <Link to="/services" className="inline-flex items-center gap-3 text-teal-600 font-extrabold text-xs uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
                    Explore Details <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTOR PROFILE */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-slate-900 rounded-[5rem] translate-x-8 translate-y-8 -z-10 transition-transform group-hover:translate-x-6 group-hover:translate-y-6"></div>
              <div className="relative z-10 rounded-[5rem] overflow-hidden shadow-2xl border-[12px] border-white aspect-[4/5]">
                <img 
                  src="https://images.weserv.nl/?url=https://lh3.googleusercontent.com/p/AF1QipOSCLrUeIop_Gy0x_SuZcC6imEJCBPRpOu-njBP=s1600" 
                  alt="Chief Medical Director" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </div>
              
              <div className="absolute -bottom-6 -right-4 md:-bottom-10 md:-right-10 bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-teal-50 flex items-center gap-4 md:gap-6 z-20">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-teal-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-teal-500/20">
                  <Award size={28} className="md:hidden" />
                  <Award size={36} className="hidden md:block" />
                </div>
                <div>
                  <p className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-none mb-1">{content.home.doctorProfile.yearsExperience}</p>
                  <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Years of Excellence</p>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-teal-600 font-bold uppercase tracking-[0.3em] text-xs">Chief Medical Director</h2>
                <div className="space-y-3">
                  <p className="text-2xl font-bold text-teal-600">MDS - Orthodontics & Dentofacial Orthopaedics</p>
                </div>
                
                <div className="flex items-center gap-4 p-5 bg-teal-50 rounded-2xl border border-teal-100 w-fit">
                  <GraduationCap className="text-teal-600 shrink-0" size={28} />
                  <p className="text-sm font-bold text-slate-800 leading-tight">
                    B.D.S (Muhs, Nashik), M.D.S (Orthodontics and Dentofacial Orthopaedics, Rguhs Banglore)
                  </p>
                </div>

                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  Our Chief Medical Director is a leading Orthodontist specializing in advanced braces and aligner treatments, dedicated to creating perfect smiles with precision and clinical excellence.
                </p>

                <div className="grid grid-cols-2 gap-12 pt-6 border-t border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                      <p className="text-3xl font-extrabold text-slate-900">5,000+</p>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-5">Lives Transformed</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                      <p className="text-3xl font-extrabold text-slate-900">100%</p>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-5">Clinical Excellence</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link to="/book" className="group inline-flex items-center gap-4 bg-slate-900 text-white px-12 py-6 rounded-[2rem] font-bold text-xl hover:bg-teal-600 transition-all shadow-2xl active:scale-95">
                  Request Private Consultation <UserCheck size={24} className="group-hover:scale-110 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <h2 className="text-teal-400 font-bold uppercase tracking-[0.3em] text-xs">Modern Infrastructure</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight">World-Class Facility</h3>
            </div>
            <Link to="/gallery" className="text-teal-400 font-bold flex items-center gap-2 group">
              Browse Full Gallery <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {gallery.slice(0, 3).map((item, i) => (
              <div key={item.id} className="relative aspect-video rounded-[2.5rem] overflow-hidden group shadow-2xl">
                <img src={item.url} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all p-8 flex flex-col justify-end">
                  <p className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-1">{item.category}</p>
                  <h4 className="text-lg font-bold">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-teal-600 font-bold uppercase tracking-[0.3em] text-xs mb-4">Patient Stories</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">Trusted by Thousands in Jalgaon</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(t => (
              <div key={t.id} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative hover:shadow-2xl transition-all group">
                <div className="absolute -top-6 left-12 w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Zap size={24} fill="currentColor" />
                </div>
                <div className="flex text-yellow-400 mb-8 mt-4">
                  {Array.from({length: t.rating}).map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <p className="text-slate-600 italic mb-10 text-lg leading-relaxed font-medium">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-teal-600 border border-teal-50">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-6">
              <h2 className="text-teal-600 font-bold uppercase tracking-[0.3em] text-xs">Knowledge Base</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">Patient Concerns & Queries</h3>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">
                Empowering you with the right information before your first visit. Can't find an answer? Our team is available 24/7 on WhatsApp.
              </p>
              <div className="pt-8">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-green-600 font-bold text-lg hover:underline">
                   Ask a Specific Question <MessageCircle size={24} />
                </a>
              </div>
            </div>

            <div className="bg-slate-50 rounded-[3rem] p-10 md:p-14 border border-slate-100">
               <FAQItem 
                 question="Is Root Canal treatment painful?" 
                 answer="Not at CLIPS. We use advanced rotary endodontics and computerized local anesthesia which ensures the procedure is 100% painless and significantly faster than traditional methods." 
               />
               <FAQItem 
                 question="How long do Dental Implants last?" 
                 answer="With proper care and maintenance, dental implants are designed to be a lifelong solution for missing teeth. Our implants come with a premium warranty." 
               />
               <FAQItem 
                 question="Do you accept emergency bookings?" 
                 answer="Yes, we prioritize acute dental pain and trauma. We maintain 'emergency slots' throughout the day to ensure you don't have to wait when in pain." 
               />
               <FAQItem 
                 question="Are digital X-rays safe?" 
                 answer="Absolutely. Digital X-rays reduce radiation exposure by up to 90% compared to traditional film X-rays and provide instantaneous results for diagnosis." 
               />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="py-24 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-[4.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            
            <div className="relative z-10 space-y-12 animate-in fade-in zoom-in duration-1000">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
                  Ready for Your <br /> 
                  <span className="text-teal-400">Perfect Smile Journey?</span>
                </h2>
                <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                  Join 15,000+ satisfied patients who trusted CLIPS DENTAL CLINIC for world-class, painless oral healthcare.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/book" className="w-full sm:w-auto px-16 py-7 bg-teal-600 text-white rounded-[2rem] font-extrabold text-2xl hover:bg-teal-700 transition-all shadow-2xl shadow-teal-500/30 active:scale-95">
                  Secure My Slot Now
                </Link>
                <a href={`tel:${settings.phone}`} className="w-full sm:w-auto px-12 py-7 bg-white/10 text-white border border-white/20 rounded-[2rem] font-extrabold text-xl hover:bg-white/20 transition-all backdrop-blur-sm">
                  Call: {settings.phone}
                </a>
              </div>
              
              <div className="flex items-center justify-center gap-8 pt-8">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-sm uppercase tracking-widest">
                  <CheckCircle2 size={18} /> Verified Clinical Portal
                </div>
                <div className="flex items-center gap-2 text-teal-400 font-bold text-sm uppercase tracking-widest">
                  <ShieldCheck size={18} /> Secure Health Records
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LocationMap />
    </div>
  );
};

export default Home;

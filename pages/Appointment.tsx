
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle2, MessageSquare, ArrowRight, ShieldCheck, RefreshCw, Stethoscope as StethoscopeIcon } from 'lucide-react';
import { SERVICES } from '../constants';
import { db } from '../lib/db';
import { WebsiteContent } from '../types';

const Appointment: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await db.saveLead({
        type: 'appointment',
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        message: formData.message
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert("Connectivity Error: Could not reach the clinical database. Please call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!settings || !content) return null;

  if (submitted) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6 bg-slate-50 font-inter">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-teal-100 animate-in zoom-in duration-500 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-teal-500"></div>
          <div className="w-24 h-24 bg-teal-50 rounded-[2rem] flex items-center justify-center text-teal-600 mx-auto mb-10 shadow-inner">
            <CheckCircle2 size={56} />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Request Confirmed!</h2>
          <p className="text-xl text-slate-600 mb-12 leading-relaxed font-medium">
            Dear <strong>{formData.name.split(' ')[0]}</strong>, your request has been synchronized with our clinical database.
          </p>
          <div className="space-y-5">
            <a 
              href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hello Doctor, I just requested an appointment for ${formData.service} on ${formData.date} at ${formData.time}. My Name is ${formData.name}.`)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-green-500 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 active:scale-95"
            >
              <MessageSquare size={24} />
              Confirm via WhatsApp
            </a>
            <button 
              onClick={() => setSubmitted(false)}
              className="w-full bg-slate-100 text-slate-600 py-5 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              Book Another Visit
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none font-bold text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 disabled:opacity-50 transition-all";

  return (
    <div className="pb-24 bg-slate-50 font-inter">
      <header className="bg-slate-900 py-32 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">{content.appointmentPage.header}</h1>
          <p className="text-xl text-teal-400 max-w-2xl mx-auto font-medium">{content.appointmentPage.subhead}</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
              <div className="bg-teal-600 p-8 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Calendar size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">{content.appointmentPage.portalTitle}</h2>
                    <p className="text-teal-100 text-xs font-bold uppercase tracking-widest mt-0.5">{content.appointmentPage.portalTag}</p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-10 md:p-16 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <User size={16} className="text-teal-600" /> Patient Name
                    </label>
                    <input disabled={isSubmitting} required type="text" name="name" placeholder="Enter Full Name" className={inputClass} value={formData.name} onChange={handleChange} />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <Phone size={16} className="text-teal-600" /> Phone Number
                    </label>
                    <input disabled={isSubmitting} required type="tel" name="phone" placeholder="+91 00000 00000" className={inputClass} value={formData.phone} onChange={handleChange} />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <Mail size={16} className="text-teal-600" /> Email (Optional)
                    </label>
                    <input disabled={isSubmitting} type="email" name="email" placeholder="email@example.com" className={inputClass} value={formData.email} onChange={handleChange} />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <StethoscopeIcon size={16} className="text-teal-600" /> Required Treatment
                    </label>
                    <select disabled={isSubmitting} required name="service" className={inputClass} value={formData.service} onChange={handleChange}>
                      <option value="">Select Service</option>
                      {SERVICES.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={16} className="text-teal-600" /> Preferred Date
                    </label>
                    <input disabled={isSubmitting} required type="date" name="date" className={inputClass} value={formData.date} onChange={handleChange} />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={16} className="text-teal-600" /> Preferred Time
                    </label>
                    <input disabled={isSubmitting} required type="time" name="time" className={inputClass} value={formData.time} onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare size={16} className="text-teal-600" /> Message / Symptoms (Optional)
                  </label>
                  <textarea disabled={isSubmitting} name="message" rows={4} placeholder="Describe your concern here..." className={`${inputClass} resize-none`} value={formData.message} onChange={handleChange}></textarea>
                </div>
                
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-slate-900 text-white py-6 rounded-[1.5rem] font-extrabold text-xl hover:bg-teal-600 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 disabled:bg-slate-300"
                >
                  {isSubmitting ? <><RefreshCw className="animate-spin" /> Synchronizing...</> : <>Confirm Appointment Request <ArrowRight /></>}
                </button>
              </form>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3 space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl space-y-8">
               <h3 className="text-2xl font-bold tracking-tight">Booking Information</h3>
               <div className="space-y-6">
                 <div className="flex gap-4">
                   <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-teal-400 shrink-0">
                     <Clock size={20} />
                   </div>
                   <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confirmation</p>
                     <p className="text-sm font-medium text-slate-100">Our front desk will call you within 2 hours to finalize the slot.</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-teal-400 shrink-0">
                     <ShieldCheck size={20} />
                   </div>
                   <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Secure Records</p>
                     <p className="text-sm font-medium text-slate-100">All medical data is encrypted and ISO 27001 compliant.</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;

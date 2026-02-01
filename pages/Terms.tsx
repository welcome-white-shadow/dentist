
import React, { useEffect } from 'react';
import { Scale, Clock, AlertCircle, Calendar, ShieldCheck, HelpCircle } from 'lucide-react';
import { getClinicSettings } from '../lib/storage';

const Terms: React.FC = () => {
  const settings = getClinicSettings();

  useEffect(() => {
    document.title = `Terms of Service | ${settings.name}`;
  }, [settings.name]);

  const policies = [
    {
      icon: <Calendar className="text-blue-600" />,
      title: "Appointment Booking",
      content: "All appointments booked via the website are 'requests'. Our front desk will confirm the final slot via call or WhatsApp based on doctor availability."
    },
    {
      icon: <Clock className="text-blue-600" />,
      title: "Cancellation Policy",
      content: "We request a minimum of 24 hours notice for cancellations. Repeated no-shows may result in a requirement for advance consultation fees for future bookings."
    },
    {
      icon: <AlertCircle className="text-blue-600" />,
      title: "Medical Disclaimer",
      content: "The content on this website is for informational purposes only and does not constitute medical advice. A physical clinical examination is required for any diagnosis or treatment plan."
    },
    {
      icon: <Scale className="text-blue-600" />,
      title: "Clinical Procedures",
      content: "Clinical treatment outcomes can vary by individual. Detailed informed consent will be obtained physically at the clinic before any major procedure (Implants, Surgery, RCT)."
    }
  ];

  return (
    <div className="bg-white min-h-screen font-inter">
      <header className="bg-slate-900 py-24 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-blue-400 font-medium text-lg">Policies and guidelines for our clinical operations.</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="prose prose-lg text-slate-600 max-w-none mb-16">
          <p className="font-medium text-xl leading-relaxed text-slate-800">
            By accessing this website and booking an appointment with {settings.name}, you agree to abide by the following clinical and operational policies.
          </p>
        </div>

        <div className="space-y-8">
          {policies.map((policy, idx) => (
            <div key={idx} className="flex gap-8 items-start p-10 rounded-[3rem] bg-blue-50/30 border border-blue-100 hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                {policy.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{policy.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{policy.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 rounded-[4rem] bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <HelpCircle className="text-blue-400" /> Need Clarification?
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">
              If you have any questions regarding our terms or specific clinical policies, our front desk is available to assist you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={`tel:${settings.phone}`} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-center hover:bg-blue-700 transition-all">
                Call: {settings.phone}
              </a>
              <a href={`mailto:${settings.email}`} className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold text-center hover:bg-white/20 transition-all">
                Email Support
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
          Version: 2.1 • Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>
    </div>
  );
};

export default Terms;

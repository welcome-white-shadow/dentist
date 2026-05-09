
import React, { useEffect } from 'react';
import { ShieldCheck, Lock, Eye, Database, FileText, Bell } from 'lucide-react';
import { getClinicSettings } from '../lib/storage';

const Privacy: React.FC = () => {
  const settings = getClinicSettings();

  useEffect(() => {
    document.title = `Privacy Policy | ${settings.name}`;
  }, [settings.name]);

  const sections = [
    {
      icon: <Eye className="text-teal-600" />,
      title: "Data Collection",
      content: "We collect personal information such as name, phone number, and email address specifically for appointment scheduling and clinical communication. Medical history provided is treated as highly sensitive data."
    },
    {
      icon: <Lock className="text-teal-600" />,
      title: "Information Security",
      content: "All patient data is stored using industry-standard encryption protocols. We implement strict access controls ensuring that only authorized clinical staff can view your medical records."
    },
    {
      icon: <Database className="text-teal-600" />,
      title: "Data Usage",
      content: "Your information is used solely for providing dental care services, managing your appointments, and internal clinical audits. We never sell or share your data with third-party marketing agencies."
    },
    {
      icon: <Bell className="text-teal-600" />,
      title: "Communication Policy",
      content: "By providing your contact details, you agree to receive appointment reminders and clinical follow-ups via SMS, WhatsApp, or Email. You can opt-out of non-essential communications at any time."
    }
  ];

  return (
    <div className="bg-white min-h-screen font-inter">
      <header className="bg-slate-900 py-24 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-teal-400 font-medium text-lg">How we protect your clinical and personal data.</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="prose prose-lg text-slate-600 max-w-none mb-16">
          <p className="font-medium text-xl leading-relaxed text-slate-800">
            At {settings.name}, your privacy is paramount. This policy outlines our commitment to protecting the clinical and personal information you entrust to us.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {sections.map((section, idx) => (
            <div key={idx} className="flex gap-8 items-start p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                {section.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{section.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{section.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-10 rounded-[3rem] bg-teal-600 text-white space-y-6 text-center shadow-2xl shadow-teal-500/20">
          <ShieldCheck size={48} className="mx-auto" />
          <h2 className="text-3xl font-bold tracking-tight">Patient Confidentiality</h2>
          <p className="text-teal-100 text-lg font-medium leading-relaxed">
            We adhere to global standards for healthcare data privacy. If you have any concerns regarding your data, please contact our administrator directly at <span className="font-bold border-b border-teal-400">{settings.email}</span>.
          </p>
        </div>

        <div className="mt-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>
    </div>
  );
};

export default Privacy;

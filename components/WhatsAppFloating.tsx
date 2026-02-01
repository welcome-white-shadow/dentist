
import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { getClinicSettings } from '../lib/storage';

const WhatsAppFloating: React.FC = () => {
  const [settings, setSettings] = useState(getClinicSettings());
  
  useEffect(() => {
    // Check for updates periodically or on mount
    setSettings(getClinicSettings());
  }, []);

  const message = encodeURIComponent(`Hello Doctor, I want to book an appointment at ${settings.name}, Jalgaon.`);
  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-[1.5rem] shadow-[0_20px_50px_-10px_rgba(34,197,94,0.5)] hover:bg-green-600 transition-all transform hover:scale-110 group active:scale-90"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={36} />
      <span className="absolute right-20 bg-white text-green-600 px-5 py-2 rounded-2xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl whitespace-nowrap pointer-events-none border border-green-100">
        Chat with Dr. Patil
      </span>
    </a>
  );
};

export default WhatsAppFloating;


import React from 'react';
import { MapPin, Clock, Navigation, ExternalLink } from 'lucide-react';
import { getClinicSettings } from '../lib/storage';

const LocationMap: React.FC = () => {
  const settings = getClinicSettings();
  
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.location)}`;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
          {/* Map Info Card */}
          <div className="lg:w-1/3 space-y-8 flex flex-col justify-center">
            <div className="space-y-4">
              <h2 className="text-teal-600 font-bold uppercase tracking-[0.3em] text-xs">Visit Our Clinic</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Find Us in the <span className="text-teal-600">Heart of Jalgaon.</span>
              </h3>
              <p className="text-lg text-slate-600 font-medium">
                Conveniently located with ample parking, our facility is designed for easy access and a stress-free experience.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-teal-200 transition-colors">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Clinical Address</p>
                  <p className="text-sm font-bold text-slate-800 leading-relaxed">{settings.location}</p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-teal-200 transition-colors">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Consultation Hours</p>
                  <p className="text-sm font-bold text-slate-800">Mon - Sat: 10:00 AM - 08:00 PM</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Sunday: Emergency Appointments Only</p>
                </div>
              </div>
            </div>

            <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl active:scale-95 group"
            >
              <Navigation size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Get Directions on Maps
            </a>
          </div>

          {/* Map Embed Container */}
          <div className="lg:w-2/3 relative h-[500px] lg:h-auto min-h-[450px]">
            <div className="absolute inset-0 rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119176.43842107125!2d75.50337894229986!3d20.99201083979857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd90f945037d2f9%3A0xc61008d5917452d2!2sJalgaon%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1714574921943!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
            
            {/* Floating Hint */}
            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50 hidden md:flex items-center gap-2 pointer-events-none">
              <ExternalLink size={14} className="text-teal-600" />
              <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Interactive Map</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;

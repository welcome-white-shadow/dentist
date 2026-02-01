
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, MessageCircle, ArrowRight } from 'lucide-react';
import { getClinicSettings, getServices } from '../lib/storage';
import { Service } from '../types';

const Footer: React.FC = () => {
  const [settings, setSettings] = useState(getClinicSettings());
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    setSettings(getClinicSettings());
    setServices(getServices());
  }, []);

  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hello! I have a dental query.")}`;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-24 pb-12 font-inter border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Clinic Bio */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
                {settings.name.charAt(0)}
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">{settings.name}</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              Transforming dental care in Jalgaon with microscopic precision, ethical practices, and a 100% painless treatment focus.
            </p>
            <div className="flex space-x-5">
              {[
                { icon: Instagram, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: MessageCircle, href: whatsappUrl }
              ].map((social, i) => (
                <a key={i} href={social.href} className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center hover:bg-teal-500 hover:text-white transition-all transform hover:-translate-y-1">
                  <social.icon size={22} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xl mb-8 uppercase tracking-widest text-xs">Navigation</h4>
            <ul className="space-y-5 font-medium text-sm">
              <li><Link to="/" className="hover:text-teal-400 transition-colors flex items-center gap-3"><ArrowRight size={14} /> Home</Link></li>
              <li><Link to="/about" className="hover:text-teal-400 transition-colors flex items-center gap-3"><ArrowRight size={14} /> About Clinic</Link></li>
              <li><Link to="/services" className="hover:text-teal-400 transition-colors flex items-center gap-3"><ArrowRight size={14} /> Services</Link></li>
              <li><Link to="/gallery" className="hover:text-teal-400 transition-colors flex items-center gap-3"><ArrowRight size={14} /> Gallery</Link></li>
              <li><Link to="/book" className="hover:text-teal-400 transition-colors flex items-center gap-3 font-bold text-teal-500"><ArrowRight size={14} /> Book Appointment</Link></li>
            </ul>
          </div>

          {/* Top Services */}
          <div>
            <h4 className="text-white font-bold text-xl mb-8 uppercase tracking-widest text-xs">Treatments</h4>
            <ul className="space-y-5 font-medium text-sm">
              {services.slice(0, 5).map(service => (
                <li key={service.id}>
                  <Link to="/services" className="hover:text-teal-400 transition-colors flex items-center gap-3">
                    <ArrowRight size={14} className="opacity-30" /> {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-xl mb-8 uppercase tracking-widest text-xs">Get In Touch</h4>
            <ul className="space-y-6 font-medium text-sm">
              <li className="flex gap-4">
                <MapPin className="text-teal-500 shrink-0 mt-1" size={20} />
                <span className="text-slate-400 leading-relaxed">{settings.location}</span>
              </li>
              <li className="flex flex-col gap-3">
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 bg-teal-500/10 rounded-lg flex items-center justify-center text-teal-500">
                    <Phone size={16} />
                  </div>
                  <a href={`tel:${settings.phone}`} className="hover:text-teal-400 font-bold">{settings.phone}</a>
                </div>
                {settings.phone2 && (
                  <div className="flex gap-4 items-center">
                    <div className="w-8 h-8 bg-teal-500/10 rounded-lg flex items-center justify-center text-teal-500">
                      <Phone size={16} />
                    </div>
                    <a href={`tel:${settings.phone2}`} className="hover:text-teal-400 font-bold">{settings.phone2}</a>
                  </div>
                )}
              </li>
              <li className="flex gap-4 items-center">
                <div className="w-8 h-8 bg-teal-500/10 rounded-lg flex items-center justify-center text-teal-500">
                  <Mail size={16} />
                </div>
                <a href={`mailto:${settings.email}`} className="hover:text-teal-400 font-bold truncate">{settings.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} {settings.name}. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</Link>
            <Link to="/login" className="text-slate-700 hover:text-white transition-colors">Admin Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

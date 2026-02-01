
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { getClinicSettings } from '../lib/storage';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(getClinicSettings());
  const location = useLocation();

  useEffect(() => {
    // Refresh settings whenever the user navigates, in case admin changed it
    setSettings(getClinicSettings());
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">{settings.name.charAt(0)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-teal-900 leading-none">{settings.name}</span>
                <span className="text-[10px] text-teal-600 font-medium tracking-widest uppercase">Dental Excellence</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${
                  isActive(link.path)
                    ? 'text-teal-600 font-semibold underline decoration-2 underline-offset-8'
                    : 'text-gray-600 hover:text-teal-600'
                } transition-all px-1 py-2 text-sm font-bold tracking-tight uppercase tracking-widest`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/book"
              className="bg-teal-600 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-teal-700 transition-all flex items-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95"
            >
              <Calendar size={18} />
              Appointment
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-teal-600 p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-8 space-y-4 shadow-2xl animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-6 py-4 rounded-2xl text-lg font-bold ${
                isActive(link.path)
                  ? 'bg-teal-50 text-teal-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-teal-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-6 flex flex-col gap-4">
            <a
              href={`tel:${settings.phone.replace(/\s/g, '')}`}
              className="flex items-center justify-center gap-3 w-full py-5 border-2 border-teal-600 text-teal-600 rounded-2xl font-bold"
            >
              <Phone size={22} />
              Call Doctor
            </a>
            <Link
              to="/book"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-3 w-full py-5 bg-teal-600 text-white rounded-2xl font-bold shadow-xl shadow-teal-500/20"
            >
              <Calendar size={22} />
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

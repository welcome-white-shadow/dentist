
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { CLINIC_NAME } from '../constants';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (localStorage.getItem('clips_admin_auth') === 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Conceptual login for production simulation
    setTimeout(() => {
      if (username === 'admin' && password === 'clips123') {
        localStorage.setItem('clips_admin_auth', 'true');
        navigate('/admin');
      } else {
        setError('Authorization failed. Access denied.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-inter">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <div className="w-20 h-20 bg-teal-600 rounded-[2rem] flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-2xl shadow-teal-500/20 rotate-3 hover:rotate-0 transition-transform">
            C
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2 uppercase">{CLINIC_NAME}</h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200">
            <ShieldCheck size={12} className="text-teal-600" /> Administrative Gateway
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl p-10 md:p-12 border border-slate-100 animate-in fade-in zoom-in duration-500">
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Account Identity</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  required
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all outline-none font-medium text-slate-800"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Access Token</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-14 pr-14 py-5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all outline-none font-medium text-slate-800"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-teal-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-left duration-300">
                <AlertCircle size={20} />
                <p className="text-xs font-bold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl active:scale-[0.98] ${
                loading 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-500/20'
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
              ) : (
                <>
                  Establish Connection
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 flex items-center justify-center gap-4 border-t border-slate-50 pt-8">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400">MD</div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-teal-100 flex items-center justify-center text-[8px] font-bold text-teal-600">ID</div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Authorized access for Dr. Patil & Medical Staff only</p>
          </div>
        </div>
        
        <div className="mt-8 text-center space-y-2">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Help Desk: +91 77748 46801</p>
          <p className="text-slate-300 text-[9px] uppercase tracking-tighter">© {new Date().getFullYear()} CLIPS Medical Systems • Secure V2.4</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

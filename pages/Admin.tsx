
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Settings, LogOut, Trash2, Clock, Phone, Mail, MessageSquare, 
  BarChart3, Stethoscope, ClipboardList, Search, Bell, User, ArrowRight,
  Plus, Save, X, Edit2, History, UserPlus, RefreshCw, Activity, 
  ToggleLeft, ToggleRight, ShieldCheck, Stethoscope as StethoscopeIcon,
  Layout, Image as ImageIcon, Star, Quote, ChevronDown, Calendar, Camera,
  CheckCircle2, Filter, UserCheck, ExternalLink, Hash, FileText, ChevronRight,
  AlertCircle, QrCode, Printer, Download, Share2
} from 'lucide-react';
import { Lead, Patient, PatientHistoryItem, Doctor, Notification, WebsiteContent, Testimonial, ClinicGallery } from '../types';
import { db } from '../lib/db';

const Admin: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gallery, setGallery] = useState<ClinicGallery[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'patients' | 'doctors' | 'content' | 'settings'>('dashboard');
  
  // Lead Filters
  const [leadSearchQuery, setLeadSearchQuery] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'all' | Lead['status']>('all');
  
  // Patient Filters
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [patientMinVisits, setPatientMinVisits] = useState<number | ''>('');
  const [patientLastVisitFilter, setPatientLastVisitFilter] = useState<'all' | '7days' | '30days' | '90days'>('all');
  const [patientNoteKeyword, setPatientNoteKeyword] = useState('');
  
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [contentTab, setContentTab] = useState<'home' | 'about' | 'gallery' | 'others'>('home');
  
  const [editingGalleryItem, setEditingGalleryItem] = useState<ClinicGallery | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    initialLoad();
    const interval = setInterval(syncData, 15000); 
    return () => clearInterval(interval);
  }, []);

  const initialLoad = async () => {
    setIsLoading(true);
    try {
      const [l, p, d, n, s, c, t, g] = await Promise.all([
        db.getLeads(),
        db.getPatients(),
        db.getDoctors(),
        db.getNotifications(),
        db.getSettings(),
        db.getContent(),
        db.getTestimonials(),
        db.getGallery()
      ]);
      setLeads(l);
      setPatients(p);
      setDoctors(d);
      setNotifications(n);
      setSettings(s);
      setContent(c);
      setTestimonials(t);
      setGallery(g);
    } finally {
      setIsLoading(false);
    }
  };

  const syncData = async () => {
    try {
      const [l, n] = await Promise.all([db.getLeads(), db.getNotifications()]);
      setLeads(l);
      setNotifications(n);
    } catch (err) {}
  };

  const handleLogout = () => {
    localStorage.removeItem('clips_admin_auth');
    navigate('/login');
  };

  const handleSave = async (operation: () => Promise<any>) => {
    setIsSyncing(true);
    try {
      await operation();
      await initialLoad();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateLeadStatus = async (lead: Lead, status: Lead['status']) => {
    await handleSave(() => db.updateLead({ ...lead, status }));
  };

  const handleConvertToPatient = async (lead: Lead) => {
    if (!window.confirm(`Are you sure you want to convert ${lead.name} to a permanent patient record?`)) return;

    await handleSave(async () => {
      const newPatient: Patient = {
        id: Math.random().toString(36).substr(2, 9),
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        notes: lead.message,
        history: lead.service ? [{
          id: Math.random().toString(36).substr(2, 9),
          date: lead.date || new Date().toISOString().split('T')[0],
          service: lead.service,
          notes: 'Converted from lead request.'
        }] : [],
        createdAt: new Date().toISOString()
      };

      await db.savePatient(newPatient);
      await db.updateLead({ ...lead, status: 'completed' });
    });

    alert(`${lead.name} has been successfully registered as a patient.`);
  };

  const handleDeletePatient = async (id: string) => {
    if (!window.confirm("Delete this patient record? This action is permanent.")) return;
    await handleSave(() => db.deletePatient(id));
  };

  // --- FILTERING & SORTING LOGIC ---

  const filteredLeads = leads
    .filter(l => leadStatusFilter === 'all' || l.status === leadStatusFilter)
    .filter(l => 
      l.name.toLowerCase().includes(leadSearchQuery.toLowerCase()) || 
      l.phone.includes(leadSearchQuery)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(patientSearchQuery.toLowerCase()) || p.phone.includes(patientSearchQuery);
    if (!matchesSearch) return false;
    if (patientMinVisits !== '' && p.history.length < patientMinVisits) return false;
    if (patientNoteKeyword) {
      const keywordLower = patientNoteKeyword.toLowerCase();
      const hasNote = p.history.some(h => h.notes.toLowerCase().includes(keywordLower)) || p.notes.toLowerCase().includes(keywordLower);
      if (!hasNote) return false;
    }
    if (patientLastVisitFilter !== 'all') {
      if (p.history.length === 0) return false;
      const lastVisitDate = new Date(p.history[p.history.length - 1].date);
      const now = new Date();
      const diffDays = Math.ceil((now.getTime() - lastVisitDate.getTime()) / (1000 * 3600 * 24));
      if (patientLastVisitFilter === '7days' && diffDays > 7) return false;
      if (patientLastVisitFilter === '30days' && diffDays > 30) return false;
      if (patientLastVisitFilter === '90days' && diffDays > 90) return false;
    }
    return true;
  });

  const stats = {
    totalLeads: leads.length,
    newLeads: leads.filter(l => l.status === 'new').length,
    totalPatients: patients.length,
    unreadNotifs: notifications.filter(n => !n.isRead).length
  };

  const getStatusColor = (status: Lead['status']) => {
    switch(status) {
      case 'new': return 'bg-red-50 text-red-600 border-red-100';
      case 'contacted': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'completed': return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'cancelled': return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  // --- QR CODE GENERATION ---
  const bookingUrl = `${window.location.origin}${window.location.pathname}#/book`;
  const qrCodeUrl = `https://chart.googleapis.com/chart?chs=400x400&cht=qr&chl=${encodeURIComponent(bookingUrl)}&choe=UTF-8`;

  if (isLoading || !settings || !content) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="w-12 h-12 text-teal-600 animate-spin mx-auto" />
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Loading Management Suite...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter text-slate-900">
      {/* SIDEBAR */}
      <div className="w-72 bg-slate-900 text-white flex flex-col h-screen sticky top-0 border-r border-slate-800 shrink-0">
        <div className="p-8 border-b border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center font-bold text-xl">C</div>
          <div>
            <span className="font-bold text-lg block leading-none">CLIPS Admin</span>
            <span className="text-[10px] text-teal-500 font-bold uppercase tracking-widest mt-1 inline-block">Management Suite</span>
          </div>
        </div>
        
        <nav className="flex-grow p-6 space-y-2">
          {[
            { id: 'dashboard', label: 'Overview', icon: BarChart3 },
            { id: 'leads', label: 'Leads', icon: ClipboardList, badge: stats.newLeads },
            { id: 'patients', label: 'Patients', icon: Users },
            { id: 'doctors', label: 'Medical Staff', icon: StethoscopeIcon },
            { id: 'content', label: 'Website Content', icon: Layout },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold text-sm ${activeTab === tab.id ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <tab.icon size={18} /> {tab.label}
              {tab.badge ? <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{tab.badge}</span> : null}
            </button>
          ))}
        </nav>

        <div className="p-6">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-red-500/10 text-red-400 font-bold text-xs hover:bg-red-500/20 border border-red-500/20 transition-all">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-10 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab}</h2>
            {isSyncing && (
              <div className="flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-[10px] font-bold uppercase animate-pulse">
                <RefreshCw size={10} className="animate-spin" /> Syncing...
              </div>
            )}
          </div>
          <div className="flex items-center gap-6">
             <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200">
               <User size={20} />
             </div>
          </div>
        </header>

        <main className="p-10 max-w-[1600px] mx-auto w-full">
          {activeTab === 'dashboard' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { label: 'New Inquiries', value: stats.newLeads, icon: ClipboardList, color: 'teal' },
                  { label: 'Total Leads', value: stats.totalLeads, icon: Activity, color: 'blue' },
                  { label: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'indigo' },
                  { label: 'Staff On Duty', value: doctors.filter(d => d.onDuty).length, icon: StethoscopeIcon, color: 'purple' }
                ].map((s, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className={`w-12 h-12 bg-${s.color}-50 text-${s.color}-600 rounded-xl flex items-center justify-center mb-6`}>
                      <s.icon size={24} />
                    </div>
                    <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{s.label}</h4>
                    <p className="text-4xl font-extrabold text-slate-900 mt-1">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* QR Booking Portal Card */}
                <div className="lg:col-span-1 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-6 group hover:shadow-xl transition-all cursor-pointer" onClick={() => setShowQRModal(true)}>
                  <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all shadow-inner">
                    <QrCode size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900">QR Booking Portal</h3>
                    <p className="text-sm text-slate-500 font-medium mt-2">Generate a scan-to-book QR code for walk-in patients or print materials.</p>
                  </div>
                  <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-teal-600 transition-all">
                    Generate Portal Code <ArrowRight size={16} />
                  </button>
                </div>

                <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 text-white flex items-center justify-between relative overflow-hidden shadow-2xl">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                   <div className="relative z-10 space-y-6">
                      <h3 className="text-3xl font-extrabold tracking-tight">Clinical Efficiency</h3>
                      <p className="text-slate-400 font-medium max-w-md leading-relaxed">You have <span className="text-teal-400 font-extrabold">{stats.newLeads} pending inquiries</span>. Early responses lead to 40% higher conversion rates in dental practice.</p>
                      <button onClick={() => setActiveTab('leads')} className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-teal-500/20 active:scale-95 transition-all">
                        Review Leads Now
                      </button>
                   </div>
                   <div className="hidden md:block">
                     <Activity size={120} className="text-teal-500/20" />
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  {(['all', 'new', 'contacted', 'completed', 'cancelled'] as const).map(status => (
                    <button 
                      key={status} 
                      onClick={() => setLeadStatusFilter(status)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all capitalize flex items-center gap-2 ${
                        leadStatusFilter === status 
                        ? 'bg-slate-900 text-white shadow-lg' 
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-slate-200/50'
                      }`}
                    >
                      {status === 'all' && <ClipboardList size={14} />}
                      {status === 'new' && <AlertCircle size={14} className={leadStatusFilter !== 'new' ? 'text-red-500' : ''} />}
                      {status === 'all' ? 'All Inquiries' : status}
                      {status === 'new' && stats.newLeads > 0 && (
                        <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${leadStatusFilter === 'new' ? 'bg-white text-slate-900' : 'bg-red-500 text-white'}`}>
                          {stats.newLeads}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Quick Search Name/Phone..." 
                    className="pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold w-full md:w-80 outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    value={leadSearchQuery}
                    onChange={(e) => setLeadSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredLeads.length === 0 ? (
                  <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold">No leads found matching your selection.</p>
                  </div>
                ) : (
                  filteredLeads.map(lead => (
                    <div 
                      key={lead.id} 
                      className={`bg-white rounded-[2.5rem] p-8 border transition-all flex flex-col group relative overflow-hidden ${
                        lead.status === 'new' 
                        ? 'border-red-100 shadow-[0_20px_50px_-20px_rgba(239,68,68,0.15)] ring-1 ring-red-500/20' 
                        : 'border-slate-100 shadow-sm hover:shadow-xl'
                      }`}
                    >
                      {lead.status === 'new' && (
                        <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 bg-red-500/5 rounded-full blur-2xl"></div>
                      )}
                      
                      <div className="flex justify-between items-start mb-6">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-2 ${getStatusColor(lead.status)}`}>
                          {lead.status === 'new' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
                          {lead.status}
                        </div>
                        <button onClick={() => handleDeletePatient(lead.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div>
                          <h4 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                            {lead.name}
                            {lead.status === 'new' && <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter bg-red-50 px-2 py-0.5 rounded-md border border-red-100">Unread</span>}
                          </h4>
                          <p className="text-sm font-bold text-teal-600 flex items-center gap-2 mt-1">
                            <Phone size={14} /> {lead.phone}
                          </p>
                        </div>
                        <div className={`p-4 rounded-2xl text-xs font-medium leading-relaxed italic ${lead.status === 'new' ? 'bg-red-50/50 text-slate-700' : 'bg-slate-50 text-slate-600'}`}>
                          "{lead.message || 'General inquiry from website.'}"
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           <span className="flex items-center gap-1"><Clock size={12} /> {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                           <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(lead.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="mt-auto flex flex-wrap gap-2">
                         {lead.status === 'new' && (
                           <button onClick={() => handleUpdateLeadStatus(lead, 'contacted')} className="flex-grow px-4 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Mark Contacted</button>
                         )}
                         {lead.status !== 'completed' && (
                           <button onClick={() => handleConvertToPatient(lead)} className="flex-grow px-4 py-3 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"><UserPlus size={14} /> Register Patient</button>
                         )}
                         {lead.status !== 'cancelled' && lead.status !== 'completed' && (
                           <button onClick={() => handleUpdateLeadStatus(lead, 'cancelled')} className="px-4 py-3 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-500 transition-all">Reject</button>
                         )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* ADVANCED FILTERING PANEL */}
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <Filter size={20} className="text-teal-600" />
                  <h3 className="text-xl font-extrabold text-slate-800">Advanced Patient Discovery</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Basic Search */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identity Search</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        type="text" 
                        placeholder="Name or phone..." 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/50 transition-all border-none"
                        value={patientSearchQuery}
                        onChange={(e) => setPatientSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Visit Frequency */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Minimum Appointments</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        type="number" 
                        placeholder="Min visits e.g. 5" 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/50 transition-all border-none"
                        value={patientMinVisits}
                        onChange={(e) => setPatientMinVisits(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </div>
                  </div>

                  {/* Last Visit Date */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Last Visit Recency</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <select 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/50 transition-all border-none appearance-none"
                        value={patientLastVisitFilter}
                        onChange={(e) => setPatientLastVisitFilter(e.target.value as any)}
                      >
                        <option value="all">Any time</option>
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="90days">Last 90 Days</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                    </div>
                  </div>

                  {/* Note Keyword Search */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Treatment Notes Search</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        type="text" 
                        placeholder="Keyword e.g. 'RCT'..." 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/50 transition-all border-none"
                        value={patientNoteKeyword}
                        onChange={(e) => setPatientNoteKeyword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                  <p className="text-xs text-slate-400 font-bold">Showing {filteredPatients.length} of {patients.length} patients</p>
                  <button 
                    onClick={() => {
                      setPatientSearchQuery('');
                      setPatientMinVisits('');
                      setPatientLastVisitFilter('all');
                      setPatientNoteKeyword('');
                    }}
                    className="text-teal-600 font-bold text-xs hover:underline uppercase tracking-widest"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>

              {/* PATIENT TABLE */}
              <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        <th className="px-8 py-5">Patient Name</th>
                        <th className="px-8 py-5">Contact Details</th>
                        <th className="px-8 py-5">History Snapshot</th>
                        <th className="px-8 py-5">Total Visits</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredPatients.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-8 py-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                              <Users size={32} />
                            </div>
                            <p className="text-slate-400 font-bold">No clinical records found for these parameters.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredPatients.map(patient => {
                          const lastEntry = patient.history.length > 0 ? patient.history[patient.history.length - 1] : null;
                          return (
                            <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm shrink-0">
                                    {patient.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-extrabold text-slate-900 leading-none mb-1">{patient.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Joined: {new Date(patient.createdAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <p className="text-sm font-bold text-slate-700">{patient.phone}</p>
                                <p className="text-xs text-slate-400 truncate max-w-[150px]">{patient.email || 'No email'}</p>
                              </td>
                              <td className="px-8 py-6">
                                {lastEntry ? (
                                  <div>
                                    <p className="text-xs font-bold text-teal-600">{lastEntry.service}</p>
                                    <p className="text-[10px] text-slate-400 font-medium line-clamp-1 italic">"{lastEntry.notes}"</p>
                                    <p className="text-[9px] font-bold text-slate-300 mt-1 uppercase">Last: {lastEntry.date}</p>
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-300 italic">No treatment history yet</span>
                                )}
                              </td>
                              <td className="px-8 py-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                                  {patient.history.length} <History size={12} className="opacity-40" />
                                </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => setSelectedPatient(patient)} className="w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-teal-600 hover:border-teal-200 transition-all">
                                    <ExternalLink size={16} />
                                  </button>
                                  <button onClick={() => handleDeletePatient(patient.id)} className="w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition-all">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-8">
              <div className="flex gap-4 p-2 bg-white rounded-2xl border border-slate-100 shadow-sm w-fit overflow-x-auto">
                {(['home', 'about', 'gallery', 'others'] as const).map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setContentTab(tab)}
                    className={`px-8 py-3 rounded-xl font-bold text-sm transition-all capitalize whitespace-nowrap ${contentTab === tab ? 'bg-teal-600 text-white shadow-lg' : 'bg-transparent text-slate-400 hover:text-slate-600'}`}
                  >
                    {tab} Pages
                  </button>
                ))}
              </div>

              <div className="space-y-10">
                {contentTab === 'home' && (
                  <div className="space-y-10 animate-in fade-in duration-500">
                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-10">
                      <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-800"><Layout className="text-teal-600" /> Hero & Intro</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Main Headline</label>
                          <input type="text" value={content.home.hero.headline} onChange={e => setContent({...content, home: {...content.home, hero: {...content.home.hero, headline: e.target.value}}})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Subheadline</label>
                          <textarea rows={2} value={content.home.hero.subheadline} onChange={e => setContent({...content, home: {...content.home, hero: {...content.home.hero, subheadline: e.target.value}}})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-medium outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-10">
                      <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-800"><StethoscopeIcon className="text-teal-600" /> Doctor Profile Showcase</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Doctor Name</label>
                          <input type="text" value={content.home.doctorProfile.name} onChange={e => setContent({...content, home: {...content.home, doctorProfile: {...content.home.doctorProfile, name: e.target.value}}})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Speciality</label>
                          <input type="text" value={content.home.doctorProfile.speciality} onChange={e => setContent({...content, home: {...content.home, doctorProfile: {...content.home.doctorProfile, speciality: e.target.value}}})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                        <div className="space-y-4 md:col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Qualifications</label>
                          <input type="text" value={content.home.doctorProfile.qualifications} onChange={e => setContent({...content, home: {...content.home, doctorProfile: {...content.home.doctorProfile, qualifications: e.target.value}}})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                        <div className="space-y-4 md:col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Profile Bio</label>
                          <textarea rows={4} value={content.home.doctorProfile.bio} onChange={e => setContent({...content, home: {...content.home, doctorProfile: {...content.home.doctorProfile, bio: e.target.value}}})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-medium outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Experience (e.g. 10+)</label>
                          <input type="text" value={content.home.doctorProfile.yearsExperience} onChange={e => setContent({...content, home: {...content.home, doctorProfile: {...content.home.doctorProfile, yearsExperience: e.target.value}}})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Patients Served (e.g. 15,000+)</label>
                          <input type="text" value={content.home.doctorProfile.patientsServed} onChange={e => setContent({...content, home: {...content.home, doctorProfile: {...content.home.doctorProfile, patientsServed: e.target.value}}})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                        <div className="space-y-4 md:col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Doctor Photo URL</label>
                          <input type="text" value={content.home.doctorProfile.image} onChange={e => setContent({...content, home: {...content.home, doctorProfile: {...content.home.doctorProfile, image: e.target.value}}})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-medium outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {contentTab === 'about' && (
                  <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-10 animate-in fade-in duration-500">
                    <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-800"><StethoscopeIcon className="text-teal-600" /> About & Story</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mission Statement</label>
                          <textarea rows={3} value={content.about.mission} onChange={e => setContent({...content, about: {...content.about, mission: e.target.value}})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-medium outline-none focus:ring-2 focus:ring-teal-500" />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Vision Statement</label>
                          <textarea rows={3} value={content.about.vision} onChange={e => setContent({...content, about: {...content.about, vision: e.target.value}})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-medium outline-none focus:ring-2 focus:ring-teal-500" />
                       </div>
                    </div>
                  </div>
                )}

                {contentTab === 'gallery' && (
                   <div className="space-y-10 animate-in fade-in duration-500">
                     <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
                        <div className="flex justify-between items-center">
                           <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-800"><Camera className="text-teal-600" /> Gallery Manager</h3>
                           <button 
                             onClick={() => setEditingGalleryItem({ id: '', title: '', url: '', category: 'interior' })}
                             className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs"
                           >
                             <Plus size={16} /> Add Photo
                           </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                           {gallery.map(item => (
                             <div key={item.id} className="group relative bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100">
                                <img src={item.url} className="w-full aspect-video object-cover" alt={item.title} />
                                <div className="p-4 flex justify-between items-center">
                                   <div>
                                      <p className="text-sm font-bold text-slate-800">{item.title}</p>
                                      <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">{item.category}</p>
                                   </div>
                                   <button onClick={() => handleSave(() => db.deleteGalleryItem(item.id))} className="text-red-400 hover:text-red-600 transition-colors">
                                      <Trash2 size={16} />
                                   </button>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
                        <h3 className="text-2xl font-bold text-slate-800">Gallery Header Content</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Main Header</label>
                              <input type="text" value={content.galleryPage.header} onChange={e => setContent({...content, galleryPage: {...content.galleryPage, header: e.target.value}})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-teal-500" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Subhead Description</label>
                              <input type="text" value={content.galleryPage.subhead} onChange={e => setContent({...content, galleryPage: { ...content.galleryPage, subhead: e.target.value }})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-teal-500" />
                           </div>
                        </div>
                     </div>
                   </div>
                )}

                {contentTab === 'others' && (
                  <div className="space-y-10 animate-in fade-in duration-500">
                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
                      <h4 className="text-xl font-bold flex items-center gap-3 text-slate-800"><Calendar className="text-teal-600" /> Booking Page (Appointment)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Page Header</label>
                            <input type="text" value={content.appointmentPage.header} onChange={e => setContent({...content, appointmentPage: {...content.appointmentPage, header: e.target.value}})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-teal-500" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Portal Title</label>
                            <input type="text" value={content.appointmentPage.portalTitle} onChange={e => setContent({...content, appointmentPage: {...content.appointmentPage, portalTitle: e.target.value}})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-teal-500" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cloud Tagline</label>
                            <input type="text" value={content.appointmentPage.portalTag} onChange={e => setContent({...content, appointmentPage: {...content.appointmentPage, portalTag: e.target.value}})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-teal-500" />
                         </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
                      <h4 className="text-xl font-bold flex items-center gap-3 text-slate-800"><Phone className="text-teal-600" /> Contact Page Content</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" value={content.contactPage.header} onChange={e => setContent({...content, contactPage: {...content.contactPage, header: e.target.value}})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-teal-500" />
                        <input type="text" value={content.contactPage.subhead} onChange={e => setContent({...content, contactPage: {...content.contactPage, subhead: e.target.value}})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-teal-500" />
                      </div>
                    </div>
                  </div>
                )}

                <button onClick={() => handleSave(() => db.updateContent(content))} className="w-full py-6 bg-slate-900 text-white rounded-3xl font-extrabold text-xl hover:bg-teal-600 transition-all shadow-xl flex items-center justify-center gap-3">
                  <Save size={24} /> Synchronize Global Content
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto">
               <form onSubmit={async (e) => { e.preventDefault(); handleSave(() => db.updateSettings(settings)); }} className="bg-white rounded-[3rem] p-14 border border-slate-100 shadow-sm space-y-10">
                  <h3 className="text-3xl font-extrabold tracking-tight">Clinic Profile</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Clinic Brand Name</label>
                        <input type="text" value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-teal-500 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Primary Phone</label>
                        <input type="tel" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-teal-500 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp Business</label>
                        <input type="text" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-teal-500 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Clinical Email</label>
                        <input type="email" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-teal-500 font-bold" />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-3xl font-extrabold text-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                    <Save size={24} /> Update Site Settings
                  </button>
               </form>
            </div>
          )}
        </main>
      </div>

      {/* PATIENT PROFILE SLIDE-OVER / MODAL */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-white h-screen overflow-y-auto animate-in slide-in-from-right duration-500 shadow-2xl flex flex-col">
            <header className="bg-slate-900 p-10 text-white shrink-0">
               <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-xl">
                    {selectedPatient.name.charAt(0)}
                  </div>
                  <button onClick={() => setSelectedPatient(null)} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                    <X size={24} />
                  </button>
               </div>
               <div>
                  <h3 className="text-3xl font-extrabold tracking-tight mb-2">{selectedPatient.name}</h3>
                  <p className="text-teal-400 font-bold flex items-center gap-2">
                    <Phone size={16} /> {selectedPatient.phone}
                  </p>
               </div>
            </header>

            <div className="p-10 space-y-12 flex-grow">
               <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-teal-600" /> Patient Summary
                  </h4>
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{selectedPatient.notes || 'No general notes recorded for this patient.'}</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <History size={12} className="text-teal-600" /> Treatment Timeline
                  </h4>
                  <div className="space-y-4">
                    {selectedPatient.history.length === 0 ? (
                      <p className="text-xs text-slate-300 italic">No historical treatment data available.</p>
                    ) : (
                      selectedPatient.history.slice().reverse().map((entry, idx) => (
                        <div key={entry.id} className="relative pl-8 border-l-2 border-slate-100 pb-4">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-teal-500 border-4 border-white shadow-sm"></div>
                          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <p className="font-bold text-slate-900">{entry.service}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">{entry.date}</p>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed italic">"{entry.notes}"</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
               </div>
            </div>

            <footer className="p-10 border-t border-slate-100 bg-slate-50 flex gap-4">
               <button onClick={() => setSelectedPatient(null)} className="flex-grow py-4 bg-slate-900 text-white rounded-xl font-bold">Close Portal</button>
               <button className="px-6 py-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-400 hover:text-teal-600 transition-all"><Edit2 size={20} /></button>
            </footer>
          </div>
        </div>
      )}

      {/* QR MODAL */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[4rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col items-center">
            <button onClick={() => setShowQRModal(false)} className="absolute top-8 right-8 p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">
              <X size={24} />
            </button>
            <div className="text-center space-y-2 mb-10">
              <h4 className="text-3xl font-extrabold text-slate-900">Scan to Book</h4>
              <p className="text-sm font-bold text-teal-600 uppercase tracking-widest">Digital Appointment Portal</p>
            </div>
            <div className="p-8 bg-white rounded-[3rem] border-8 border-slate-50 shadow-inner mb-10">
              <img src={qrCodeUrl} alt="Booking QR Code" className="w-64 h-64" />
            </div>
            <div className="space-y-4 w-full text-center">
              <p className="text-xs text-slate-400 font-bold bg-slate-50 py-3 rounded-xl break-all px-4">{bookingUrl}</p>
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => window.print()} className="flex items-center justify-center gap-2 bg-slate-100 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-all">
                   <Printer size={18} /> Print Poster
                 </button>
                 <a href={qrCodeUrl} download="booking-qr.png" className="flex items-center justify-center gap-2 bg-teal-600 text-white py-4 rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20">
                   <Download size={18} /> Save Image
                 </a>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-slate-100 w-full flex items-center justify-center gap-3">
               <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">C</div>
               <span className="text-sm font-extrabold text-slate-900">{settings.name}</span>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY ITEM MODAL */}
      {editingGalleryItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
          <form onSubmit={async (e) => { 
            e.preventDefault(); 
            handleSave(() => db.addGalleryItem(editingGalleryItem)); 
            setEditingGalleryItem(null); 
          }} className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl space-y-6">
            <h4 className="text-2xl font-bold">Add Gallery Image</h4>
            <div className="space-y-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Image Title</label>
                  <input required type="text" placeholder="e.g. Modern Operatory" value={editingGalleryItem.title} onChange={e => setEditingGalleryItem({...editingGalleryItem, title: e.target.value})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-teal-500" />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Image URL</label>
                  <input required type="text" placeholder="https://..." value={editingGalleryItem.url} onChange={e => setEditingGalleryItem({...editingGalleryItem, url: e.target.value})} className="w-full px-6 py-4 rounded-xl bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-teal-500" />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
                  <select value={editingGalleryItem.category} onChange={e => setEditingGalleryItem({...editingGalleryItem, category: e.target.value as any})} className="w-full bg-slate-50 p-4 rounded-xl font-bold outline-none border-none ring-2 ring-transparent focus:ring-teal-500 transition-all">
                    <option value="interior">Interior</option>
                    <option value="equipment">Equipment</option>
                    <option value="environment">Environment</option>
                  </select>
               </div>
            </div>
            <div className="flex gap-4 pt-4">
               <button type="submit" className="flex-grow bg-teal-600 text-white py-4 rounded-xl font-bold shadow-xl shadow-teal-500/20 active:scale-95 transition-all">Save Image</button>
               <button type="button" onClick={() => setEditingGalleryItem(null)} className="px-8 bg-slate-100 text-slate-500 rounded-xl font-bold">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;

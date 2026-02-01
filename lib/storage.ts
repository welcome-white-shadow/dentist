
import { Lead, Service, ClinicGallery, Patient, Doctor, Notification } from '../types';
import { SERVICES as INITIAL_SERVICES, GALLERY as INITIAL_GALLERY } from '../constants';

const LEADS_KEY = 'clips_dental_leads';
const SERVICES_KEY = 'clips_dental_services';
const GALLERY_KEY = 'clips_dental_gallery';
const SETTINGS_KEY = 'clips_dental_settings';
const PATIENTS_KEY = 'clips_dental_patients';
const DOCTORS_KEY = 'clips_dental_doctors';
const NOTIFICATIONS_KEY = 'clips_dental_notifications';

// --- NOTIFICATIONS ---
export const getNotifications = (): Notification[] => {
  const data = localStorage.getItem(NOTIFICATIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const addNotification = (notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
  const notifications = getNotifications();
  const newNotif: Notification = {
    ...notif,
    id: Math.random().toString(36).substr(2, 9),
    isRead: false,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([newNotif, ...notifications].slice(0, 50))); // Keep last 50
  return newNotif;
};

export const markNotificationRead = (id: string) => {
  const notifications = getNotifications();
  const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
};

export const markAllRead = () => {
  const notifications = getNotifications();
  const updated = notifications.map(n => ({ ...n, isRead: true }));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
};

export const clearNotifications = () => {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
};

// --- LEADS ---
export const saveLead = (lead: Omit<Lead, 'id' | 'status' | 'createdAt'>) => {
  const existingLeads = getLeads();
  const newLead: Lead = {
    ...lead,
    id: Math.random().toString(36).substr(2, 9),
    status: 'new',
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(LEADS_KEY, JSON.stringify([newLead, ...existingLeads]));

  // Add notification for new lead
  addNotification({
    title: lead.type === 'appointment' ? 'New Booking Request' : 'New Contact Inquiry',
    message: `${lead.name} has reached out regarding ${lead.service || 'a general query'}.`,
    type: 'lead'
  });

  return newLead;
};

export const getLeads = (): Lead[] => {
  const data = localStorage.getItem(LEADS_KEY);
  return data ? JSON.parse(data) : [];
};

export const updateLead = (updatedLead: Lead) => {
  const leads = getLeads();
  const updated = leads.map(l => l.id === updatedLead.id ? updatedLead : l);
  localStorage.setItem(LEADS_KEY, JSON.stringify(updated));
};

export const updateLeadStatus = (id: string, status: Lead['status']) => {
  const leads = getLeads();
  const updated = leads.map(l => l.id === id ? { ...l, status } : l);
  localStorage.setItem(LEADS_KEY, JSON.stringify(updated));
};

export const deleteLead = (id: string) => {
  const leads = getLeads();
  const filtered = leads.filter(l => l.id !== id);
  localStorage.setItem(LEADS_KEY, JSON.stringify(filtered));
};

// --- PATIENTS ---
export const getPatients = (): Patient[] => {
  const data = localStorage.getItem(PATIENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePatient = (patient: Patient) => {
  const patients = getPatients();
  const index = patients.findIndex(p => p.id === patient.id);
  
  if (index >= 0) {
    // Significant update check: Check if history length changed or notes changed significantly
    const oldPatient = patients[index];
    const isSignificant = oldPatient.history.length !== patient.history.length || oldPatient.notes !== patient.notes;
    
    if (isSignificant) {
      addNotification({
        title: 'Patient Record Updated',
        message: `Clinical data for ${patient.name} has been modified.`,
        type: 'patient'
      });
    }
    patients[index] = patient;
  } else {
    patients.push(patient);
    addNotification({
      title: 'New Patient Registered',
      message: `${patient.name} has been added to the database.`,
      type: 'patient'
    });
  }
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
};

export const deletePatient = (id: string) => {
  const patients = getPatients();
  const filtered = patients.filter(p => p.id !== id);
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(filtered));
};

// --- DOCTORS ---
export const getDoctors = (): Doctor[] => {
  const data = localStorage.getItem(DOCTORS_KEY);
  if (!data) {
    const initial: Doctor[] = [
      {
        id: 'dr-mayur mahajan',
        name: 'Dr. mayur mahajan',
        speciality: 'MDS - Endodontist',
        phone: '+91 77748 46801',
        email: 'sameer@clipsdental.in',
        onDuty: true,
        joinedAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(DOCTORS_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

export const saveDoctor = (doctor: Doctor) => {
  const doctors = getDoctors();
  const index = doctors.findIndex(d => d.id === doctor.id);
  if (index >= 0) {
    doctors[index] = doctor;
  } else {
    doctors.push(doctor);
  }
  localStorage.setItem(DOCTORS_KEY, JSON.stringify(doctors));
};

export const deleteDoctor = (id: string) => {
  const doctors = getDoctors();
  const filtered = doctors.filter(d => d.id !== id);
  localStorage.setItem(DOCTORS_KEY, JSON.stringify(filtered));
};

// --- SERVICES ---
export const getServices = (): Service[] => {
  const data = localStorage.getItem(SERVICES_KEY);
  if (!data) {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(INITIAL_SERVICES));
    return INITIAL_SERVICES;
  }
  return JSON.parse(data);
};

export const saveService = (service: Service) => {
  const services = getServices();
  const index = services.findIndex(s => s.id === service.id);
  if (index >= 0) {
    services[index] = service;
  } else {
    services.push(service);
  }
  localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
};

export const deleteService = (id: string) => {
  const services = getServices();
  const filtered = services.filter(s => s.id !== id);
  localStorage.setItem(SERVICES_KEY, JSON.stringify(filtered));
};

// --- GALLERY ---
export const getGallery = (): ClinicGallery[] => {
  const data = localStorage.getItem(GALLERY_KEY);
  if (!data) {
    localStorage.setItem(GALLERY_KEY, JSON.stringify(INITIAL_GALLERY));
    return INITIAL_GALLERY;
  }
  return JSON.parse(data);
};

export const addGalleryItem = (item: Omit<ClinicGallery, 'id'>) => {
  const gallery = getGallery();
  const newItem = { ...item, id: Date.now().toString() };
  localStorage.setItem(GALLERY_KEY, JSON.stringify([...gallery, newItem]));
};

export const deleteGalleryItem = (id: string) => {
  const gallery = getGallery();
  const filtered = gallery.filter(g => g.id !== id);
  localStorage.setItem(GALLERY_KEY, JSON.stringify(filtered));
};

// --- CLINIC SETTINGS ---
export interface ClinicSettings {
  name: string;
  phone: string;
  phone2?: string;
  whatsapp: string;
  email: string;
  location: string;
}

export const getClinicSettings = (): ClinicSettings => {
  const data = localStorage.getItem(SETTINGS_KEY);
  if (!data) {
    const initial: ClinicSettings = {
      name: "CLIPS DENTAL CLINIC",
      phone: "+91 77748 46801",
      phone2: "07383618280",
      whatsapp: "917774846801",
      email: "contact@clipsdentalclinic.in",
      location: "Behind Panchmukhi Hanuman Mandir, Near By Harsiddhi Hospital, Sindhi Colony Road, Bazar, Jalgaon-425001, Maharashtra"
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

export const updateClinicSettings = (settings: ClinicSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};


import { Lead, Service, ClinicGallery, Patient, Doctor, Notification, WebsiteContent, Testimonial } from '../types';
import { SERVICES as INITIAL_SERVICES, TESTIMONIALS as INITIAL_TESTIMONIALS, GALLERY as INITIAL_GALLERY } from '../constants';

const DELAY = 600; 

const keys = {
  LEADS: 'clips_dental_leads',
  SERVICES: 'clips_dental_services',
  GALLERY: 'clips_dental_gallery',
  SETTINGS: 'clips_dental_settings',
  CONTENT: 'clips_dental_website_content',
  TESTIMONIALS: 'clips_dental_testimonials',
  PATIENTS: 'clips_dental_patients',
  DOCTORS: 'clips_dental_doctors',
  NOTIFICATIONS: 'clips_dental_notifications',
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getStore = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const setStore = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const db = {
  // --- NOTIFICATIONS ---
  getNotifications: async (): Promise<Notification[]> => {
    await wait(DELAY);
    return getStore(keys.NOTIFICATIONS, []);
  },

  addNotification: async (notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const notifications = getStore<Notification[]>(keys.NOTIFICATIONS, []);
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setStore(keys.NOTIFICATIONS, [newNotif, ...notifications].slice(0, 50));
    return newNotif;
  },

  // --- LEADS ---
  getLeads: async (): Promise<Lead[]> => {
    await wait(DELAY);
    return getStore<Lead[]>(keys.LEADS, []);
  },

  saveLead: async (lead: Omit<Lead, 'id' | 'status' | 'createdAt'>) => {
    const existingLeads = getStore<Lead[]>(keys.LEADS, []);
    const newLead: Lead = {
      ...lead,
      id: Math.random().toString(36).substr(2, 9),
      status: 'new',
      createdAt: new Date().toISOString()
    };
    setStore(keys.LEADS, [newLead, ...existingLeads]);
    await db.addNotification({
      title: lead.type === 'appointment' ? 'New Booking Request' : 'New Contact Inquiry',
      message: `${lead.name} has reached out regarding ${lead.service || 'a general query'}.`,
      type: 'lead'
    });
    return newLead;
  },

  updateLead: async (updatedLead: Lead) => {
    const leads = getStore<Lead[]>(keys.LEADS, []);
    setStore(keys.LEADS, leads.map(l => l.id === updatedLead.id ? updatedLead : l));
  },

  deleteLead: async (id: string) => {
    const leads = getStore<Lead[]>(keys.LEADS, []);
    setStore(keys.LEADS, leads.filter(l => l.id !== id));
  },

  // --- WEBSITE CONTENT ---
  getContent: async (): Promise<WebsiteContent> => {
    const defaultContent: WebsiteContent = {
      home: {
        hero: {
          headline: "Your Smile, Our Priority.",
          subheadline: "Advanced Dental Care with Painless Treatment protocols. Experience international standards of medical excellence.",
          image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800"
        },
        intro: {
          title: "Advanced Solutions",
          description: "Transforming dental care in Jalgaon with microscopic precision, ethical practices, and a 100% painless treatment focus."
        },
        doctorProfile: {
          name: "Dr. mayur mahajan",
          speciality: "MDS - Endodontist & Implantologist",
          qualifications: "MDS (Endodontics), BDS, Fellowship in Oral Implantology",
          bio: "Dr. mayur mahajan is a renowned dental specialist in Jalgaon, known for his expertise in microscopic root canal treatments and digital implantology. With a focus on ethical practices and patient comfort, he has successfully treated thousands of complex dental cases, ensuring long-term results and pain-free experiences.",
          image: "https://images.jdmagicbox.com/v2/comp/jalgaon/q6/9999px257.x257.250912132318.t6q6/catalogue/dr-clips-jalgaon-bazar-jalgaon-dentists-p0gf6hljw6.jpg",
          yearsExperience: "10+",
          patientsServed: "15,000+"
        }
      },
      about: {
        story: {
          title: "10+ Years of Crafting Perfect Smiles",
          description1: "CLIPS DENTAL CLINIC started as a humble practice with a single goal: to provide world-class dental solutions that are accessible and painless for the people of Jalgaon.",
          description2: "Today, we are a leading multi-speciality dental hub, known for our precision in Root Canal treatments and Dental Implants.",
          image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800"
        },
        mission: "To deliver exceptional dental care using ethical practices and the latest innovations, ensuring every patient walks out with a healthier smile and complete satisfaction.",
        vision: "To be the most trusted dental care provider in Maharashtra, recognized for setting benchmark standards in micro-dentistry and patient comfort."
      },
      servicesPage: {
        header: "Our Dental Expertise",
        subhead: "State-of-the-art dental care powered by advanced microscopic technology.",
        bannerTitle: "Can't Find What You're Looking For?",
        bannerText: "We offer comprehensive oral diagnosis. Schedule a consultation and our specialists will perform a full check-up to create a personalized treatment path for you."
      },
      galleryPage: {
        header: "Our Showcase",
        subhead: "Step inside our sterile, modern, and patient-centric clinic environment."
      },
      appointmentPage: {
        header: "Reserve Your Slot",
        subhead: "Database-connected booking for seamless healthcare.",
        portalTitle: "Clinical Portal",
        portalTag: "Cloud Database Connected"
      },
      contactPage: {
        header: "Contact Us",
        subhead: "Have questions? We're here to help you with your dental journey."
      }
    };
    return getStore(keys.CONTENT, defaultContent);
  },

  updateContent: async (content: WebsiteContent) => {
    await wait(DELAY);
    setStore(keys.CONTENT, content);
  },

  // --- TESTIMONIALS ---
  getTestimonials: async (): Promise<Testimonial[]> => {
    return getStore(keys.TESTIMONIALS, INITIAL_TESTIMONIALS);
  },

  saveTestimonial: async (testimonial: Testimonial) => {
    const list = await db.getTestimonials();
    const index = list.findIndex(t => t.id === testimonial.id);
    if (index >= 0) list[index] = testimonial;
    else list.push(testimonial);
    setStore(keys.TESTIMONIALS, list);
  },

  deleteTestimonial: async (id: string) => {
    const list = await db.getTestimonials();
    setStore(keys.TESTIMONIALS, list.filter(t => t.id !== id));
  },

  // --- SERVICES ---
  getServices: async (): Promise<Service[]> => {
    return getStore(keys.SERVICES, INITIAL_SERVICES);
  },

  saveService: async (service: Service) => {
    const list = await db.getServices();
    const index = list.findIndex(s => s.id === service.id);
    if (index >= 0) list[index] = service;
    else list.push(service);
    setStore(keys.SERVICES, list);
  },

  // --- GALLERY ---
  getGallery: async (): Promise<ClinicGallery[]> => {
    return getStore(keys.GALLERY, INITIAL_GALLERY);
  },

  addGalleryItem: async (item: Omit<ClinicGallery, 'id'>) => {
    const gallery = getStore<ClinicGallery[]>(keys.GALLERY, INITIAL_GALLERY);
    const newItem = { ...item, id: Date.now().toString() };
    setStore(keys.GALLERY, [...gallery, newItem]);
    return newItem;
  },

  deleteGalleryItem: async (id: string) => {
    const gallery = getStore<ClinicGallery[]>(keys.GALLERY, INITIAL_GALLERY);
    setStore(keys.GALLERY, gallery.filter(g => g.id !== id));
  },

  // --- PATIENTS ---
  getPatients: async (): Promise<Patient[]> => {
    return getStore(keys.PATIENTS, []);
  },

  savePatient: async (patient: Patient) => {
    const patients = getStore<Patient[]>(keys.PATIENTS, []);
    const index = patients.findIndex(p => p.id === patient.id);
    if (index >= 0) patients[index] = patient;
    else patients.push(patient);
    setStore(keys.PATIENTS, patients);
  },

  deletePatient: async (id: string) => {
    const patients = getStore<Patient[]>(keys.PATIENTS, []);
    setStore(keys.PATIENTS, patients.filter(p => p.id !== id));
  },

  // --- DOCTORS ---
  getDoctors: async (): Promise<Doctor[]> => {
    return getStore(keys.DOCTORS, [{
      id: 'dr-sameer',
      name: 'Dr. Sameer Patil',
      speciality: 'MDS - Endodontist',
      phone: '+91 77748 46801',
      email: 'sameer@clipsdental.in',
      onDuty: true,
      joinedAt: new Date().toISOString()
    }]);
  },

  saveDoctor: async (doctor: Doctor) => {
    const doctors = await db.getDoctors();
    const index = doctors.findIndex(d => d.id === doctor.id);
    if (index >= 0) doctors[index] = doctor;
    else doctors.push(doctor);
    setStore(keys.DOCTORS, doctors);
  },

  deleteDoctor: async (id: string) => {
    const doctors = await db.getDoctors();
    setStore(keys.DOCTORS, doctors.filter(d => d.id !== id));
  },

  // --- SETTINGS ---
  getSettings: async (): Promise<any> => {
    return getStore(keys.SETTINGS, {
      name: "CLIPS DENTAL CLINIC",
      phone: "+91 77748 46801",
      phone2: "07383618280",
      whatsapp: "917774846801",
      email: "contact@clipsdentalclinic.in",
      location: "Behind Panchmukhi Hanuman Mandir, Near By Harsiddhi Hospital, Sindhi Colony Road, Bazar, Jalgaon-425001, Maharashtra"
    });
  },

  updateSettings: async (settings: any) => {
    await wait(DELAY);
    setStore(keys.SETTINGS, settings);
  }
};

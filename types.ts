
export interface Service {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  benefits: string[];
  iconName: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

export interface ClinicGallery {
  id: string;
  url: string;
  category: 'interior' | 'equipment' | 'environment';
  title: string;
}

export interface WebsiteContent {
  home: {
    hero: {
      headline: string;
      subheadline: string;
      image: string;
    };
    intro: {
      title: string;
      description: string;
    };
    doctorProfile: {
      name: string;
      speciality: string;
      qualifications: string;
      bio: string;
      image: string;
      yearsExperience: string;
      patientsServed: string;
    };
  };
  about: {
    story: {
      title: string;
      description1: string;
      description2: string;
      image: string;
    };
    mission: string;
    vision: string;
  };
  servicesPage: {
    header: string;
    subhead: string;
    bannerTitle: string;
    bannerText: string;
  };
  galleryPage: {
    header: string;
    subhead: string;
  };
  appointmentPage: {
    header: string;
    subhead: string;
    portalTitle: string;
    portalTag: string;
  };
  contactPage: {
    header: string;
    subhead: string;
  };
}

export interface Lead {
  id: string;
  type: 'appointment' | 'contact';
  name: string;
  phone: string;
  email?: string;
  service?: string;
  date?: string;
  time?: string;
  message: string;
  status: 'new' | 'contacted' | 'completed' | 'cancelled';
  createdAt: string;
  doctorId?: string; 
}

export interface PatientHistoryItem {
  id: string;
  date: string;
  service: string;
  notes: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes: string;
  history: PatientHistoryItem[];
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  speciality: string;
  phone: string;
  email: string;
  onDuty: boolean;
  joinedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'lead' | 'patient' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

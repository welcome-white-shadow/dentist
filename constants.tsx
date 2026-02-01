import React from 'react';
import { 
  Stethoscope, 
  Sparkles, 
  Smile, 
  Baby, 
  ShieldAlert, 
  Activity, 
  Clock, 
  Award, 
  ShieldCheck,
  Microscope,
  CalendarCheck,
  UserCheck,
  Zap,
  BriefcaseMedical
} from 'lucide-react';
import { Service, Testimonial, ClinicGallery } from './types';

export const CLINIC_NAME = "CLIPS DENTAL CLINIC";
export const CLINIC_LOCATION = "Behind Panchmukhi Hanuman Mandir, Near By Harsiddhi Hospital, Sindhi Colony Road, Bazar, Jalgaon-425001, Maharashtra";
export const CLINIC_PHONE = "+91 77748 46801";
export const CLINIC_PHONE_ALT = "07383618280";
export const CLINIC_WHATSAPP = "917774846801";
export const CLINIC_EMAIL = "contact@clipsdentalclinic.in";

export const SERVICES: Service[] = [
  {
    id: 'general-dentistry',
    title: 'General Dentistry',
    description: 'Comprehensive check-ups and preventative care for all age groups.',
    longDescription: 'We provide routine oral examinations, high-quality composite fillings, and detailed consultations to ensure your primary dental health is always maintained at its peak.',
    benefits: ['Cavity Prevention', 'Oral Health Education', 'Early Problem Detection'],
    iconName: 'Stethoscope'
  },
  {
    id: 'root-canal',
    title: 'Root Canal Treatment',
    description: 'Expert endodontic treatment to save your natural teeth painlessly.',
    longDescription: 'Our single-visit root canal treatments utilize rotary endodontics and digital apex locators for 100% precision and comfort, saving your tooth from extraction.',
    benefits: ['Pain Elimination', 'Natural Tooth Preservation', 'Quick Single-Visit Options'],
    iconName: 'Activity'
  },
  {
    id: 'cleaning-scaling',
    title: 'Teeth Cleaning & Scaling',
    description: 'Professional plaque removal and gum health maintenance.',
    longDescription: 'Ultrasonic scaling and polishing to remove stubborn tartar and stains, preventing gum diseases like gigivitis and periodontitis.',
    benefits: ['Fresh Breath', 'Healthier Gums', 'Stain Removal'],
    iconName: 'Sparkles'
  },
  {
    id: 'teeth-whitening',
    title: 'Teeth Whitening',
    description: 'Clinical brightening for a radiant, movie-star smile.',
    longDescription: 'Advanced laser whitening techniques that can brighten your teeth up to 8 shades in just 45 minutes, with zero sensitivity.',
    benefits: ['Instant Confidence', 'Safe Enamel Care', 'Long-lasting Brilliance'],
    iconName: 'Zap'
  },
  {
    id: 'dental-implants',
    title: 'Dental Implants',
    description: 'The gold standard for missing tooth replacement.',
    longDescription: 'Titanium implants that look, feel, and function exactly like natural teeth, providing a lifelong solution for tooth loss.',
    benefits: ['Lifelong Durability', 'Preserves Jawbone', 'Natural Functionality'],
    iconName: 'Smile'
  },
  {
    id: 'braces-aligners',
    title: 'Braces & Aligners',
    description: 'Straighten your smile with modern orthodontic solutions.',
    longDescription: 'Choose between traditional ceramic braces or clear invisible aligners for a discreet way to correct crowded or gapped teeth.',
    benefits: ['Perfect Alignment', 'Invisible Options', 'Improved Bite Force'],
    iconName: 'CalendarCheck'
  },
  {
    id: 'cosmetic-dentistry',
    title: 'Cosmetic Dentistry',
    description: 'Veneers and smile designing for the perfect look.',
    longDescription: 'E-max veneers and porcelain crowns designed digitally to enhance your facial aesthetics and give you the smile you\'ve always dreamed of.',
    benefits: ['Custom Smile Design', 'Aesthetic Correction', 'Durable Veneers'],
    iconName: 'UserCheck'
  },
  {
    id: 'pediatric-dentistry',
    title: 'Pediatric Dentistry',
    description: 'Specialized and gentle care for children.',
    longDescription: 'A child-friendly atmosphere where our specialists handle your little one\'s dental needs with patience, from milk tooth care to habit breaking.',
    benefits: ['Child-Centric Approach', 'Fun Environment', 'Preventive Care'],
    iconName: 'Baby'
  },
  {
    id: 'emergency-care',
    title: 'Emergency Dental Care',
    description: 'Immediate relief for acute pain and dental trauma.',
    longDescription: 'Suffering from a sudden toothache or broken tooth? We offer priority emergency slots to provide instant pain relief and stabilization.',
    benefits: ['24/7 Phone Support', 'Immediate Pain Relief', 'Emergency Extractions'],
    iconName: 'ShieldAlert'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Anil Mahajan',
    rating: 5,
    text: 'Best dentist in Jalgaon! Dr. Sameer explained the procedure very well. My Root Canal was totally painless. Highly recommend CLIPS!',
    date: '15 days ago'
  },
  {
    id: '2',
    name: 'Meena Kulkarni',
    rating: 5,
    text: 'The clinic is extremely clean and modern. I got my teeth whitening done here and the results are amazing. Very professional staff.',
    date: '1 month ago'
  },
  {
    id: '3',
    name: 'Dr. Vivek Patil',
    rating: 5,
    text: 'As a fellow doctor, I can attest to the high sterilization standards at CLIPS. Great use of technology and very patient-friendly approach.',
    date: '2 months ago'
  }
];

export const GALLERY: ClinicGallery[] = [
  { id: 'g1', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800', category: 'interior', title: 'Premium Reception' },
  { id: 'g2', url: 'https://images.unsplash.com/photo-1588776814546-1ffce47267a5?auto=format&fit=crop&q=80&w=800', category: 'equipment', title: 'Advanced Dental Unit' },
  { id: 'g3', url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800', category: 'environment', title: 'Sterile Operatory' },
  { id: 'g4', url: 'https://images.unsplash.com/photo-1445527815219-ecbfec67492e?auto=format&fit=crop&q=80&w=800', category: 'interior', title: 'Consultation Zone' },
  { id: 'g5', url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800', category: 'equipment', title: 'Digital X-Ray Suite' },
  { id: 'g6', url: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=800', category: 'environment', title: 'Patient Lounge' }
];

export const getIcon = (name: string, size = 24, className = "") => {
  const icons: Record<string, any> = {
    Stethoscope, Sparkles, Smile, Baby, ShieldAlert, Activity, Clock, Award, ShieldCheck, Microscope, CalendarCheck, UserCheck, Zap, BriefcaseMedical
  };
  const IconComponent = icons[name] || BriefcaseMedical;
  return <IconComponent size={size} className={className} />;
};

export const SEO_QUERIES = [
  "Best dentist in Jalgaon",
  "Painless root canal treatment",
  "Teeth whitening Jalgaon",
  "Dental implants cost",
  "Invisible aligners",
  "Pediatric dentist near me",
  "Emergency dental clinic",
  "Smile designing specialists"
];
export interface Discipline {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;      // Tailwind class e.g., 'bg-blue-50'
  borderColor: string;  // Tailwind class e.g., 'border-blue-200'
  iconBg: string;       // Tailwind class e.g., 'bg-blue-500'
  textColor: string;    // Tailwind class e.g., 'text-blue-700'
  accentColor: string;  // Tailwind class e.g., 'bg-blue-600'
  iconName: string;     // Name of Lucide icon to use
  description: string;
  longDescription: string;
  sampleContents: string[];
  price: number;
  originalPrice: number;
  grade: 'Ensino Fundamental II' | 'Ensino Médio' | 'Ambos';
  image: string;
}

export interface Material {
  id: string;
  title: string;
  disciplineId: string;
  disciplineName: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  isBestSeller: boolean;
  isNew: boolean;
  image: string;
  description: string;
  pages: number;
  fileFormat: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  city: string;
  state: string; // e.g. 'SP', 'RJ'
  rating: number;
  avatar: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  image: string;
}

export interface SystemSettings {
  purchaseUrl: string;
  whatsappNumber: string;
  whatsappMessage: string;
  contactEmail: string;
  supportHours: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  teachersCount: number;
  materialsCount: number;
  downloadsCount: number;
  satisfactionRate: number;
}

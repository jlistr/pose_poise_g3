export interface Profile {
  name: string;
  instagram: string;
  height: string;
  bust: string;
  waist: string;
  hips: string;
  shoeSize: string;
  hairColor: string;
  eyeColor: string;
}

export interface ImageItem {
  id: string | number;
  url: string;
  vibe?: string;
  photographer?: string;
  photographerUrl?: string;
  studio?: string;
  studioUrl?: string;
}

export interface Shoot {
  id: string | number;
  name: string;
  images: string[];
  vibe?: string;
  photographer?: string;
  photographerUrl?: string;
  studio?: string;
  studioUrl?: string;
}

export interface Aesthetic {
  id: string;
  label: string;
  desc: string;
  colors: string[];
  img: string;
}

export interface CardData {
  id?: string;
  profile: Profile;
  images: string[]; // URLs
  aesthetic: string; // Aesthetic ID
  frontLayout: 'classic' | 'modern' | 'minimal';
  backLayout: 'grid' | 'masonry' | 'triptych';
  timestamp: number;
  modelId: string;
}

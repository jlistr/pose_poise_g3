export interface Profile {
  name: string;
  instagram: string;
  height: string;
  bust: string;
  waist: string;
  hips: string;
  shoeSize: string;
  dressSize?: string;
  hairColor: string;
  eyeColor: string;
  avatar?: string | null;
  careerGoals?: string;
  description?: string;
}

export interface SocialStats {
  platform: 'instagram' | 'tiktok';
  username: string;
  followers: number;
  following: number;
  avatarUrl?: string;
}

export interface ImageItem {
  id: string | number;
  url: string;
  vibes?: string[];
  photographer?: string;
  photographerUrl?: string;
  studio?: string;
  studioUrl?: string;
}

export interface Shoot {
  id: string | number;
  name: string;
  images: string[];
  hiddenImages?: string[]; // URLs of hidden images
  vibes: string[];
  photographer?: string;
  photographerUrl?: string;
  studio?: string;
  studioUrl?: string;
  date?: string; // ISO date string
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
  name?: string;
  profile: Profile;
  images: string[]; // URLs
  aesthetic: string; // Aesthetic ID
  frontLayout: 'classic' | 'modern' | 'minimal';
  backLayout: 'grid' | 'masonry' | 'triptych' | 'agency' | 'focus' | 'band' | 'quad';
  timestamp: number;
  modelId: string;
}

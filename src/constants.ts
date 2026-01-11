import { Aesthetic } from '@/types';

export const AESTHETICS: Aesthetic[] = [
  { id: 'editorial', label: 'Editorial', desc: 'High-concept and artistic.', colors: ['#000000', '#A1A1AA', '#1A1A1B', '#F5F5F5'], img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' },
  { id: 'commercial', label: 'Commercial', desc: 'Relatable and product-focused.', colors: ['#3B82F6', '#F8F9FA', '#FFFFFF', '#1F2937'], img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400' },
  { id: 'street', label: 'Streetwear', desc: 'Urban and edgy.', colors: ['#121212', '#FF4D00', '#E5E7EB', '#374151'], img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400' },
  { id: 'minimalist', label: 'Minimalist', desc: 'Clean lines and simplicity.', colors: ['#FAF9F6', '#D2B48C', '#1A1A1A', '#E7E5E4'], img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400' },
  { id: 'ai_auto', label: 'Use AI', desc: 'Instant, goal-oriented curation. AI selects your best images to match your career targets.', colors: ['#000000', '#FFFFFF', '#34D399', '#10B981'], img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400' },
];

export const VIBE_TAGS = [
  'Editorial', 
  'Commercial', 
  'Bridal', 
  'Swim', 
  'Active Wear', 
  'Lifestyle', 
  'High Fashion', 
  'Beauty', 
  'Portrait', 
  'Runway'
];

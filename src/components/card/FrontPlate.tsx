import React from 'react';
import { Instagram } from 'lucide-react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { Profile } from '@/types';

interface FrontPlateProps {
  layout: 'classic' | 'modern' | 'minimal';
  images: string[];
  profile: Profile;
}

export const FrontPlate: React.FC<FrontPlateProps> = ({ layout, images, profile }) => {
  // Use first image for front
  const mainImage = images[0] || '';
  
  if (layout === 'classic') {
    return (
      <div className="flex flex-col h-full bg-white p-10">
          <img src={mainImage || undefined} className="flex-1 object-cover rounded-sm mb-8 bg-zinc-50" />
          <div className="pt-8 border-t border-zinc-100 flex justify-between items-end">
             <div>
                <h3 className="text-4xl font-serif uppercase tracking-tighter leading-none">{profile.name}</h3>
                <p className="text-[10px] font-bold text-zinc-400 mt-2 tracking-widest">{profile.instagram}</p>
             </div>
             <BrandIcon size={24} className="text-zinc-200" />
          </div>
      </div>
    );
  }
  if (layout === 'modern') {
    return (
      <div className="relative h-full overflow-hidden rounded-sm group">
          <img src={mainImage || undefined} className="w-full h-full object-cover bg-zinc-50" />
          <div className="absolute inset-0 p-8 flex flex-col justify-end text-white bg-gradient-to-t from-black/50 via-transparent to-transparent">
         <h2 className="text-4xl font-serif tracking-tighter uppercase mb-1">{profile.name}</h2>
         {profile.instagram && <p className="text-xs tracking-widest uppercase font-bold opacity-90">{profile.instagram}</p>}
      </div>
    </div>
    );
  }
  if (layout === 'minimal') {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 bg-white">
          <div className="w-full aspect-[4/5] p-6 bg-zinc-50 border border-zinc-100 mb-10 overflow-hidden shadow-inner">
             <img src={mainImage || undefined} className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0" />
          </div>
          <div className="text-center space-y-4">
              <h3 className="text-2xl font-serif uppercase tracking-[0.5em]">{profile.name}</h3>
              <div className="h-px w-8 bg-black/10 mx-auto"></div>
              <p className="text-[8px] font-bold text-zinc-300 uppercase tracking-widest">{profile.instagram}</p>
          </div>
      </div>
    );
  }
  return null;
};

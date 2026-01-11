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
      <div className="flex flex-col h-full bg-white p-8" style={{ backgroundColor: '#ffffff' }}>
          <div 
            className="flex-1 min-h-0 w-full mb-6 rounded-sm bg-zinc-50 bg-cover bg-center"
            style={{ 
              backgroundColor: '#fafafa', 
              backgroundImage: `url(${mainImage})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover'
            }} 
          />
          <div className="pt-6 border-t border-zinc-100 flex justify-between items-end pb-2" style={{ borderColor: '#f4f4f5' }}>
             <div>
                <h3 className="text-4xl font-serif uppercase tracking-tighter leading-none" style={{ color: '#000000' }}>{profile.name}</h3>
                <p className="text-[10px] font-bold text-zinc-400 mt-2 tracking-widest" style={{ color: '#a1a1aa' }}>{profile.instagram}</p>
             </div>
             <BrandIcon size={24} className="text-zinc-200" color="#e4e4e7" />
          </div>
      </div>
    );
  }
  if (layout === 'modern') {
    return (
      <div className="relative h-full overflow-hidden rounded-sm group">
          <div 
             className="w-full h-full bg-cover bg-center bg-zinc-50"
             style={{ 
                backgroundColor: '#fafafa',
                backgroundImage: `url(${mainImage})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover'
             }} 
          />
          <div className="absolute inset-0 p-8 flex flex-col justify-end text-white" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent, transparent)' }}>
         <h2 className="text-4xl font-serif tracking-tighter uppercase mb-1" style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{profile.name}</h2>
         {profile.instagram && <p className="text-xs tracking-widest uppercase font-bold opacity-90" style={{ color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{profile.instagram}</p>}
      </div>
    </div>
    );
  }
  if (layout === 'minimal') {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 bg-white" style={{ backgroundColor: '#ffffff' }}>
          <div className="w-full aspect-[4/5] p-6 mb-10 overflow-hidden shadow-inner flex flex-col" style={{ backgroundColor: '#fafafa', borderColor: '#f4f4f5', borderWidth: '1px', borderStyle: 'solid' }}>
             <div 
                 className="w-full h-full bg-cover bg-center grayscale transition-all duration-1000 group-hover:grayscale-0"
                 style={{ 
                    filter: 'grayscale(100%)',
                    backgroundImage: `url(${mainImage})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover' 
                 }}
             />
          </div>
          <div className="text-center space-y-4">
              <h3 className="text-2xl font-serif uppercase tracking-[0.5em]" style={{ color: '#000000' }}>{profile.name}</h3>
              <div className="h-px w-8 bg-black/10 mx-auto" style={{ backgroundColor: '#000000', opacity: 0.1 }}></div>
              <p className="text-[8px] font-bold text-zinc-300 uppercase tracking-widest" style={{ color: '#d4d4d8' }}>{profile.instagram}</p>
          </div>
      </div>
    );
  }
  return null;
};

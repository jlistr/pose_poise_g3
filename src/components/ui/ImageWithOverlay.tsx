import React from 'react';
import { ImageItem } from '@/types';
import { Eye, Instagram, MapPin, Camera } from 'lucide-react';

interface ImageWithOverlayProps {
  image: ImageItem;
  className?: string; // Additional classes for the container (aspect ratio, etc.)
  onClick?: () => void;
  children?: React.ReactNode; // For action buttons like Delete/Select that sit on top
}

export const ImageWithOverlay: React.FC<ImageWithOverlayProps> = ({ 
  image, 
  className = "aspect-[3/4]", 
  onClick,
  children
}) => {
  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl bg-zinc-50 border border-zinc-100 shadow-sm hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer ${className}`}
      onClick={onClick}
    >
      <img src={image.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 active:opacity-100 transition-all duration-300 flex flex-col justify-between p-4 md:p-6">
        
        {/* Top: Vibe Tag */}
        <div className="transform -translate-y-4 group-hover:translate-y-0 active:translate-y-0 transition-transform duration-300 flex flex-wrap gap-1 justify-start items-start">
           {image.vibes && image.vibes.map(v => (
              <span key={v} className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[8px] font-bold uppercase tracking-widest text-white border border-white/10 shadow-sm">
                {v}
              </span>
           ))}
        </div>

        {/* Center: Eye Icon (Optional decoration or action hint) */}
        {/* Only show if there's no specific children blocking interaction, or just as decoration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           {/* <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg transform scale-50 group-hover:scale-100 active:scale-100 transition-all duration-300">
              <Eye size={20} className="text-black" />
           </div> */}
           {/* Removed Eye icon to keep cleaner for now, can add back if needed */}
        </div>

        {/* Bottom: Credits */}
        <div className="transform translate-y-4 group-hover:translate-y-0 active:translate-y-0 transition-transform duration-300 text-white text-xs bg-gradient-to-t from-black/80 to-transparent p-4 -mx-4 -mb-4 pt-10">
           {(image.photographer || image.studio) && (
              <div className="space-y-2">
                 {image.photographer && (
                    <div className="flex items-center gap-2">
                       <Camera size={12} className="opacity-90" />
                       <div>
                          <p className="font-serif italic leading-none">{image.photographer}</p>
                          {image.photographerUrl && (
                             <p className="text-[9px] opacity-70 uppercase tracking-wider">{image.photographerUrl}</p>
                          )}
                       </div>
                    </div>
                 )}
                 {image.studio && (
                    <div className="flex items-center gap-2">
                       <MapPin size={12} className="opacity-90" />
                       <div>
                          <p className="font-bold text-[10px] uppercase tracking-widest leading-none">{image.studio}</p>
                          {image.studioUrl && (
                             <p className="text-[9px] opacity-70 uppercase tracking-wider">{image.studioUrl}</p>
                          )}
                       </div>
                    </div>
                 )}
              </div>
           )}
        </div>
      </div>
      
      {/* Children rendered absolutely/on top (like Delete buttons) */}
      {children}
    </div>
  );
};

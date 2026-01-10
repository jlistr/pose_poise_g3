import React, { useState, useEffect } from 'react';
import { Shoot, Profile } from '@/types';
import { LayoutGrid, Maximize2, AppWindow, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface PortfolioSettings {
  layout: 'grid' | 'masonry';
  showHero: boolean;
  groupByCollection: boolean;
}

interface PortfolioRendererProps {
  shoots: Shoot[];
  settings: PortfolioSettings;
  isPublicView?: boolean;
  profile?: Profile; // Added optional profile
  username?: string; // Kept for fallback
}

export const PortfolioRenderer: React.FC<PortfolioRendererProps> = ({ shoots, settings, isPublicView = false, profile, username = "MODEL" }) => {
  // Use profile name if available, otherwise username
  const displayName = profile?.name || username;
  const displayInsta = profile?.instagram;
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [flattenedImages, setFlattenedImages] = useState<{ url: string, shoot: Shoot }[]>([]);

  // Update flattened images when shoots or settings change
  useEffect(() => {
    const allImages = shoots.flatMap(s => s.images.map(url => ({ url, shoot: s })));
    setFlattenedImages(allImages);
  }, [shoots]);

  const openLightbox = (url: string) => {
    const index = flattenedImages.findIndex(i => i.url === url);
    if (index !== -1) {
      setCurrentImageIndex(index);
      setLightboxOpen(true);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % flattenedImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + flattenedImages.length) % flattenedImages.length);
  };

  // Helper to handle keyboard nav for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, flattenedImages]);


  // Determine Hero Image (First image of first shoot)
  const heroImage = shoots.length > 0 && shoots[0].images.length > 0 ? shoots[0].images[0] : null;

  return (
    <div className="w-full flex-1 flex flex-col min-h-screen">
      
      {/* Header */}
      <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
         <h1 className="text-6xl md:text-9xl font-serif tracking-tighter uppercase">{displayName}</h1>
         {displayInsta && (
            <a href={`https://instagram.com/${displayInsta.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-block text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
               {displayInsta.startsWith('@') ? displayInsta : `@${displayInsta}`}
            </a>
         )}
      </div>

      {/* Hero Section */}
      {settings.showHero && heroImage && (
        <div className="mb-20 animate-in fade-in duration-700 w-full">
           <div 
             className="relative w-full aspect-[21/9] rounded-sm overflow-hidden group cursor-pointer shadow-sm" 
             onClick={() => openLightbox(heroImage)}
           >
              <img src={heroImage} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 text-white drop-shadow-md">
                 <p className="font-serif text-3xl md:text-5xl italic tracking-tight">{shoots[0]?.name}</p>
                 <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2 opacity-90">Featured Collection</p>
              </div>
           </div>
        </div>
      )}

      {/* Content Rendering */}
      <div className="space-y-24 flex-1 pb-24">
        {settings.groupByCollection ? (
          // GROUPED VIEW: Render each shoot as a distinct section
          shoots.map(shoot => (
            <div key={shoot.id} className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
               {/* Collection Header (Skip if it's the hero shoot and hero is shown? Optional polish) */}
               {(!settings.showHero || shoots.indexOf(shoot) !== 0) && (
                 <div className="flex items-baseline justify-between border-b border-zinc-100 pb-4">
                    <h3 className="font-serif text-3xl">{shoot.name}</h3>
                    <span className="text-zinc-300 text-[10px] font-bold uppercase tracking-widest">{shoot.images.length} Shots</span>
                 </div>
               )}
               
               <div className={`
                 ${settings.layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 gap-4' : 'columns-2 md:columns-3 gap-4 space-y-4'}
               `}>
                 {shoot.images.map((img, i) => (
                   <div 
                     key={i} 
                     className={`
                       group relative overflow-hidden rounded-sm bg-zinc-50 cursor-pointer break-inside-avoid
                       ${settings.layout === 'grid' ? 'aspect-[3/4]' : 'mb-4'}
                     `}
                     onClick={() => openLightbox(img)}
                   >
                     <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-6">
                        {/* Vibe Tag */}
                        <div className="transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                           {shoot.vibe && (
                             <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
                               {shoot.vibe}
                             </span>
                           )}
                        </div>

                        {/* Center Eye Icon */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                           <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg transform scale-50 group-hover:scale-100 transition-all duration-300">
                              <Eye size={20} className="text-black" />
                           </div>
                        </div>

                        {/* Credits */}
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-white text-xs">
                           {(shoot.photographer || shoot.studio) && (
                              <div className="space-y-1">
                                 {shoot.photographer && <p className="font-serif italic">By {shoot.photographer}</p>}
                                 {shoot.studio && <p className="text-[10px] uppercase tracking-widest opacity-80">{shoot.studio}</p>}
                              </div>
                           )}
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          ))
        ) : (
          // UNGROUPED VIEW: Mix all images (excluding hero potentially, or just dumping all)
          // "The image grid should always display all active images together by default."
          <div className={`
             ${settings.layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 gap-4' : 'columns-2 md:columns-3 gap-4 space-y-4'}
          `}>
             {flattenedImages.map((item, i) => (
                <div 
                  key={i} 
                  className={`
                    group relative overflow-hidden rounded-sm bg-zinc-50 cursor-pointer break-inside-avoid animate-in zoom-in-50 duration-500
                    ${settings.layout === 'grid' ? 'aspect-[3/4]' : 'mb-4'}
                  `}
                  style={{ animationDelay: `${i * 50}ms` }}
                  onClick={() => openLightbox(item.url)}
                >
                  <img src={item.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-6">
                     {/* Vibe Tag */}
                        <div className="transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                           {item.shoot.vibe && (
                             <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
                               {item.shoot.vibe}
                             </span>
                           )}
                        </div>

                        {/* Center Eye Icon */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                           <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg transform scale-50 group-hover:scale-100 transition-all duration-300">
                              <Eye size={20} className="text-black" />
                           </div>
                        </div>

                        {/* Credits */}
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-white text-xs">
                           {(item.shoot.photographer || item.shoot.studio) && (
                              <div className="space-y-1">
                                 {item.shoot.photographer && <p className="font-serif italic">By {item.shoot.photographer}</p>}
                                 {item.shoot.studio && <p className="text-[10px] uppercase tracking-widest opacity-80">{item.shoot.studio}</p>}
                              </div>
                           )}
                        </div>
                  </div>
                </div>
             ))}
          </div>
        )}
      </div>

     {/* Lightbox Overlay */}
     {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
           {/* Lightbox Header */}
           <div className="flex justify-between items-center p-8 absolute top-0 left-0 right-0 z-10">
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                {currentImageIndex + 1} / {flattenedImages.length}
              </div>
              <button onClick={() => setLightboxOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                 <X size={24} />
              </button>
           </div>
           
           {/* Main Image */}
           <div className="flex-1 flex items-center justify-center p-4 md:p-12 relative overflow-hidden group">
               <button onClick={prevImage} className="absolute left-4 md:left-12 p-3 bg-white shadow-lg rounded-full hover:scale-110 transition-transform z-20 opacity-0 group-hover:opacity-100 duration-300">
                  <ChevronLeft size={24} />
               </button>
               
               <img 
                 key={currentImageIndex} 
                 src={flattenedImages[currentImageIndex]?.url} 
                 className="max-h-full max-w-full object-contain shadow-2xl animate-in zoom-in-95 duration-300 rounded-sm"
               />

                <button onClick={nextImage} className="absolute right-4 md:right-12 p-3 bg-white shadow-lg rounded-full hover:scale-110 transition-transform z-20 opacity-0 group-hover:opacity-100 duration-300">
                  <ChevronRight size={24} />
               </button>
           </div>
           
           {/* Thumbnail Strip */}
           <div className="h-20 border-t border-zinc-100 flex items-center justify-center gap-2 overflow-x-auto px-8 py-2">
              {flattenedImages.map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative flex-shrink-0 h-12 w-12 rounded-sm overflow-hidden transition-all ${idx === currentImageIndex ? 'ring-2 ring-black scale-110 opacity-100' : 'opacity-30 hover:opacity-100'}`}
                >
                  <img src={item.url} className="w-full h-full object-cover" />
                </button>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

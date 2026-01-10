import React, { useState } from 'react';
import { Shoot } from '@/types';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { LayoutGrid, AppWindow, Eye, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface PortfolioViewProps {
  shoots: Shoot[];
  onBack: () => void;
  onSave: () => void;
}

type Layout = 'grid' | 'masonry';

export const PortfolioView: React.FC<PortfolioViewProps> = ({ shoots, onBack, onSave }) => {
  const [layout, setLayout] = useState<Layout>('grid');
  const [showHero, setShowHero] = useState(true);
  
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [flattenedImages, setFlattenedImages] = useState<string[]>([]);

  // Prepare flattened list for lightbox navigation
  React.useEffect(() => {
    const allImages = shoots.flatMap(s => s.images);
    setFlattenedImages(allImages);
  }, [shoots]);

  const openLightbox = (url: string) => {
    const index = flattenedImages.indexOf(url);
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

  // Select a hero image (first of first shoot, or smart select later)
  const heroImage = shoots.length > 0 && shoots[0].images.length > 0 ? shoots[0].images[0] : null;

  return (
    <div className="max-w-6xl mx-auto py-12 px-8 min-h-screen flex flex-col">
      {/* Controls Header */}
      <div className="flex justify-between items-center mb-12 border-b border-zinc-100 pb-8">
         <div className="flex items-center space-x-4">
            <BrandIcon size={24} />
            <h1 className="font-serif text-2xl tracking-tight">Portfolio</h1>
         </div>
         <div className="flex items-center space-x-6 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <button 
              onClick={() => setShowHero(!showHero)}
              className={`flex items-center space-x-2 hover:text-black transition-colors ${showHero ? 'text-black' : ''}`}
            >
               <AppWindow size={16} /> <span>Hero</span>
            </button>
            <div className="h-4 w-px bg-zinc-200"></div>
            <button 
              onClick={() => setLayout('grid')}
              className={`flex items-center space-x-2 hover:text-black transition-colors ${layout === 'grid' ? 'text-black' : ''}`}
            >
               <LayoutGrid size={16} /> <span>Grid</span>
            </button>
            <button 
              onClick={() => setLayout('masonry')}
              className={`flex items-center space-x-2 hover:text-black transition-colors ${layout === 'masonry' ? 'text-black' : ''}`}
            >
               <Maximize2 size={16} /> <span>Masonry</span>
            </button>
         </div>
      </div>

      {/* Hero Section */}
      {showHero && heroImage && (
        <div className="mb-20 animate-in fade-in duration-700">
           <div className="relative w-full aspect-[21/9] rounded-sm overflow-hidden group cursor-pointer" onClick={() => openLightbox(heroImage)}>
              <img src={heroImage} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              <div className="absolute bottom-8 left-8 text-white drop-shadow-md">
                 <p className="font-serif text-4xl italic">{shoots[0]?.name}</p>
                 <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Featured Collection</p>
              </div>
           </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-24 flex-1">
        {shoots.map(shoot => (
          <div key={shoot.id} className="space-y-8">
            {(!showHero || shoots.indexOf(shoot) !== 0) && (
               <div className="flex items-baseline justify-between border-b border-zinc-100 pb-4">
                  <h3 className="font-serif text-3xl">{shoot.name}</h3>
                  <span className="text-zinc-300 text-[10px] font-bold uppercase tracking-widest">{shoot.images.length} Shots</span>
               </div>
            )}
            
            <div className={`
              ${layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 gap-4' : 'columns-2 md:columns-3 gap-4 space-y-4'}
            `}>
              {shoot.images.map((img, i) => (
                <div 
                  key={i} 
                  className={`
                    group relative overflow-hidden rounded-sm bg-zinc-50 cursor-pointer
                    ${layout === 'grid' ? 'aspect-[3/4]' : 'aspect-auto inline-block w-full'}
                  `}
                  onClick={() => openLightbox(img)}
                >
                  <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                     <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <Eye size={20} className="text-black" />
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="mt-32 flex justify-between items-center pt-8 border-t border-zinc-100">
        <button onClick={onBack} className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
          Back to Editor
        </button>
        <button onClick={onSave} className="bg-black text-white px-10 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-zinc-800 transition-transform hover:scale-105 active:scale-95 shadow-xl">
          Save Portfolio
        </button>
      </div>

      {/* Lightbox Overlay */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
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
           <div className="flex-1 flex items-center justify-center p-4 md:p-12 relative overflow-hidden">
               <button onClick={prevImage} className="absolute left-8 lg:left-12 p-3 bg-white shadow-lg rounded-full hover:scale-110 transition-transform z-20">
                  <ChevronLeft size={24} />
               </button>
               
               <img 
                 key={currentImageIndex} // Key forces re-render for animation
                 src={flattenedImages[currentImageIndex]} 
                 className="max-h-full max-w-full object-contain shadow-2xl animate-in zoom-in-95 duration-300 rounded-sm"
               />

               <button onClick={nextImage} className="absolute right-8 lg:right-12 p-3 bg-white shadow-lg rounded-full hover:scale-110 transition-transform z-20">
                  <ChevronRight size={24} />
               </button>
           </div>
           
           {/* Thumbnails (Optional, simplified for now) */}
           <div className="h-20 border-t border-zinc-100 flex items-center justify-center gap-2 overflow-x-auto px-8 py-2">
              {flattenedImages.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative flex-shrink-0 h-12 w-12 rounded-sm overflow-hidden transition-all ${idx === currentImageIndex ? 'ring-2 ring-black scale-110' : 'opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Shoot, Profile } from '@/types';
import { LayoutGrid, Maximize2, AppWindow, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';

import { TimelineView } from './TimelineView';

export interface PortfolioSettings {
  layout: 'grid' | 'masonry' | 'bento' | 'timeline';
  showHero: boolean;
  groupByCollection: boolean;
  heroStyle?: 'standard' | 'full';
  heroTextOverlay?: boolean;
  heroAnimation?: 'none' | 'zoom';
  showBio?: boolean;
  bioStyle?: 'standard' | 'editorial' | 'split' | 'sticky';
  heroImageUrl?: string;
  highlightedImageUrls?: string[];
  showTimeline?: boolean; // Added for dashboard preference
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
  const [activeOverlayUrl, setActiveOverlayUrl] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  // Update flattened images when shoots or settings change
  useEffect(() => {
    const allImages = shoots.flatMap(s => 
      s.images.filter(url => !s.hiddenImages?.includes(url))
              .map(url => ({ url, shoot: s }))
    );
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

  const handleTouchStart = (url: string) => {
    const timer = setTimeout(() => {
      setActiveOverlayUrl(url);
    }, 500); // 500ms for long press
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    setActiveOverlayUrl(null);
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const renderMetadataOverlay = (shoot?: Shoot, isHero: boolean = false) => {
    if (!shoot) return null;
    return (
      <div className={`absolute inset-0 bg-black/60 transition-all duration-300 flex flex-col justify-between p-6 ${activeOverlayUrl === (isHero ? 'hero' : shoot.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
         <div className="space-y-4 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div className="space-y-1">
               <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40 block">TAGS</span>
               <div className="flex flex-wrap gap-1">
                  {shoot.vibes?.map(v => (
                     <span key={v} className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[8px] font-bold uppercase tracking-widest text-white border border-white/10">
                       {v}
                     </span>
                  ))}
               </div>
            </div>
         </div>

       {/* Center Eye Icon */}
       {!isHero && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg transform scale-50 group-hover:scale-100 transition-all duration-300">
               <Eye size={20} className="text-black" />
            </div>
         </div>
       )}
       <div className="space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {(shoot.photographer || shoot.studio) && (
             <div className="space-y-1">
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40 block">CREDITS</span>
                <div className="text-white text-xs">
                   {shoot.photographer && <p className="font-serif italic">By {shoot.photographer}</p>}
                   {shoot.studio && <p className="text-[10px] uppercase tracking-widest opacity-80">{shoot.studio}</p>}
                </div>
             </div>
          )}
       </div>
    </div>
    );
  };


  // Determine Hero Image
  const heroImage = settings.heroImageUrl || (shoots.length > 0 && shoots[0].images.length > 0 ? shoots[0].images[0] : null);

  return (
    <div className="w-full flex-1 flex flex-col min-h-screen bg-white">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 flex-1 flex flex-col">
        {/* Hero Section */}
        {settings.showHero && heroImage && (
          <div className={`
            animate-in fade-in duration-700 w-full 
            ${settings.heroStyle === 'full' ? 'fixed inset-0 z-0 h-screen' : 'mb-20 pt-12'}
            ${settings.bioStyle === 'split' && settings.heroStyle === 'full' ? 'flex' : ''}
          `}>
             <div 
               className={`
                 relative w-full overflow-hidden group cursor-pointer shadow-sm
                 ${settings.heroStyle === 'full' ? 'h-full rounded-none' : 'aspect-[21/9] rounded-sm'}
               `} 
               onClick={() => heroImage && openLightbox(heroImage)}
               onTouchStart={() => handleTouchStart('hero')}
               onTouchEnd={handleTouchEnd}
               onContextMenu={(e) => e.preventDefault()}
               onMouseLeave={() => setActiveOverlayUrl(null)}
             >
                <img 
                  src={heroImage || undefined} 
                  className={`
                    w-full h-full object-cover transition-transform
                    ${settings.heroAnimation === 'zoom' ? 'scale-105 duration-[10s] animate-ken-burns' : 'duration-[2s] group-hover:scale-105'}
                  `} 
                />
                <div className={`absolute inset-0 transition-colors duration-500 ${settings.heroStyle === 'full' ? 'bg-black/30 group-hover:bg-black/20' : 'bg-black/10 group-hover:bg-transparent'}`} />
                
                {/* Hero Text Overlay */}
                <div className={`
                  absolute text-white drop-shadow-2xl z-10 transition-all duration-700
                  ${settings.heroStyle === 'full' 
                    ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-12' 
                    : 'bottom-6 md:bottom-12 left-6 md:left-12 text-left'}
                  ${settings.heroTextOverlay || settings.heroStyle === 'full' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}>
                   <h1 className={`font-serif tracking-tighter uppercase mb-4 ${settings.heroStyle === 'full' ? 'text-7xl md:text-[12rem] leading-none' : 'text-3xl md:text-5xl italic tracking-tight'}`}>{displayName}</h1>
                   <div className={`space-y-2 ${settings.heroStyle === 'full' ? 'flex flex-col items-center' : ''}`}>
                      <p className="font-serif text-2xl md:text-3xl italic opacity-90">{shoots[0]?.name}</p>
                      <div className="h-0.5 w-12 bg-white/40 rounded-full" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.4em] mt-2 opacity-80">Featured Collection</p>
                   </div>
                </div>

                 {shoots[0] && renderMetadataOverlay(shoots[0], true)}
              </div>

             {/* Split Bio Side (Only for split + full hero) */}
             {settings.bioStyle === 'split' && settings.heroStyle === 'full' && (
                 <div className="w-1/2 h-full bg-white flex flex-col items-center justify-center p-24 text-center animate-in fade-in slide-in-from-top-8 duration-1000">
                     <h1 className="text-6xl md:text-8xl font-serif tracking-tighter uppercase mb-8">{displayName}</h1>
                     <div className="h-px w-24 bg-zinc-200 mb-8" />
                     {profile?.description && (
                         <p className="font-serif italic text-xl md:text-2xl text-zinc-600 leading-relaxed max-w-lg">
                             "{profile?.description}"
                         </p>
                      )}
                 </div>
             )}
          </div>
        )}

        {/* Spacer for Full Hero */}
        {settings.showHero && settings.heroStyle === 'full' && (
          <div className="h-screen w-full flex-shrink-0" />
        )}

        {/* Header */}
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
           <h1 className="text-6xl md:text-9xl font-serif tracking-tighter uppercase">{displayName}</h1>
            {displayInsta && (
               <a href={`https://instagram.com/${displayInsta?.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-block text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
                  {displayInsta?.startsWith('@') ? displayInsta : `@${displayInsta}`}
               </a>
            )}
        </div>

        {/* Professional Bio Section (Standard Style Only) */}
        {settings.showBio && settings.bioStyle === 'standard' && profile?.description && (
          <div className="max-w-2xl mx-auto mb-20 text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000 delay-300">
             <div className="h-px w-12 bg-zinc-200 mx-auto" />
             <p className="font-serif italic text-xl md:text-2xl text-zinc-600 leading-relaxed px-4">
                "{profile?.description}"
             </p>
             <div className="h-px w-12 bg-zinc-200 mx-auto" />
          </div>
        )}

        {/* Content Rendering */}
        <div className={`
             ${settings.bioStyle === 'sticky' ? 'flex flex-col md:flex-row gap-12' : 'space-y-24 flex-1 pb-24'}
        `}>
          
          {/* Sticky Bio Sidebar */}
          {settings.bioStyle === 'sticky' && settings.showBio && (
              <div className="w-full md:w-1/3 text-left space-y-8 md:sticky md:top-32 h-fit mb-12 md:mb-0 animate-in fade-in slide-in-from-top-4 duration-1000">
                  <h2 className="text-4xl md:text-6xl font-serif tracking-tighter uppercase">{displayName}</h2>
                  <div className="w-12 h-px bg-black" />
                  {profile?.description && (
                       <p className="font-serif italic text-lg leading-relaxed text-zinc-600">
                           {profile?.description}
                       </p>
                  )}
                   {displayInsta && (
                      <a href={`https://instagram.com/${displayInsta?.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-block text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors border-b border-transparent hover:border-black">
                          Follow on Instagram
                      </a>
                   )}
              </div>
          )}

          <div className={`${settings.bioStyle === 'sticky' ? 'w-full md:w-2/3 space-y-24 pb-24' : 'w-full'}`}>
          {settings.layout === 'timeline' ? (
              <TimelineView shoots={shoots} onImageClick={openLightbox} />
          ) : settings.groupByCollection ? (
            // GROUPED VIEW: Render each shoot as a distinct section
            shoots.map(shoot => (
              <div key={shoot.id} className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                 {/* Collection Header */}
                 <div className="flex items-baseline justify-between border-b border-zinc-100 pb-4">
                    <h3 className="font-serif text-3xl">{shoot.name}</h3>
                    <span className="text-zinc-300 text-[10px] font-bold uppercase tracking-widest">{shoot.images.filter(url => !shoot.hiddenImages?.includes(url)).length} Shots</span>
                 </div>
                 
                 <div className={`
                    ${settings.layout === 'grid' 
                      ? 'grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center' 
                      : settings.layout === 'masonry'
                      ? `columns-2 ${shoot.images.filter(url => !shoot.hiddenImages?.includes(url)).length > 2 ? 'md:columns-3' : 'md:columns-2'} gap-4 space-y-4 mx-auto`
                      : 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 grid-flow-dense'}
                 `}>
                   {shoot.images.filter(url => !shoot.hiddenImages?.includes(url)).map((img, i) => {
                       const isHighlighted = settings.highlightedImageUrls?.includes(img);
                      let bentoSpan = '';
                      if (settings.layout === 'bento') {
                        if (isHighlighted) {
                          bentoSpan = 'md:col-span-2 md:row-span-2';
                        } else {
                          const pattern = [
                            'md:col-span-2 md:row-span-2',
                            'md:col-span-1 md:row-span-1',
                            'md:col-span-1 md:row-span-2',
                            'md:col-span-2 md:row-span-1',
                            'md:col-span-1 md:row-span-1',
                            'md:col-span-2 md:row-span-2',
                          ];
                          bentoSpan = pattern[i % pattern.length];
                        }
                      }

                      return (
                        <div 
                          key={i} 
                          className={`
                            group relative overflow-hidden rounded-sm bg-zinc-50 cursor-pointer break-inside-avoid
                            ${settings.layout === 'grid' ? (isHighlighted ? 'aspect-[3/4] md:col-span-2 md:row-span-2' : 'aspect-[3/4]') : settings.layout === 'bento' ? `min-h-[250px] ${bentoSpan}` : 'mb-4'}
                          `}
                          onClick={() => openLightbox(img)}
                          onTouchStart={() => handleTouchStart(img)}
                          onTouchEnd={handleTouchEnd}
                          onContextMenu={(e) => e.preventDefault()}
                          onMouseLeave={() => setActiveOverlayUrl(null)}
                        >
                          <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          {renderMetadataOverlay(shoot)}
                        </div>
                      );
                   })}
                 </div>
              </div>
            ))
          ) : (
            // UNGROUPED VIEW
            <div className={`
               ${settings.layout === 'grid' 
                 ? 'grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center' 
                 : settings.layout === 'masonry'
                 ? `columns-2 ${flattenedImages.length > 2 ? 'md:columns-3' : 'md:columns-2'} gap-4 space-y-4 mx-auto`
                 : 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 grid-flow-dense'}
            `}>
               {flattenedImages.map((item, i) => {
                  const isHighlighted = settings.highlightedImageUrls?.includes(item.url);
                  let bentoSpan = '';
                  // ... bento logic ...
                  if (settings.layout === 'bento') {
                    if (isHighlighted) {
                      bentoSpan = 'md:col-span-2 md:row-span-2';
                    } else {
                       // simplified for brevity in replace
                       const pattern = ['md:col-span-2 md:row-span-2', 'md:col-span-2 md:row-span-1', 'md:col-span-1 md:row-span-1', 'md:col-span-1 md:row-span-2', 'md:col-span-2 md:row-span-2', 'md:col-span-1 md:row-span-1'];
                       bentoSpan = pattern[i % pattern.length];
                    }
                  }

                  // Editorial Bio Injection
                  const showEditorialBio = settings.showBio && settings.bioStyle === 'editorial' && i === 1;

                  return (
                    <React.Fragment key={i}>
                        {showEditorialBio && (
                             <div className={`
                                flex flex-col justify-center p-8 bg-black text-white rounded-sm break-inside-avoid animate-in fade-in slide-in-from-top-4 duration-1000
                                ${settings.layout === 'grid' ? 'aspect-[3/4] md:col-span-2 md:row-span-2' : settings.layout === 'bento' ? 'md:col-span-2 md:row-span-2 min-h-[300px]' : 'mb-4 p-8'}
                             `}>
                                 <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">About the Model</span>
                                 <h3 className="font-serif text-3xl md:text-4xl italic leading-tight mb-6">"{profile?.description || 'Determined to create art.'}"</h3>
                                 <div className="w-12 h-px bg-white/20" />
                             </div>
                        )}
                        <div 
                          className={`
                            group relative overflow-hidden rounded-sm bg-zinc-50 cursor-pointer break-inside-avoid animate-in zoom-in-50 duration-500
                            ${settings.layout === 'grid' ? (isHighlighted ? 'aspect-[3/4] md:col-span-2 md:row-span-2' : 'aspect-[3/4]') : settings.layout === 'bento' ? `min-h-[250px] ${bentoSpan}` : 'mb-4'}
                          `}
                          style={{ animationDelay: `${i * 50}ms` }}
                          onClick={() => openLightbox(item.url)}
                          onTouchStart={() => handleTouchStart(item.url)}
                          onTouchEnd={handleTouchEnd}
                          onContextMenu={(e) => e.preventDefault()}
                          onMouseLeave={() => setActiveOverlayUrl(null)}
                        >
                          <img src={item.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          {renderMetadataOverlay(item.shoot)}
                        </div>
                    </React.Fragment>
                  );
               })}
            </div>
          )}
          </div> {/* End Sticky Content Wrapper */}
        </div>
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
           
           {/* Metadata Overlay */}
           <div className="absolute bottom-24 left-0 right-0 p-8 flex justify-center pointer-events-none">
              <div className="bg-black/50 backdrop-blur-md text-white p-6 rounded-2xl max-w-lg text-center space-y-2 pointer-events-auto">
                 <div className="flex flex-wrap gap-2 justify-center mb-2">
                    {flattenedImages[currentImageIndex]?.shoot.vibes?.map(v => (
                       <span key={v} className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                          {v}
                       </span>
                    ))}
                 </div>
                 <h3 className="font-serif text-2xl">{flattenedImages[currentImageIndex]?.shoot.name}</h3>
                 {(flattenedImages[currentImageIndex]?.shoot.photographer || flattenedImages[currentImageIndex]?.shoot.studio) && (
                    <div className="text-xs opacity-80 pt-2 border-t border-white/10 mt-2">
                       {flattenedImages[currentImageIndex]?.shoot.photographer && <p>Photographer: {flattenedImages[currentImageIndex]?.shoot.photographer}</p>}
                       {flattenedImages[currentImageIndex]?.shoot.studio && <p>Studio: {flattenedImages[currentImageIndex]?.shoot.studio}</p>}
                    </div>
                 )}
              </div>
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


import React, { useState } from 'react';
import { Shoot } from '@/types';
import { Calendar, User, Tag, MapPin, Camera, X } from 'lucide-react';

interface TimelineViewProps {
  shoots: Shoot[];
  onImageClick?: (url: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ shoots, onImageClick }) => {
  // Sort shoots by date (descending)
  const sortedShoots = [...shoots].sort((a, b) => {
    return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
  });

  const [expandedShootId, setExpandedShootId] = useState<string | number | null>(null);

  // Helper to format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Unknown Date';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="relative max-w-4xl mx-auto py-12 px-4">
      {/* Central Line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-300 to-transparent md:-translate-x-1/2" />

      <div className="space-y-24">
        {sortedShoots.map((shoot, index) => {
          const isEven = index % 2 === 0;
          const isExpanded = expandedShootId === shoot.id;
          const hasImages = shoot.images.length > 0;

          return (
            <div key={shoot.id} className={`relative flex flex-col md:flex-row gap-8 items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Timeline Node */}
              <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-black border-4 border-white rounded-full shadow-lg md:-translate-x-1/2 z-10 shrink-0 transform -translate-x-1/2 md:translate-x-[-50%]" />

              {/* Date & Info Side */}
              <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-12 text-left md:text-right flex flex-col items-start md:items-end">
                  <div className={`flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                      <Calendar size={12} />
                      <span>{formatDate(shoot.date)}</span>
                  </div>
                  <h3 className="text-2xl font-serif mb-4">{shoot.name}</h3>
                  
                  {/* Credits */}
                  <div className={`space-y-1 text-sm text-zinc-600 flex flex-col items-start md:items-end`}>
                    {shoot.photographer && (
                        <div className="flex items-center gap-2">
                            <Camera size={14} className="text-zinc-400" />
                            <span>{shoot.photographer}</span>
                        </div>
                    )}
                    {shoot.studio && (
                        <div className="flex items-center gap-2">
                             <MapPin size={14} className="text-zinc-400" />
                            <span>{shoot.studio}</span>
                        </div>
                    )}
                  </div>

                  {/* Tags */}
                  {shoot.vibes.length > 0 && (
                      <div className={`flex flex-wrap gap-2 mt-4 justify-start md:justify-end`}>
                          {shoot.vibes.map(tag => (
                              <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-zinc-100 rounded-md text-zinc-500">
                                  #{tag}
                              </span>
                          ))}
                      </div>
                  )}
              </div>

              {/* Collection Stack / Burst View */}
              <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-12">
                 {hasImages ? (
                     <div 
                        className={`relative transition-all duration-500 ease-spring ${isExpanded ? 'h-auto min-h-[400px]' : 'h-64 cursor-pointer group'}`}
                        onClick={() => !isExpanded && setExpandedShootId(shoot.id)}
                     >
                        {isExpanded ? (
                            // Burst Grid View
                            <div className="relative animate-in zoom-in-95 duration-500">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setExpandedShootId(null); }}
                                    className="absolute -top-4 -right-4 z-50 bg-black text-white p-2 rounded-full hover:scale-110 transition-transform shadow-xl"
                                >
                                    <X size={16} />
                                </button>
                                <div className="grid grid-cols-2 gap-4">
                                    {shoot.images.map((img, i) => (
                                        <div 
                                            key={i} 
                                            className="rounded-xl overflow-hidden aspect-[3/4] shadow-md hover:scale-[1.02] transition-transform duration-500 cursor-zoom-in" 
                                            style={{ animationDelay: `${i * 50}ms` }}
                                            onClick={(e) => { e.stopPropagation(); onImageClick?.(img); }}
                                        >
                                            <img src={img} className="w-full h-full object-cover" loading="lazy" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Stack View
                            <div className="relative w-48 h-64 mx-auto md:mx-0">
                                {shoot.images.slice(0, 3).map((img, i) => (
                                    <div 
                                        key={i}
                                        className="absolute inset-0 rounded-xl overflow-hidden shadow-xl border-4 border-white transition-all duration-500 ease-out group-hover:scale-105"
                                        style={{ 
                                            transform: `rotate(${i * 5 - 5}deg) translateY(${i * -5}px)`,
                                            zIndex: 3 - i,
                                            left: i * 8,
                                            top: i * 8
                                        }}
                                    >
                                        <img src={img} className="w-full h-full object-cover" loading="lazy" />
                                        {/* Hover Overlay */}
                                        {i === 0 && (
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="bg-white/90 text-black text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                                    View Collection
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {shoot.images.length > 3 && (
                                    <div 
                                        className="absolute -right-4 -bottom-4 bg-white text-black text-xs font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-20 border border-zinc-100"
                                        style={{ transform: `rotate(10deg)` }}
                                    >
                                        +{shoot.images.length - 3}
                                    </div>
                                )}
                            </div>
                        )}
                     </div>
                 ) : (
                     <div className="w-full h-32 border-2 border-dashed border-zinc-200 rounded-xl flex items-center justify-center text-zinc-300">
                         <span className="text-xs uppercase tracking-widest font-bold">No Images</span>
                     </div>
                 )}
              </div>

            </div>
          );
        })}
      </div>

       <style jsx>{`
        .ease-spring {
            transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

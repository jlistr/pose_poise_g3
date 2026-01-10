import React, { useState } from 'react';
import { Plus, Share2, Copy, FileText, ArrowRight } from 'lucide-react';
import { FrontPlate } from '@/components/card/FrontPlate';
import { BackPlate } from '@/components/card/BackPlate';
import { CardData, ImageItem, Profile } from '@/types';
import { copyToClipboard } from '@/lib/utils';

interface CardPreviewProps {
  cardData: {
    profile: Profile;
    images: ImageItem[];
  };
  currentCardId: string | null;
  onSave: (frontLayout: string, backLayout: string) => void;
  onExport: (frontLayout: string, backLayout: string, format: string) => void;
  onShare: () => void;
}

export const CardPreview: React.FC<CardPreviewProps> = ({ 
  cardData, 
  currentCardId, 
  onSave, 
  onExport, 
  onShare 
}) => {
  const [frontLayout, setFrontLayout] = useState<'classic' | 'modern' | 'minimal'>('classic');
  const [backLayout, setBackLayout] = useState<'grid' | 'masonry' | 'triptych'>('grid');
  const [compCardSide, setCompCardSide] = useState<'front' | 'back'>('front');

  const publicUrl = currentCardId ? `${window.location.origin}?cardId=${currentCardId}` : null;

  return (
    <div className="max-w-7xl mx-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-4 space-y-8 sticky top-12">
        <h2 className="text-4xl font-serif">Deployment</h2>
        <div className="space-y-6">
           <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Front Design</h4>
              <div className="grid grid-cols-3 gap-2">
                 {(['classic', 'modern', 'minimal'] as const).map(l => (
                   <button 
                     key={l} 
                     onClick={() => setFrontLayout(l)} 
                     className={`py-2 rounded-lg border text-[10px] uppercase font-bold tracking-widest transition-all ${frontLayout === l ? 'bg-black text-white' : 'bg-white text-zinc-300'}`}
                   >
                     {l}
                   </button>
                 ))}
              </div>
           </div>
           <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Back Layout</h4>
              <div className="grid grid-cols-3 gap-2">
                 {(['grid', 'masonry', 'triptych'] as const).map(l => (
                   <button 
                     key={l} 
                     onClick={() => setBackLayout(l)} 
                     className={`py-2 rounded-lg border text-[10px] uppercase font-bold tracking-widest transition-all ${backLayout === l ? 'bg-black text-white' : 'bg-white text-zinc-300'}`}
                   >
                     {l}
                   </button>
                 ))}
              </div>
           </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
           <button onClick={() => setCompCardSide('front')} className={`py-3 rounded-xl border text-[10px] font-bold uppercase ${compCardSide === 'front' ? 'bg-black text-white shadow-xl' : 'bg-white text-zinc-400'}`}>View Front</button>
           <button onClick={() => setCompCardSide('back')} className={`py-3 rounded-xl border text-[10px] font-bold uppercase ${compCardSide === 'back' ? 'bg-black text-white shadow-xl' : 'bg-white text-zinc-400'}`}>View Back</button>
        </div>
        <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-[2rem] space-y-4 shadow-inner">
           {!currentCardId ? (
             <button onClick={() => onSave(frontLayout, backLayout)} className="w-full py-4 bg-black text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center space-x-2 shadow-xl">
               <Plus size={16} /> <span>Save Card</span>
             </button>
           ) : (
             <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border flex items-center justify-between overflow-hidden shadow-sm">
                  <span className="text-[10px] font-mono text-zinc-400 truncate">{publicUrl || ""}</span>
                  <button onClick={() => copyToClipboard(publicUrl || "")} className="p-2 hover:bg-zinc-50 rounded-lg"><Copy size={14} /></button>
                </div>
                <button onClick={onShare} className="w-full py-4 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center space-x-2 shadow-xl">
                  <Share2 size={16} /> <span>Share Digital Card</span>
                </button>
             </div>
           )}
        </div>
        <button onClick={() => onExport(frontLayout, backLayout, 'PDF')} className="w-full py-5 bg-black text-white rounded-2xl font-bold text-xs uppercase flex items-center justify-center space-x-2 shadow-2xl hover:bg-zinc-800 transition-all">
          <FileText size={16} /> <span>Export Hi-Res PDF</span>
        </button>
      </div>
      
      <div className="lg:col-span-8 flex justify-center min-h-[900px] bg-zinc-50 p-12 rounded-[3.5rem] border border-zinc-100">
         <div className="relative group perspective">
            <div className={`transition-all duration-1000 preserve-3d ${compCardSide === 'back' ? 'rotate-y-180' : ''}`}>
               <div className={`bg-white shadow-2xl w-[450px] aspect-[5.5/8.5] p-0 flex flex-col border backface-hidden rounded-sm ${compCardSide === 'back' ? 'opacity-0' : 'opacity-100'}`}>
                  <FrontPlate layout={frontLayout} images={cardData.images.map(i => i.url)} profile={cardData.profile} />
               </div>
               <div className={`bg-white shadow-2xl w-[450px] aspect-[5.5/8.5] p-0 absolute top-0 left-0 flex flex-col border backface-hidden rotate-y-180 rounded-sm ${compCardSide === 'front' ? 'opacity-0' : 'opacity-100'}`}>
                  <BackPlate layout={backLayout} images={cardData.images.map(i => i.url)} profile={cardData.profile} />
               </div>
            </div>
         </div>
      </div>
      <style>{`
        .perspective { perspective: 1500px; }
        .preserve-3d { transform-style: preserve-3d; position: relative; height: 100%; width: 100%; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

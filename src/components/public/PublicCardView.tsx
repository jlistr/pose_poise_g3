import React from 'react';
import { FrontPlate } from '@/components/card/FrontPlate';
import { BackPlate } from '@/components/card/BackPlate';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { CardData } from '@/types';

interface PublicCardViewProps {
  card: CardData;
}

export const PublicCardView: React.FC<PublicCardViewProps> = ({ card }) => {
  return (
    <div className="min-h-screen bg-zinc-50 py-16 px-6 flex flex-col items-center space-y-16">
       <div className="flex flex-col items-center space-y-2">
         <BrandIcon size={40} />
         <h1 className="text-2xl font-serif tracking-[0.3em] uppercase">Pose & Poise</h1>
       </div>
       <div className="aspect-[5.5/8.5] h-[85vh] bg-white shadow-2xl relative overflow-hidden animate-in zoom-in-50 duration-500">
        <div className="absolute inset-0 backface-hidden">
           <FrontPlate layout={card.frontLayout} images={card.images} profile={card.profile} />
        </div>
        <div className="absolute inset-0 backface-hidden rotate-y-180" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
           <BackPlate layout={card.backLayout} images={card.images} profile={card.profile} />
        </div>

        {/* Flip Toggle (Mock) */}
        <div className="absolute bottom-4 right-4 z-10">
           <button className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full shadow-lg hover:scale-105 transition-transform"
             onClick={(e) => {
                const parent = e.currentTarget.parentElement?.parentElement;
                if (parent) {
                   parent.style.transition = "transform 0.6s";
                   parent.style.transformStyle = "preserve-3d";
                   const current = parent.style.transform || "";
                   parent.style.transform = current === "rotateY(180deg)" ? "rotateY(0deg)" : "rotateY(180deg)";
                }
             }}
           >
              Flip Card
           </button>
        </div>
      </div>
       <footer className="py-20 text-center opacity-20">
         <BrandIcon size={40} className="mx-auto" />
       </footer>
    </div>
  );
};

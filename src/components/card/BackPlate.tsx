import React from 'react';
import { Profile } from '@/types';

interface BackPlateProps {
  layout: 'grid' | 'masonry' | 'triptych';
  images: string[];
  profile: Profile;
}

export const BackPlate: React.FC<BackPlateProps> = ({ layout, images, profile }) => {
  // Use images 1-4 for the back plate as per logic (images[0] is front)
  // Logic says slice(1, 5)
  const imagesToUse = images; // Calling component should pass the correct slice or full array?
  // Monolith logic: const imagesToUse = cardData.images || []; 
  // And uses imagesToUse.slice(1, 5) inside renderBackPlateUI.
  // I will assume the parent passes ALL images and we slice here to match monolithic logic.
  
  return (
    <div className="h-full flex flex-col p-10 bg-white">
      <h3 className="text-xl font-serif uppercase tracking-widest mb-6 border-b pb-4">Specs Archive</h3>
      <div className="flex-1 overflow-hidden mb-8">
        {layout === 'grid' && (
          <div className="grid grid-cols-2 gap-3 h-full">
            {imagesToUse.slice(1, 5).map((img, i) => (
              <img key={i} src={img || undefined} className="aspect-[3/4] object-cover rounded-sm border border-zinc-100 bg-zinc-50" />
            ))}
          </div>
        )}
        {layout === 'masonry' && (
          <div className="flex gap-3 h-full">
             <div className="flex-1 space-y-3">
                <img src={imagesToUse[1] || undefined} className="w-full aspect-[3/4.5] object-cover rounded-sm bg-zinc-50" />
                <img src={imagesToUse[2] || undefined} className="w-full aspect-[1/1] object-cover rounded-sm bg-zinc-50" />
             </div>
             <div className="flex-1 space-y-3 pt-6">
                <img src={imagesToUse[3] || undefined} className="w-full aspect-[1/1] object-cover rounded-sm bg-zinc-50" />
                <img src={imagesToUse[4] || undefined} className="w-full aspect-[3/4.5] object-cover rounded-sm bg-zinc-50" />
             </div>
          </div>
        )}
        {layout === 'triptych' && (
          <div className="flex gap-3 h-full">
             <div className="w-1/3 flex flex-col gap-2">
                <img src={imagesToUse[1] || undefined} className="flex-1 object-cover rounded-sm bg-zinc-50" />
                <img src={imagesToUse[2] || undefined} className="flex-1 object-cover rounded-sm bg-zinc-50" />
                <img src={imagesToUse[3] || undefined} className="flex-1 object-cover rounded-sm bg-zinc-50" />
             </div>
             <div className="flex-1">
                <img src={imagesToUse[4] || imagesToUse[0] || undefined} className="w-full h-full object-cover rounded-sm bg-zinc-50" />
             </div>
          </div>
        )}
      </div>
      <div className="space-y-6 pt-6 border-t border-zinc-100">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-400">
           <div className="flex justify-between border-b pb-1"><span>Height</span><span className="text-black">{profile.height}</span></div>
           <div className="flex justify-between border-b pb-1"><span>Bust</span><span className="text-black">{profile.bust}</span></div>
           <div className="flex justify-between border-b pb-1"><span>Waist</span><span className="text-black">{profile.waist}</span></div>
           <div className="flex justify-between border-b pb-1"><span>Hips</span><span className="text-black">{profile.hips}</span></div>
           <div className="flex justify-between border-b pb-1"><span>Shoe</span><span className="text-black">{profile.shoeSize}</span></div>
           <div className="flex justify-between border-b pb-1"><span>Hair</span><span className="text-black">{profile.hairColor}</span></div>
           <div className="col-span-2 flex justify-between border-b pb-1"><span>Eyes</span><span className="text-black">{profile.eyeColor}</span></div>
        </div>
      </div>
    </div>
  );
};

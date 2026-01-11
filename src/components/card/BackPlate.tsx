import React from 'react';
import { Profile } from '@/types';

interface BackPlateProps {
  layout: 'grid' | 'masonry' | 'triptych' | 'agency' | 'focus' | 'band' | 'quad';
  images: string[];
  profile: Profile;
  isPublic?: boolean;
  email?: string;
}

export const BackPlate: React.FC<BackPlateProps> = ({ layout, images, profile, isPublic = false, email = "contact@posepoise.studio" }) => {
  // Use images 1-4 for the back plate as per logic (images[0] is front)
  // Logic says slice(1, 5)
  const imagesToUse = images; // Calling component should pass the correct slice or full array?
  // Monolith logic: const imagesToUse = cardData.images || []; 
  // And uses imagesToUse.slice(1, 5) inside renderBackPlateUI.
  // I will assume the parent passes ALL images and we slice here to match monolithic logic.
  
  return (
    <div className="h-full flex flex-col p-10 bg-white" style={{ backgroundColor: '#ffffff' }}>
      <h3 className="text-[10px] font-serif uppercase tracking-widest mb-6 border-b pb-4 text-center px-8" style={{ color: '#000000', borderColor: '#f4f4f5' }}>
        {isPublic 
            ? (profile.name ? `${profile.name.toLowerCase().replace(/\s+/g, '')}.posepoise.studio` : 'posepoise.studio')
            : (email || 'contact@posepoise.studio')
        }
      </h3>
      <div className="flex-1 overflow-hidden mb-8">
        {layout === 'grid' && (
          <div className="grid grid-cols-2 gap-3 h-full min-h-0">
            {imagesToUse.slice(1, 5).map((img, i) => (
              <div key={i} className="relative h-full w-full overflow-hidden rounded-sm border bg-zinc-50" style={{ backgroundColor: '#fafafa', borderColor: '#f4f4f5' }}>
                 <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${img})` }}
                 />
              </div>
            ))}
          </div>
        )}
        {layout === 'masonry' && (
          <div className="flex gap-3 h-full min-h-0">
             <div className="flex-1 flex flex-col gap-3 min-h-0">
                <div className="flex-[3] relative overflow-hidden rounded-sm bg-zinc-50" style={{ backgroundColor: '#fafafa' }}>
                    <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagesToUse[1]})` }} />
                </div>
                <div className="flex-[2] relative overflow-hidden rounded-sm bg-zinc-50" style={{ backgroundColor: '#fafafa' }}>
                    <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagesToUse[2]})` }} />
                </div>
             </div>
             <div className="flex-1 flex flex-col gap-3 min-h-0 pt-6">
                <div className="flex-[2] relative overflow-hidden rounded-sm bg-zinc-50" style={{ backgroundColor: '#fafafa' }}>
                     <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagesToUse[3]})` }} />
                </div>
                <div className="flex-[3] relative overflow-hidden rounded-sm bg-zinc-50" style={{ backgroundColor: '#fafafa' }}>
                     <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagesToUse[4]})` }} />
                </div>
             </div>
          </div>
        )}
        {layout === 'triptych' && (
          <div className="flex gap-3 h-full">
             <div className="w-1/3 flex flex-col gap-2">
                <div className="flex-1 relative overflow-hidden rounded-sm bg-zinc-50" style={{ backgroundColor: '#fafafa' }}>
                    <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagesToUse[1]})` }} />
                </div>
                <div className="flex-1 relative overflow-hidden rounded-sm bg-zinc-50" style={{ backgroundColor: '#fafafa' }}>
                    <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagesToUse[2]})` }} />
                </div>
                <div className="flex-1 relative overflow-hidden rounded-sm bg-zinc-50" style={{ backgroundColor: '#fafafa' }}>
                    <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagesToUse[3]})` }} />
                </div>
             </div>
             <div className="flex-1 relative overflow-hidden rounded-sm bg-zinc-50" style={{ backgroundColor: '#fafafa' }}>
                <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagesToUse[4] || imagesToUse[0]})` }} />
             </div>
          </div>
        )}
        {layout === 'agency' && (
            <div className="flex gap-3 h-full">
                <div className="w-1/2 relative overflow-hidden rounded-sm bg-zinc-50" style={{ backgroundColor: '#fafafa' }}>
                    <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagesToUse[1]})` }} />
                </div>
                <div className="w-1/2 grid grid-cols-2 gap-2">
                   {[2, 3, 4, 5].map(idx => (
                       <div key={idx} className="relative overflow-hidden rounded-sm bg-zinc-50" style={{ backgroundColor: '#fafafa' }}>
                            <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagesToUse[idx]})` }} />
                       </div>
                   ))}
                </div>
            </div>
        )}
        {layout === 'focus' && (
            <div className="grid grid-rows-2 gap-3 h-full">
                <div className="grid grid-cols-3 gap-3 h-full">
                    <div className="col-span-2 relative overflow-hidden rounded-sm bg-zinc-50" style={{ backgroundColor: '#fafafa' }}>
                         <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagesToUse[1]})` }} />
                    </div>
                    <div className="col-span-1 relative overflow-hidden rounded-sm bg-zinc-50" style={{ backgroundColor: '#fafafa' }}>
                         <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagesToUse[2]})` }} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 h-full">
                    <div className="relative overflow-hidden rounded-sm bg-zinc-50" style={{ backgroundColor: '#fafafa' }}>
                         <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagesToUse[3]})` }} />
                    </div>
                    <div className="relative overflow-hidden rounded-sm bg-zinc-50" style={{ backgroundColor: '#fafafa' }}>
                         <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagesToUse[4]})` }} />
                    </div>
                </div>
            </div>
        )}
        {layout === 'quad' && (
             <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
                  {[1, 2, 3, 4].map(idx => (
                      <div key={idx} className="relative overflow-hidden rounded-sm bg-zinc-50" style={{ backgroundColor: '#fafafa' }}>
                          <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagesToUse[idx]})` }} />
                      </div>
                  ))}
             </div>
        )}
        {layout === 'band' && (
             <div className="flex flex-col h-full">
                 <div className="flex-1 grid grid-cols-2 gap-2 mb-2">
                    <div className="relative overflow-hidden rounded-sm bg-zinc-50" style={{ backgroundColor: '#fafafa' }}>
                          <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagesToUse[1]})` }} />
                    </div>
                    <div className="relative overflow-hidden rounded-sm bg-zinc-50" style={{ backgroundColor: '#fafafa' }}>
                          <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagesToUse[2]})` }} />
                    </div>
                 </div>
                 <div className="py-2 bg-black text-white text-center font-serif text-xl uppercase tracking-widest my-2" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
                     {profile.name}
                 </div>
                 <div className="flex-1 grid grid-cols-2 gap-2 mt-2">
                    <div className="relative overflow-hidden rounded-sm bg-zinc-50" style={{ backgroundColor: '#fafafa' }}>
                          <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagesToUse[3]})` }} />
                    </div>
                    <div className="relative overflow-hidden rounded-sm bg-zinc-50" style={{ backgroundColor: '#fafafa' }}>
                          <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imagesToUse[4]})` }} />
                    </div>
                 </div>
             </div>
        )}
      </div>
      <div className="space-y-6 pt-6 border-t border-zinc-100" style={{ borderColor: '#f4f4f5' }}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-400" style={{ color: '#a1a1aa' }}>
           <div className="flex justify-between border-b pb-1" style={{ borderColor: '#f4f4f5' }}><span>Height</span><span className="text-black" style={{ color: '#000000' }}>{profile.height}</span></div>
           <div className="flex justify-between border-b pb-1" style={{ borderColor: '#f4f4f5' }}><span>Bust</span><span className="text-black" style={{ color: '#000000' }}>{profile.bust}</span></div>
           <div className="flex justify-between border-b pb-1" style={{ borderColor: '#f4f4f5' }}><span>Waist</span><span className="text-black" style={{ color: '#000000' }}>{profile.waist}</span></div>
           <div className="flex justify-between border-b pb-1" style={{ borderColor: '#f4f4f5' }}><span>Hips</span><span className="text-black" style={{ color: '#000000' }}>{profile.hips}</span></div>
           <div className="flex justify-between border-b pb-1" style={{ borderColor: '#f4f4f5' }}><span>Shoe</span><span className="text-black" style={{ color: '#000000' }}>{profile.shoeSize}</span></div>
           <div className="flex justify-between border-b pb-1" style={{ borderColor: '#f4f4f5' }}><span>Hair</span><span className="text-black" style={{ color: '#000000' }}>{profile.hairColor}</span></div>
           <div className="col-span-2 flex justify-between border-b pb-1" style={{ borderColor: '#f4f4f5' }}><span>Eyes</span><span className="text-black" style={{ color: '#000000' }}>{profile.eyeColor}</span></div>
        </div>
      </div>
    </div>
  );
};

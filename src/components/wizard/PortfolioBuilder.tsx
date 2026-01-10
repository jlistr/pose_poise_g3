import React from 'react';
import { Plus, X, Edit2, Instagram, Camera, MapPin, Sparkles } from 'lucide-react';
import { Shoot } from '@/types';

interface PortfolioBuilderProps {
  shoots: Shoot[];
  onAddShoot: () => void;
  onShootUpload: (shootId: string | number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateShootName: (shootId: string | number, name: string) => void;
  onUpdateShootMeta: (shootId: string | number, field: keyof Shoot, value: string) => void;
  onRemoveImage: (shootId: string | number, imageIndex: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PortfolioBuilder: React.FC<PortfolioBuilderProps> = ({ 
  shoots, 
  onAddShoot, 
  onShootUpload, 
  onUpdateShootName,
  onUpdateShootMeta,
  onRemoveImage,
  onNext, 
  onBack 
}) => {
  return (
    <div className="max-w-5xl mx-auto py-8 animate-in slide-in-from-bottom-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif mb-2">Portfolio Curation</h2>
        <p className="text-zinc-400 uppercase tracking-widest text-xs">Organize your shoots & credits</p>
      </div>
      <div className="space-y-12">
        {shoots.map(s => (
          <div key={s.id} className="bg-white border border-zinc-100 p-8 rounded-[2rem] shadow-sm group">
            {/* Header / Title */}
            <div className="mb-6 flex items-center space-x-4">
               <div className="flex-1 relative">
                  <input 
                    value={s.name}
                    onChange={(e) => onUpdateShootName(s.id, e.target.value)}
                    className="w-full font-serif text-2xl border-b border-transparent hover:border-zinc-200 focus:border-black focus:outline-none bg-transparent transition-colors py-1 placeholder-zinc-300"
                    placeholder="Collection Name"
                  />
                  <Edit2 size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 pointer-events-none" />
               </div>
               <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">{s.images.length} Assets</span>
            </div>

            {/* Metadata Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-zinc-50/50 p-6 rounded-xl">
               {/* Vibe */}
               <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                     <Sparkles size={10} /> Vibe / Tag
                  </label>
                  <input 
                     value={s.vibe || ''}
                     onChange={(e) => onUpdateShootMeta(s.id, 'vibe', e.target.value)}
                     className="bg-transparent border-b border-zinc-200 focus:border-black outline-none text-xs py-1"
                     placeholder="e.g. Editorial, Noir..."
                  />
               </div>

               {/* Photographer */}
               <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                     <Camera size={10} /> Photographer
                  </label>
                  <div className="flex space-x-2">
                     <input 
                        value={s.photographer || ''}
                        onChange={(e) => onUpdateShootMeta(s.id, 'photographer', e.target.value)}
                        className="flex-1 bg-transparent border-b border-zinc-200 focus:border-black outline-none text-xs py-1"
                        placeholder="Name"
                     />
                     <div className="relative w-1/3">
                        <Instagram size={10} className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-300" />
                        <input 
                           value={s.photographerUrl || ''}
                           onChange={(e) => onUpdateShootMeta(s.id, 'photographerUrl', e.target.value)}
                           className="w-full pl-4 bg-transparent border-b border-zinc-200 focus:border-black outline-none text-xs py-1"
                           placeholder="Handle"
                        />
                     </div>
                  </div>
               </div>

               {/* Studio */}
               <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                     <MapPin size={10} /> Studio / Location
                  </label>
                  <div className="flex space-x-2">
                     <input 
                        value={s.studio || ''}
                        onChange={(e) => onUpdateShootMeta(s.id, 'studio', e.target.value)}
                        className="flex-1 bg-transparent border-b border-zinc-200 focus:border-black outline-none text-xs py-1"
                        placeholder="Name"
                     />
                     <div className="relative w-1/3">
                        <Instagram size={10} className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-300" />
                        <input 
                           value={s.studioUrl || ''}
                           onChange={(e) => onUpdateShootMeta(s.id, 'studioUrl', e.target.value)}
                           className="w-full pl-4 bg-transparent border-b border-zinc-200 focus:border-black outline-none text-xs py-1"
                           placeholder="Handle"
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {s.images.map((img, i) => (
                <div key={i} className="relative group/img aspect-[3/4] rounded-xl overflow-hidden">
                   <img src={img} className="w-full h-full object-cover shadow-sm" />
                   <button 
                     onClick={() => onRemoveImage(s.id, i)}
                     className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-zinc-400 hover:text-white hover:bg-red-500 transition-all opacity-0 group-hover/img:opacity-100"
                   >
                     <X size={14} />
                   </button>
                </div>
              ))}
              <label className="aspect-[3/4] border-2 border-dashed border-zinc-100 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-zinc-300 hover:bg-zinc-50 transition-all">
                <Plus className="text-zinc-300 mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Add Image</span>
                <input type="file" multiple className="hidden" onChange={(e) => onShootUpload(s.id, e)} />
              </label>
            </div>
          </div>
        ))}
        
        <button 
          onClick={onAddShoot} 
          className="w-full py-8 border-2 border-dashed border-zinc-100 rounded-3xl text-zinc-300 font-bold uppercase tracking-widest hover:border-zinc-800 hover:text-zinc-800 transition-all"
        >
          + Add Photoshoot Set
        </button>
      </div>
      
      <div className="mt-12 flex justify-between pt-8 border-t border-zinc-50">
        <button onClick={onBack} className="text-zinc-400 hover:text-black font-bold uppercase text-[10px] tracking-widest">Back</button>
        <button onClick={onNext} className="px-10 py-4 bg-black text-white rounded-full font-bold uppercase text-xs tracking-widest shadow-xl hover:scale-105 transition-transform">
           Process Portfolio
        </button>
      </div>
    </div>
  );
};

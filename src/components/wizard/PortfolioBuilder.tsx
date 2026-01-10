import React, { useState } from 'react';
import { Plus, X, Edit2, Sparkles, Tag } from 'lucide-react';
import { Shoot, ImageItem } from '@/types';
import { MetadataUploadModal } from '@/components/ui/MetadataUploadModal';

interface PortfolioBuilderProps {
  shoots: Shoot[];
  onAddShoot: () => void;
  onShootUpload: (shootId: string | number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateShootName: (shootId: string | number, name: string) => void;
  // onUpdateShootMeta replaced by batch update
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
  const [editingShootId, setEditingShootId] = useState<string | number | null>(null);

  const getShootToEdit = () => shoots.find(s => s.id === editingShootId);

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
            <div className="mb-8 flex items-center justify-between">
               <div className="flex-1 relative mr-4">
                  <input 
                    value={s.name}
                    onChange={(e) => onUpdateShootName(s.id, e.target.value)}
                    className="w-full font-serif text-2xl border-b border-transparent hover:border-zinc-200 focus:border-black focus:outline-none bg-transparent transition-colors py-1 placeholder-zinc-300"
                    placeholder="Collection Name"
                  />
                  <Edit2 size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 pointer-events-none" />
               </div>
               
               <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setEditingShootId(s.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-zinc-50 hover:bg-zinc-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors"
                  >
                     <Tag size={12} />
                     <span>Edit Credits</span>
                  </button>
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">{s.images.length} Assets</span>
               </div>
            </div>

            {/* Display Metadata Summary (Use consolidated display instead of inputs) */}
            {(s.vibe || s.photographer || s.studio) && (
               <div className="flex flex-wrap gap-4 mb-6 text-xs text-zinc-400">
                  {s.vibe && (
                     <div className="flex items-center gap-1 bg-zinc-50 px-3 py-1 rounded-full">
                        <Sparkles size={10} /> <span className="uppercase tracking-wider font-bold">{s.vibe}</span>
                     </div>
                  )}
                  {s.photographer && (
                     <div className="flex items-center gap-1">
                        <span>📸 {s.photographer}</span>
                     </div>
                  )}
                  {s.studio && (
                     <div className="flex items-center gap-1">
                        <span>📍 {s.studio}</span>
                     </div>
                  )}
               </div>
            )}

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

      {editingShootId && getShootToEdit() && (
        <MetadataUploadModal
           files={[]} // No new files
           imageUrls={getShootToEdit()!.images}
           initialData={{
              vibe: getShootToEdit()!.vibe,
              photographer: getShootToEdit()!.photographer,
              photographerUrl: getShootToEdit()!.photographerUrl,
              studio: getShootToEdit()!.studio,
              studioUrl: getShootToEdit()!.studioUrl,
           }}
           onConfirm={(meta) => {
              const sId = editingShootId;
              // Batch update parent
              if (meta.vibe !== undefined) onUpdateShootMeta(sId, 'vibe', meta.vibe);
              if (meta.photographer !== undefined) onUpdateShootMeta(sId, 'photographer', meta.photographer);
              if (meta.photographerUrl !== undefined) onUpdateShootMeta(sId, 'photographerUrl', meta.photographerUrl);
              if (meta.studio !== undefined) onUpdateShootMeta(sId, 'studio', meta.studio);
              if (meta.studioUrl !== undefined) onUpdateShootMeta(sId, 'studioUrl', meta.studioUrl);
              setEditingShootId(null);
           }}
           onCancel={() => setEditingShootId(null)}
        />
      )}
    </div>
  );
};

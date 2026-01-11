import React, { useState } from 'react';
import { Plus, X, Edit2, Sparkles, Tag, Eye, EyeOff, Check, Image as ImageIcon, Maximize2 } from 'lucide-react';
import { Shoot, ImageItem } from '@/types';
import { MetadataUploadModal } from '@/components/ui/MetadataUploadModal';

interface PortfolioBuilderProps {
  shoots: Shoot[];
  onAddShoot: () => void;
  onShootUpload: (shootId: string | number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateShootName: (shootId: string | number, name: string) => void;
  // onUpdateShootMeta replaced by batch update
  onUpdateShootMeta: (shootId: string | number, field: keyof Shoot, value: string | string[]) => void; 
  onRemoveImage: (shootId: string | number, imageIndex: number) => void;
  onToggleVisibility?: (shootId: string | number, url: string) => void;
  library: ImageItem[];
  onAddImagesToShoot: (shootId: string | number, imageUrls: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  highlightedImageUrls?: string[];
  onToggleHighlight?: (url: string) => void;
  onOpenAI?: () => void;
}

export const PortfolioBuilder: React.FC<PortfolioBuilderProps> = ({ 
  shoots, 
  onAddShoot, 
  onShootUpload, 
  onUpdateShootName,
  onUpdateShootMeta,
  onRemoveImage,
  onToggleVisibility,
  library,
  onAddImagesToShoot,
  onNext, 
  onBack,
  highlightedImageUrls = [],
  onToggleHighlight,
  onOpenAI
}) => {
  const [editingShootId, setEditingShootId] = useState<string | number | null>(null);
  const [selectedLibraryImages, setSelectedLibraryImages] = useState<string[]>([]);

  const getShootToEdit = () => shoots.find(s => s.id === editingShootId);

  const toggleLibrarySelection = (url: string) => {
    setSelectedLibraryImages(prev => 
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  const handleAddToShoot = (shootId: string | number) => {
    onAddImagesToShoot(shootId, selectedLibraryImages);
    setSelectedLibraryImages([]);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in slide-in-from-bottom-4">
      <div className="text-center mb-12 relative">
        <h2 className="text-4xl font-serif mb-2">Portfolio Curation</h2>
        <p className="text-zinc-400 uppercase tracking-widest text-xs">Organize your shoots & credits</p>
        
        {onOpenAI && (
           <div className="absolute top-0 right-0">
              <button 
                onClick={onOpenAI}
                className="flex items-center space-x-2 text-[10px] font-bold uppercase px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-400 rounded-full hover:from-indigo-500/20 hover:to-purple-500/20 transition-all shadow-sm"
              >
                <Sparkles size={14} /> <span>Curate with AI</span>
              </button>
           </div>
        )}
      </div>

      {/* Quick Add Library */}
      <div className="mb-12">
         <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
               <ImageIcon size={14} /> Quick Add from Library
            </h3>
            {selectedLibraryImages.length > 0 && (
               <span className="text-xs text-black font-bold bg-zinc-100 px-3 py-1 rounded-full animate-in fade-in">
                  {selectedLibraryImages.length} Selected
               </span>
            )}
         </div>
         <div className="bg-zinc-50/50 border border-zinc-100 rounded-3xl p-6 overflow-x-auto">
             <div className="flex space-x-4 min-w-max">
                {library.map((img) => {
                  const isSelected = selectedLibraryImages.includes(img.url);
                  return (
                    <div 
                      key={img.id} 
                      onClick={() => toggleLibrarySelection(img.url)}
                      className={`relative w-32 aspect-[3/4] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group
                         ${isSelected ? 'ring-4 ring-black scale-95 shadow-lg' : 'hover:scale-105 hover:shadow-md'}
                      `}
                    >
                       <img src={img.url} className="w-full h-full object-cover" />
                       {isSelected && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                             <div className="bg-black text-white p-1 rounded-full shadow-sm"><Check size={16} /></div>
                          </div>
                       )}
                    </div>
                  );
                })}
                {library.length === 0 && (
                   <div className="w-full py-8 text-center text-zinc-400 italic text-sm">
                      No images in library. Upload some below!
                   </div>
                )}
             </div>
         </div>
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
                  {selectedLibraryImages.length > 0 ? (
                      <button 
                        onClick={() => handleAddToShoot(s.id)}
                        className="bg-black text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-lg animate-in fade-in"
                      >
                         <Plus size={12} /> Add {selectedLibraryImages.length} Assets
                      </button>
                  ) : (
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">{s.images.length} Assets</span>
                  )}
               </div>
            </div>

            {((s.vibes && s.vibes.length > 0) || s.photographer || s.studio) && (
               <div className="flex flex-wrap gap-4 mb-6 text-xs text-zinc-400">
                  {s.vibes && s.vibes.length > 0 && (
                     <div className="flex flex-wrap gap-2">
                        {s.vibes.map(v => (
                           <div key={v} className="flex items-center gap-1 bg-zinc-50 px-3 py-1 rounded-full">
                              <Sparkles size={10} /> <span className="uppercase tracking-wider font-bold">{v}</span>
                           </div>
                        ))}
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
              {s.images.map((img, i) => {
                const isHidden = s.hiddenImages?.includes(img);
                return (
                  <div key={i} className={`relative group/img aspect-[3/4] rounded-xl overflow-hidden transition-opacity ${isHidden ? 'opacity-40' : 'opacity-100'}`}>
                     <img src={img} className="w-full h-full object-cover shadow-sm" />
                     
                     <div className="absolute top-2 right-2 flex space-x-2 transition-all opacity-0 group-hover/img:opacity-100 items-center">
                        {onToggleHighlight && (
                           <button 
                             onClick={() => onToggleHighlight(img)}
                             className={`p-1.5 rounded-full transition-all ${highlightedImageUrls.includes(img) ? 'bg-indigo-500 text-white' : 'bg-white/90 text-zinc-400 hover:text-indigo-500'}`}
                             title="Highlight / Maximize Size"
                           >
                             <Maximize2 size={12} />
                           </button>
                        )}
                        <button 
                          onClick={() => onToggleVisibility?.(s.id, img)}
                          className={`p-1.5 bg-white/90 rounded-full ${isHidden ? 'text-zinc-400' : 'text-zinc-600'} hover:text-black transition-all`}
                          title={isHidden ? "Show in Live View" : "Hide from Live View"}
                        >
                          {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button 
                          onClick={() => onRemoveImage(s.id, i)}
                          className="p-1.5 bg-white/90 rounded-full text-zinc-400 hover:text-white hover:bg-red-500 transition-all"
                        >
                          <X size={14} />
                        </button>
                     </div>
                  </div>
                );
              })}
              <label className="aspect-[3/4] border-2 border-dashed border-zinc-100 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-zinc-300 hover:bg-zinc-50 transition-all w-full">
                <Plus className="text-zinc-300 mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Add Image</span>
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  onChange={(e) => onShootUpload(s.id, e)} 
                />
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
              vibes: getShootToEdit()!.vibes,
              photographer: getShootToEdit()!.photographer,
              photographerUrl: getShootToEdit()!.photographerUrl,
              studio: getShootToEdit()!.studio,
              studioUrl: getShootToEdit()!.studioUrl,
           }}
           onConfirm={(meta) => {
              const sId = editingShootId;
              // Batch update parent
              if (meta.vibes !== undefined) onUpdateShootMeta(sId, 'vibes', meta.vibes);
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

import React, { useState } from 'react';
import { X, Sparkles, Camera, MapPin, Instagram } from 'lucide-react';
import { ImageItem } from '@/types';
import { VIBE_TAGS } from '@/constants';

interface MetadataUploadModalProps {
  files?: File[];
  imageUrls?: string[]; // For editing existing
  initialData?: Partial<ImageItem>; 
  onConfirm: (metadata: Partial<ImageItem>) => void;
  onCancel: () => void;
}

export const MetadataUploadModal: React.FC<MetadataUploadModalProps> = ({ 
  files = [], 
  imageUrls = [], 
  initialData = {}, 
  onConfirm, 
  onCancel 
}) => {
  const [vibes, setVibes] = useState<string[]>(initialData.vibes || []);
  const [customTag, setCustomTag] = useState('');
  const [photographer, setPhotographer] = useState(initialData.photographer || '');
  const [photographerUrl, setPhotographerUrl] = useState(initialData.photographerUrl || '');
  const [studio, setStudio] = useState(initialData.studio || '');
  const [studioUrl, setStudioUrl] = useState(initialData.studioUrl || '');

  const count = files.length + imageUrls.length;

  const toggleVibe = (tag: string) => {
    setVibes(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const addCustomTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customTag.trim()) {
      e.preventDefault();
      if (!vibes.includes(customTag.trim())) {
        setVibes(prev => [...prev, customTag.trim()]);
      }
      setCustomTag('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      vibes,
      photographer,
      photographerUrl,
      studio,
      studioUrl
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8">
        <div className="p-8 border-b border-zinc-50 flex justify-between items-center">
           <div>
             <h3 className="font-serif text-2xl">
               {files.length > 0 ? 'Add Credits' : 'Edit Credits'}
             </h3>
             <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">
                Applying to {count} selected {count === 1 ? 'image' : 'images'}
             </p>
           </div>
           <button onClick={onCancel} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           {/* Thumbnails Preview */}
           <div className="flex -space-x-2 overflow-hidden py-2">
              {files.slice(0, 5).map((f, i) => (
                 <div key={`file-${i}`} className="w-12 h-12 rounded-full border-2 border-white shadow-md bg-zinc-100 overflow-hidden relative">
                    <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" />
                 </div>
              ))}
              {imageUrls.slice(0, 5).map((url, i) => (
                 <div key={`url-${i}`} className="w-12 h-12 rounded-full border-2 border-white shadow-md bg-zinc-100 overflow-hidden relative">
                    <img src={url} className="w-full h-full object-cover" />
                 </div>
              ))}
              
              {count > 5 && (
                 <div className="w-12 h-12 rounded-full border-2 border-white shadow-md bg-zinc-900 flex items-center justify-center text-white text-[10px] font-bold">
                    +{count - 5}
                 </div>
              )}
           </div>

            {/* Vibes */}
            <div className="space-y-3">
               <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <Sparkles size={12} /> Vibe / Tags
               </label>
               <div className="flex flex-wrap gap-2">
                  {VIBE_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleVibe(tag)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                        vibes.includes(tag)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-zinc-400 border-zinc-200 hover:border-black hover:text-black'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}

                  {/* Custom Tags that aren't in VIBE_TAGS */}
                  {vibes.filter(v => !VIBE_TAGS.includes(v)).map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleVibe(tag)}
                      className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-zinc-900 text-white border-zinc-900 group"
                    >
                      {tag} <X size={10} className="inline ml-1 opacity-50 group-hover:opacity-100" />
                    </button>
                  ))}
               </div>

               {/* Custom Tag Input */}
               <div className="mt-4">
                  <input 
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={addCustomTag}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 placeholder:text-zinc-300"
                    placeholder="Type custom tag + Enter..."
                  />
               </div>
            </div>

           {/* Photographer */}
           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                 <Camera size={12} /> Photographer
              </label>
              <div className="grid grid-cols-2 gap-4">
                 <input 
                    value={photographer}
                    onChange={(e) => setPhotographer(e.target.value)}
                    className="bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                    placeholder="Name"
                 />
                 <div className="relative">
                    <Instagram size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300" />
                    <input 
                       value={photographerUrl}
                       onChange={(e) => setPhotographerUrl(e.target.value)}
                       className="w-full bg-zinc-50 border border-zinc-100 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                       placeholder="Handle"
                    />
                 </div>
              </div>
           </div>

           {/* Studio */}
           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                 <MapPin size={12} /> Studio / Location
              </label>
              <div className="grid grid-cols-2 gap-4">
                 <input 
                    value={studio}
                    onChange={(e) => setStudio(e.target.value)}
                    className="bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                    placeholder="Name"
                 />
                 <div className="relative">
                    <Instagram size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300" />
                    <input 
                       value={studioUrl}
                       onChange={(e) => setStudioUrl(e.target.value)}
                       className="w-full bg-zinc-50 border border-zinc-100 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                       placeholder="Handle"
                    />
                 </div>
              </div>
           </div>
        
           <div className="pt-4">
              <button 
                 type="submit"
                 className="w-full bg-black text-white font-bold uppercase tracking-widest py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
              >
                 {files.length > 0 ? 'Upload & Save Credits' : 'Update Credits'}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

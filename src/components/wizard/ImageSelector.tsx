import React, { useState } from 'react';
import { Upload, Trash2, CheckCircle, AlertOctagon, X, Ban } from 'lucide-react';
import { toast } from "sonner";
import { ImageItem } from '@/types';
import { ImageWithOverlay } from '@/components/ui/ImageWithOverlay';

interface ImageSelectorProps {
  library: ImageItem[];
  selectedImages: ImageItem[];
  onToggleImage: (img: ImageItem) => void;
  onRemoveSelected: (id: string | number) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onBack: () => void;
  onDeleteImages?: (ids: string[]) => Promise<void>;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({ 
  library, 
  selectedImages, 
  onToggleImage, 
  onRemoveSelected, 
  onFileUpload, 
  onNext, 
  onBack,
  onDeleteImages
}) => {
  const [isPruning, setIsPruning] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const toggleImageForDeletion = (id: string) => {
    if (imagesToDelete.includes(id)) {
      setImagesToDelete(imagesToDelete.filter(i => i !== id));
    } else {
      setImagesToDelete([...imagesToDelete, id]);
    }
  };

  const handleBatchDelete = async () => {
     if (!onDeleteImages) return;
     try {
       await onDeleteImages(imagesToDelete);
       setImagesToDelete([]);
       setIsConfirmingDelete(false);
       setIsPruning(false);
     } catch (err) {
       console.error(err);
     }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in slide-in-from-bottom-4 space-y-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-serif mb-2">Card Curation</h2>
          <p className="text-zinc-500">Select images for your composite card.</p>
        </div>
        {onDeleteImages && (
           <button 
             onClick={() => { setIsPruning(!isPruning); setImagesToDelete([]); setIsConfirmingDelete(false); }}
             className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all
               ${isPruning ? 'bg-zinc-100 text-zinc-900 ring-2 ring-black' : 'bg-transparent text-zinc-400 hover:bg-zinc-50 hover:text-black'}
             `}
           >
             {isPruning ? <X size={14} /> : <Trash2 size={14} />}
             {isPruning ? 'Exit Pruning' : 'Prune Library'}
           </button>
        )}
      </div>
      
      {library.length > 0 && (
        <div className="space-y-4">
           {isPruning ? (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 text-red-600 rounded-full"><AlertOctagon size={20} /></div>
                    <div>
                      <p className="font-bold text-red-900 text-sm">Pruning Mode Active</p>
                      <p className="text-xs text-red-700">Select images to permanently delete from your library.</p>
                    </div>
                 </div>
                 {imagesToDelete.length > 0 && (
                    <div className="flex items-center gap-3">
                       <span className="text-xs font-bold text-red-900">{imagesToDelete.length} selected</span>
                       {isConfirmingDelete ? (
                          <div className="flex items-center gap-2">
                             <button onClick={() => setIsConfirmingDelete(false)} className="px-3 py-1.5 text-xs font-bold rounded-lg hover:bg-red-100 text-red-700">Cancel</button>
                             <button onClick={handleBatchDelete} className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-red-700">Confirm Delete</button>
                          </div>
                       ) : (
                          <button onClick={() => setIsConfirmingDelete(true)} className="px-3 py-1.5 bg-red-200 text-red-900 text-xs font-bold rounded-lg hover:bg-red-300">Delete Selected</button>
                       )}
                    </div>
                 )}
              </div>
           ) : (
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Select from Library</h4>
           )}
           
           <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {library.map(img => {
                const isSelected = isPruning 
                  ? imagesToDelete.includes(String(img.id))
                  : selectedImages.some(i => i.url === img.url);
                
                return (
                  <ImageWithOverlay 
                    key={img.id} 
                    image={img}
                    onClick={() => isPruning ? toggleImageForDeletion(String(img.id)) : onToggleImage(img)} 
                    className={`rounded-lg border-2 transition-all cursor-pointer relative
                      ${isPruning 
                          ? (isSelected ? 'border-red-500 ring-2 ring-red-200 contrast-125' : 'border-transparent opacity-60 hover:opacity-100') 
                          : (isSelected ? 'border-black scale-105' : 'border-transparent grayscale opacity-50 hover:grayscale-0 hover:opacity-100')
                      }
                    `}
                  >
                     {isPruning && isSelected && (
                        <div className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm z-20">
                           <Trash2 size={10} />
                        </div>
                     )}
                     {!isPruning && isSelected && (
                        <div className="absolute top-1 right-1 bg-black text-white rounded-full p-0.5 shadow-sm z-20">
                           <CheckCircle size={10} />
                        </div>
                     )}
                  </ImageWithOverlay>
                );
              })}
           </div>
        </div>
      )}
      
      <div className="grid grid-cols-5 gap-4">
        {selectedImages.map(img => (
          <ImageWithOverlay key={img.id} image={img} className="bg-zinc-100 rounded-xl shadow-sm">
            <button 
              onClick={(e) => { e.stopPropagation(); onRemoveSelected(img.id); }}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full z-20 hover:bg-red-500 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </ImageWithOverlay>
        ))}
        <label className="aspect-[3/4] border-2 border-dashed border-zinc-100 rounded-xl flex items-center justify-center cursor-pointer hover:border-black transition-colors">
          <Upload className="text-zinc-300" />
          <input type="file" multiple className="hidden" onChange={onFileUpload} />
        </label>
      </div>

      <div className="flex justify-between pt-8 border-t">
        <button onClick={onBack} className="text-zinc-400 text-[10px] font-bold uppercase">Back</button>
        <button 
          disabled={selectedImages.length < 1} 
          onClick={onNext} 
          className="px-10 py-4 bg-black text-white rounded-full font-bold uppercase shadow-xl disabled:opacity-50"
        >
          Process Selection
        </button>
      </div>
    </div>
  );
};

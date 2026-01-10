import React from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { ImageItem } from '@/types';

interface ImageSelectorProps {
  library: ImageItem[];
  selectedImages: ImageItem[];
  onToggleImage: (img: ImageItem) => void;
  onRemoveSelected: (id: string | number) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({ 
  library, 
  selectedImages, 
  onToggleImage, 
  onRemoveSelected, 
  onFileUpload, 
  onNext, 
  onBack 
}) => {
  return (
    <div className="max-w-5xl mx-auto py-8 animate-in slide-in-from-bottom-4 space-y-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif mb-2">Card Curation</h2>
      </div>
      
      {library.length > 0 && (
        <div className="space-y-4">
           <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Select from Library</h4>
           <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {library.map(img => {
                const isSelected = selectedImages.some(i => i.url === img.url);
                return (
                  <div 
                    key={img.id} 
                    onClick={() => onToggleImage(img)} 
                    className={`aspect-[3/4] rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${isSelected ? 'border-black scale-105' : 'border-transparent grayscale opacity-50'}`}
                  >
                    <img src={img.url} className="w-full h-full object-cover" />
                  </div>
                );
              })}
           </div>
        </div>
      )}
      
      <div className="grid grid-cols-5 gap-4">
        {selectedImages.map(img => (
          <div key={img.id} className="aspect-[3/4] bg-zinc-100 rounded-xl overflow-hidden group relative shadow-sm">
            <img src={img.url} className="w-full h-full object-cover" />
            <button 
              onClick={() => onRemoveSelected(img.id)} 
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
            >
              <Trash2 size={12} />
            </button>
          </div>
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

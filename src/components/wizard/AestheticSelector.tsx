import React from 'react';
import { AESTHETICS } from '@/constants';

interface AestheticSelectorProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNext: () => void;
}

export const AestheticSelector: React.FC<AestheticSelectorProps> = ({ selectedId, onSelect, onNext }) => {
  return (
    <div className="max-w-5xl mx-auto py-8 animate-in slide-in-from-bottom-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif mb-2">Select Identity</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {AESTHETICS.map((item) => (
          <div 
            key={item.id} 
            onClick={() => onSelect(item.id)} 
            className={`cursor-pointer group relative rounded-2xl overflow-hidden border-2 transition-all ${selectedId === item.id ? 'border-black scale-105' : 'border-transparent opacity-60'}`}
          >
            <img src={item.img} className="h-72 w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 flex items-end p-6">
              <span className="text-white font-serif">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 flex justify-end">
        <button 
          disabled={!selectedId} 
          onClick={onNext} 
          className="px-12 py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest shadow-xl disabled:opacity-50"
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

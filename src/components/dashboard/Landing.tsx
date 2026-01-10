import React from 'react';
import { CreditCard, Globe, Plus, Trash2, Eye, Image as ImageIcon } from 'lucide-react';
import { CardData, ImageItem } from '@/types';

interface LandingProps {
  username: string;
  library: ImageItem[];
  savedCards: CardData[];
  portfolioId: string | null;
  onNavigate: (mode: 'card' | 'portfolio') => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteAsset: (id: string | number) => void;
  onOpenCard: (card: CardData) => void;
  onViewCard: (card: CardData) => void;
  onEditProfile: () => void;
  onOpenPortfolio: () => void;
}

export const Landing: React.FC<LandingProps> = ({ 
  username, 
  library, 
  savedCards, 
  portfolioId,
  onNavigate, 
  onFileUpload, 
  onDeleteAsset, 
  onOpenCard,
  onViewCard,
  onEditProfile,
  onOpenPortfolio
}) => {
  return (
    <div className="max-w-7xl mx-auto space-y-20 py-12 animate-in fade-in duration-1000">
      <header className="text-center space-y-6 relative">
        <h1 className="text-9xl font-serif tracking-tighter text-black">POSE<span className="text-zinc-200 mx-2">&</span>POISE</h1>
        <div className="flex justify-center items-center gap-4">
           <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Workstation: {username}</p>
           <button onClick={onEditProfile} className="text-[10px] font-bold uppercase tracking-widest text-black underline hover:text-zinc-600">
              Edit Profile
           </button>
        </div>
      </header>

      {/* Main Actions / Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Card Studio Action */}
        <div className="bg-white border border-zinc-100 p-10 rounded-[2.5rem] hover:shadow-2xl transition-all group relative overflow-hidden">
           <div className="relative z-10">
              <CreditCard className="mb-6 text-zinc-300 group-hover:text-black transition-colors" size={32} />
              <h3 className="text-3xl font-serif mb-2">Composite Card</h3>
              <p className="text-sm text-zinc-400 font-light mb-8">Digital card architecture & deployment.</p>
              
              <button 
                onClick={() => onNavigate('card')}
                className="w-full py-4 bg-black text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-colors"
              >
                Create New Card
              </button>
           </div>
           
           {/* Saved Cards Mini-List */}
           {savedCards.length > 0 && (
             <div className="mt-8 border-t border-zinc-50 pt-6">
               <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 mb-4">{savedCards.length} Saved Designs</p>
               <div className="space-y-3">
                 {savedCards.slice(0, 3).map(card => (
                   <div key={card.id} className="flex items-center justify-between group/item">
                      <span className="text-xs font-serif truncate max-w-[150px]">{card.profile?.name || 'Untitled Card'}</span>
                      <div className="flex space-x-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                         <button onClick={() => onViewCard(card)} className="p-1 hover:bg-zinc-100 rounded text-xs uppercase font-bold text-zinc-400 hover:text-black">View</button>
                         <button onClick={() => onOpenCard(card)} className="p-1 hover:bg-zinc-100 rounded text-xs uppercase font-bold text-zinc-400 hover:text-black">Edit</button>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
           )}
        </div>

        {/* Portfolio Action */}
        <div className="bg-zinc-900 text-white p-10 rounded-[2.5rem] hover:shadow-2xl transition-all group relative overflow-hidden">
           <div className="relative z-10">
              <Globe className="mb-6 text-zinc-600 group-hover:text-zinc-200 transition-colors" size={32} />
              <h3 className="text-3xl font-serif mb-2">Web Portfolio</h3>
              <p className="text-sm text-zinc-400 font-light mb-8">Agency-facing subdomain hosting.</p>
              
              {portfolioId ? (
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={onOpenPortfolio}
                      className="py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-colors"
                    >
                      Open Editor
                    </button>
                    <a 
                      href={`/public_preview?userid=${username}&portfolioid=${portfolioId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center py-4 bg-zinc-800 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-700 transition-colors"
                    >
                      View Live
                    </a>
                 </div>
              ) : (
                <button 
                  onClick={onOpenPortfolio}
                  className="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-colors"
                >
                  Launch Builder
                </button>
              )}
           </div>
        </div>
      </div>

      <div className="space-y-12 pt-12 border-t border-zinc-50">
        <div className="flex justify-between items-end">
           <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400">Archived Content</h4>
              <h2 className="text-4xl font-serif">Asset Library</h2>
           </div>
           <label className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-zinc-800 transition-all flex items-center shadow-lg">
              <Plus size={14} className="mr-2" /> Select Assets
              <input type="file" multiple className="hidden" onChange={onFileUpload} />
           </label>
        </div>

        {library.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {library.map(img => (
                <div key={img.id} className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 shadow-sm hover:shadow-xl transition-all hover:scale-[1.02]">
                   <img src={img.url} className="w-full h-full object-cover" />
                   <button onClick={() => onDeleteAsset(img.id)} className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-red-500 hover:text-white rounded-full text-zinc-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                </div>
              ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-zinc-50 rounded-[3rem] border border-dashed border-zinc-200">
             <ImageIcon size={40} className="mx-auto text-zinc-300 mb-4" />
             <p className="text-zinc-400 font-serif text-lg italic">The library awaits your narrative.</p>
          </div>
        )}
      </div>
    </div>
  );
};

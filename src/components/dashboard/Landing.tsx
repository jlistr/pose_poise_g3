import React, { useState } from 'react';
import { Globe, Plus, Trash2, Eye, Edit2, Sparkles, Image as ImageIcon, X, AlertOctagon, CheckCircle, Bell } from 'lucide-react';
import { CardData, ImageItem, Profile, Shoot } from '@/types';
import { ImageWithOverlay } from '@/components/ui/ImageWithOverlay';
import { CardIcon } from '@/components/ui/CardIcon';
import { RunwayIcon } from '@/components/ui/RunwayIcon';
import { PortfolioSettings } from '../portfolio/PortfolioRenderer';
import { NotificationPanel, Notification } from '@/components/ui/NotificationPanel';

interface LandingProps {
  username: string;
  uid: string;
  profile: Profile;
  library: ImageItem[];
  savedCards: CardData[];
  portfolioId: string | null;
  onNavigate: (mode: 'card' | 'portfolio') => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, fileHash?: string) => Promise<boolean>;
  onDeleteAsset: (id: string | number) => void;
  onDeleteCard: (id: string) => void;
  onOpenCard: (card: CardData) => void;
  onViewCard: (card: CardData) => void;
  onEditProfile: () => void;
  onOpenPortfolio: () => void;
  onCuratePortfolio: () => void;
  shoots: Shoot[];
  portfolioSettings: PortfolioSettings;
  onBatchDeleteAssets?: (ids: string[]) => Promise<void>;
  notifications: Notification[];
  onRemoveNotification: (id: string) => void;
  onAddNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  isAssetHashInDB: (hash: string) => Promise<boolean>;
}

const PortfolioPreview: React.FC<{
  shoots: Shoot[];
  settings: PortfolioSettings;
  profile: Profile;
}> = ({ shoots, settings, profile }) => {
  const allImages = shoots.flatMap(s => 
    s.images.filter(url => !s.hiddenImages?.includes(url))
  ).slice(0, 10); 

  return (
    <div className="w-[1240px] h-[900px] bg-[#f9f8f6] rounded-[4rem] shadow-[0_50px_120px_rgba(0,0,0,0.4)] relative overflow-hidden flex pointer-events-none origin-top border border-white/40 mb-[-620px]" style={{ transform: 'scale(0.32)' }}>
       {/* Identity Column */}
       <div className="w-[450px] h-full bg-white border-r border-[#eceae5] p-24 flex flex-col justify-between">
          <div className="space-y-12">
             <div className="space-y-4">
                <span className="text-[14px] font-bold uppercase tracking-[0.4em] text-[#c4b9a3]">Identity</span>
                <h2 className="text-7xl font-serif uppercase tracking-tighter text-black leading-[0.9]">{profile.name || "MODEL"}</h2>
             </div>
             
             <div className="h-px w-20 bg-black/10" />

             <div className="grid grid-cols-2 gap-y-10 gap-x-8 text-[12px] font-bold uppercase tracking-widest text-zinc-400">
                <div className="space-y-1">
                   <p className="text-[#c4b9a3]">Height</p>
                   <p className="text-black text-lg font-serif italic normal-case">{profile.height || "—"}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[#c4b9a3]">Bust</p>
                   <p className="text-black text-lg font-serif italic normal-case">{profile.bust || "—"}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[#c4b9a3]">Waist</p>
                   <p className="text-black text-lg font-serif italic normal-case">{profile.waist || "—"}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[#c4b9a3]">Hips</p>
                   <p className="text-black text-lg font-serif italic normal-case">{profile.hips || "—"}</p>
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <div className="p-6 bg-[#f9f8f6] rounded-3xl border border-[#eceae5]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c4b9a3] mb-2">Primary Aesthetic</p>
                <p className="text-xl font-serif italic text-black">Editorial Archive</p>
             </div>
             <p className="text-[11px] text-zinc-300 font-bold uppercase tracking-[0.3em]">Pose & Poise • Vol 1</p>
          </div>
       </div>

       {/* Staggered Grid Column */}
       <div className="flex-1 h-full p-20 flex gap-8">
          <div className="flex-1 space-y-8 flex flex-col pt-24">
             {allImages.slice(0, 2).map((img, i) => (
                <div key={i} className="aspect-[3/4.5] bg-zinc-100 rounded-[3rem] overflow-hidden shadow-2xl border border-white/20">
                   <img src={img} className="w-full h-full object-cover" />
                </div>
             ))}
          </div>
          <div className="flex-1 space-y-8 flex flex-col">
             {allImages.slice(2, 4).map((img, i) => (
                <div key={i} className="aspect-[3/4] bg-zinc-100 rounded-[3rem] overflow-hidden shadow-2xl border border-white/20">
                   <img src={img} className="w-full h-full object-cover" />
                </div>
             ))}
             <div className="flex-1 bg-black/5 rounded-[3rem] border border-dashed border-black/10 flex items-center justify-center">
                <p className="text-4xl font-serif italic text-black/10">Archive</p>
             </div>
          </div>
          <div className="flex-1 space-y-8 flex flex-col pt-48">
             {allImages.slice(4, 6).map((img, i) => (
                <div key={i} className="aspect-[3/4.5] bg-zinc-100 rounded-[3rem] overflow-hidden shadow-2xl border border-white/20">
                   <img src={img} className="w-full h-full object-cover" />
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

const InspirationalTimeline: React.FC<{ shoots: Shoot[] }> = ({ shoots }) => {
  const sortedShoots = [...shoots]
    .filter(s => s.date)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());

  if (sortedShoots.length === 0) return null;

  return (
    <div className="hidden lg:block w-64 flex-shrink-0 space-y-8 animate-in fade-in slide-in-from-right duration-1000">
       <div className="space-y-1">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">The Journey</h4>
          <h2 className="text-2xl font-serif italic">Timeline</h2>
       </div>
       
       <div className="relative pl-6 space-y-12">
          {/* Vertical Line */}
          <div className="absolute left-[3px] top-2 bottom-2 w-px bg-zinc-100" />
          
          {sortedShoots.map((shoot, i) => (
             <div key={shoot.id} className="relative group cursor-default">
                {/* Dot */}
                <div className="absolute -left-[26px] top-1.5 w-2 h-2 rounded-full bg-zinc-200 group-hover:bg-black transition-colors" />
                
                <div className="space-y-1">
                   <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                      {shoot.date ? new Date(shoot.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recent'}
                   </p>
                   <h5 className="text-sm font-serif group-hover:italic transition-all">{shoot.name}</h5>
                   <p className="text-[10px] text-zinc-300 uppercase tracking-tighter">{shoot.images.length} Captured</p>
                </div>
             </div>
          ))}

          {/* Call to action */}
          <div className="pt-4">
             <div className="p-4 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 text-center space-y-2">
                <Sparkles size={16} className="mx-auto text-zinc-300" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Next Chapter</p>
                <p className="text-[10px] text-zinc-300 italic">"The lens is waiting."</p>
             </div>
          </div>
       </div>
    </div>
  );
};

export const Landing: React.FC<LandingProps> = ({ 
  username,
  uid,
  profile,
  library, 
  savedCards, 
  portfolioId,
  onNavigate, 
  onFileUpload, 
  onDeleteAsset, 
  onDeleteCard,
  onOpenCard,
  onViewCard,
  onEditProfile,
  onOpenPortfolio,
  onCuratePortfolio,
  shoots,
  portfolioSettings = { layout: 'grid', showHero: true, groupByCollection: false },
  onBatchDeleteAssets,
  notifications,
  onRemoveNotification,
  onAddNotification,
  isAssetHashInDB,
}) => {
  const [isPruning, setIsPruning] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const toggleImageForDeletion = (id: string) => {
    if (imagesToDelete.includes(id)) {
      setImagesToDelete(imagesToDelete.filter(i => i !== id));
    } else {
      setImagesToDelete([...imagesToDelete, id]);
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;

      for (const file of Array.from(e.target.files)) {
          const buffer = await file.arrayBuffer();
          const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

          const isDuplicate = await isAssetHashInDB(hashHex);

          if (isDuplicate) {
              onAddNotification({
                  message: `Image "${file.name}" is a duplicate and was not uploaded.`,
                  type: 'warning',
              });
          } else {
              // This is a bit of a hack, we re-create the event with one file
              const newEvent = { ...e, target: { ...e.target, files: [file] }};
              const success = await onFileUpload(newEvent as any, hashHex);
              if (success) {
                  onAddNotification({
                      message: `Successfully uploaded "${file.name}".`,
                      type: 'success',
                  });
              }
          }
      }
      
      // Clear the input value to allow re-uploading the same file name
      e.target.value = '';
  };


  const handleBatchDelete = async () => {
     if (!onBatchDeleteAssets) return;
     try {
       await onBatchDeleteAssets(imagesToDelete);
       setImagesToDelete([]);
       setIsConfirmingDelete(false);
       setIsPruning(false);
     } catch (err) {
       console.error(err);
     }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-20 py-12 animate-in fade-in duration-1000 relative">
      {/* Ambient Background Text */}
      {/* Ambient Background Text */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none z-0 flex items-center justify-center">
          <span className="text-[15vw] leading-none font-serif text-zinc-200 whitespace-nowrap select-none blur-sm opacity-30">
            POSE & POISE
          </span>
      </div>

      <header className="text-center space-y-6 relative z-10">
        <h1 className="text-9xl font-serif tracking-tighter text-black">POSE<span className="text-zinc-200 mx-2">&</span>POISE</h1>
        <div className="flex justify-center items-center gap-4">
           <div className="relative">
                <button 
                    onClick={() => setIsNotificationPanelOpen(prev => !prev)}
                    className="p-2 rounded-full hover:bg-zinc-100 transition-colors relative"
                    aria-label="Open notifications"
                >
                    <Bell size={20} className="text-zinc-600" />
                    {notifications.length > 0 && (
                        <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                    )}
                </button>
                {isNotificationPanelOpen && (
                    <NotificationPanel 
                        notifications={notifications}
                        onClose={() => setIsNotificationPanelOpen(false)}
                        onRemoveNotification={onRemoveNotification}
                    />
                )}
            </div>
           {profile.avatar && (
              <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-100 shadow-sm">
                  <img src={profile.avatar} className="w-full h-full object-cover" />
              </div>
           )}
           <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Workstation: {username}</p>
           <button onClick={onEditProfile} className="text-[10px] font-bold uppercase tracking-widest text-black underline hover:text-zinc-600">
              Edit Profile
           </button>
        </div>
      </header>

       {/* Main Layout Grid with Sidebar */}
      <div className={`flex flex-col lg:flex-row gap-16 mx-auto px-4 relative z-10 ${portfolioSettings?.showTimeline === false ? 'max-w-4xl' : 'max-w-6xl'}`}>
        <div className="flex-1 space-y-12">
          {/* Main Actions / Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card Studio Action */}
        <div className={`bg-white border border-zinc-100 rounded-[2.5rem] hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col ${savedCards.length > 0 ? 'h-auto' : 'lg:h-[720px]'}`}>
           <div className="p-10 relative z-10 text-center flex-shrink-0">
              <div className="mb-6 flex justify-center">
                 <div className="w-20 h-20 bg-black/5 rounded-3xl flex items-center justify-center transform group-hover:-rotate-12 transition-transform duration-500 shadow-sm">
                    <CardIcon className="text-black" size={32} />
                 </div>
              </div>
              <h3 className="text-3xl font-serif mb-2">Composite Card</h3>
              <p className="text-sm text-zinc-400 font-light mb-8">Digital card architecture & deployment.</p>
              
              <button 
                onClick={() => onNavigate('card')}
                className="w-full py-4 bg-black text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-colors"
              >
                Create New Card
              </button>
           </div>
           
           {/* Saved Cards Mini-List OR Stylish Previews */}
           {savedCards.length > 0 ? (
             <div className="p-10 pt-0 mt-auto border-t border-zinc-50 flex-1">
                <div className="pt-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 mb-4">{savedCards.length} Saved Designs</p>
                  <div className="space-y-3">
                    {savedCards.slice(0, 3).map(card => (
                      <div key={card.id} className="flex items-center justify-between group/item">
                         <span className="text-xs font-serif truncate max-w-[150px]">{card.name || card.profile?.name || 'Untitled Card'}</span>
                         <div className="flex space-x-2 opacity-0 group-hover/item:opacity-100 transition-opacity items-center">
                            <button onClick={() => onViewCard(card)} className="p-1 hover:bg-zinc-100 rounded text-xs uppercase font-bold text-zinc-400 hover:text-black">View</button>
                            <button onClick={() => onOpenCard(card)} className="p-1 hover:bg-zinc-100 rounded text-xs uppercase font-bold text-zinc-400 hover:text-black">Edit</button>
                            <button onClick={() => card.id && onDeleteCard(card.id)} className="p-1 hover:bg-red-50 text-zinc-300 hover:text-red-500 rounded"><Trash2 size={12} /></button>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
           ) : (
             <div className="bg-zinc-50 p-10 flex-1 flex flex-col border-t border-zinc-100">
                <div className="text-zinc-300 text-[10px] font-bold uppercase tracking-[1.5px] mb-8 text-center text-center">Essential Requirements</div>
                <div className="space-y-6 flex-1 text-center px-4 flex flex-col justify-center">
                   <div className="space-y-4">
                      <p className="text-sm font-serif italic text-zinc-500 leading-relaxed">
                        "Your composite card is your professional handshake. Agencies look for a balanced narrative of your range and physical stats."
                      </p>
                      <div className="h-px w-12 bg-zinc-200 mx-auto" />
                   </div>
                   
                   <div className="grid grid-cols-1 gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      <div className="space-y-2">
                         <span className="text-black block mb-1">Key Images</span>
                         <p>Headshot • Mid-Shot • Full Body • Profile</p>
                      </div>
                      <div className="space-y-2 pt-4">
                         <span className="text-black block mb-1">Critical Stats</span>
                         <p>Height • Bust • Waist • Hips • Shoes</p>
                      </div>
                   </div>

                   <p className="text-[9px] text-zinc-300 mt-auto pt-8">
                      Standard Size: 5.5" x 8.5" • High Resolution 300 DPI
                   </p>
                </div>
             </div>
           )}
        </div>

        {/* Web Portfolio Card - Redesigned per specifications */}
        <div className={`bg-[#1a1a1a] rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)] flex flex-col transition-all group border border-white/5 ${portfolioId ? 'h-auto lg:h-[720px]' : 'h-auto lg:h-[720px]'}`}>
           {/* Card Top Section */}
           <div className={`p-[50px_40px] text-center text-white ${portfolioId ? 'border-b border-[#333]' : ''}`}>
              <div className="mb-5 flex justify-center">
                 <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-2xl">
                    <RunwayIcon size={40} className="text-white" />
                 </div>
              </div>
              <h3 className="text-[36px] my-5 font-semibold tracking-tight leading-none">Web Portfolio</h3>
              <div className="px-0 sm:px-10">
                 <p className="text-[14px] text-[#aaa] mb-8 leading-[1.6]">Professional agency-facing deployment with AI curation.</p>
              </div>
              
              <button 
                disabled={!portfolioId && shoots.length === 0 && library.length === 0}
                onClick={!portfolioId ? onCuratePortfolio : onOpenPortfolio}
                className={`bg-white text-[#1a1a1a] px-10 py-3.5 rounded-full font-bold text-[12px] tracking-[1px] transition-all uppercase ${(!portfolioId && shoots.length === 0 && library.length === 0) ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105 hover:shadow-[0_4px_12px_rgba(255,255,255,0.2)]'}`}
              >
                {!portfolioId ? "Curate with AI" : "Edit Portfolio"}
              </button>
               {!portfolioId && shoots.length === 0 && library.length === 0 && (
                  <p className="text-[10px] text-zinc-500 mt-4 font-bold uppercase tracking-widest">
                     Add images to your library to enable AI Curation
                  </p>
               )}
           </div>

            {/* Card Bottom Section (PREVIEW) */}
            {portfolioId && (
               <div className="bg-[#0d0d0d] flex-1 flex flex-col items-center justify-start overflow-hidden pt-12 relative">
                  <div className="text-[#888] text-[11px] uppercase tracking-[1.5px] mb-[25px] text-center font-semibold z-20">Portfolio Identity</div>
                  <PortfolioPreview shoots={shoots} settings={portfolioSettings} profile={profile} />
                  
                  {/* Glass Gradient Overlay at bottom for depth */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d0d0d] to-transparent z-10" />
               </div>
            )}
         </div>
        </div>
 
         {/* Inspirational Timeline Sidebar */}
         {portfolioSettings?.showTimeline !== false && (
            <InspirationalTimeline shoots={shoots} />
         )}
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
              <input type="file" multiple className="hidden" onChange={handleFileUpload} />
           </label>
           
           {onBatchDeleteAssets && (
               <button 
                 onClick={() => { setIsPruning(!isPruning); setImagesToDelete([]); setIsConfirmingDelete(false); }}
                 className={`ml-4 p-3 rounded-full transition-all flex items-center justify-center
                   ${isPruning ? 'bg-red-100 text-red-600 ring-2 ring-red-200' : 'bg-zinc-100/50 text-zinc-400 hover:bg-zinc-100 hover:text-black'}
                 `}
                 title="Prune Library"
               >
                 {isPruning ? <X size={20} /> : <Trash2 size={20} />}
               </button>
           )}
        </div>
        
        {/* Pruning Banner */}
        {isPruning && (
              <div className="p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 shadow-sm">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-full"><AlertOctagon size={24} /></div>
                    <div>
                      <p className="font-bold text-red-900 text-lg">Pruning Mode</p>
                      <p className="text-sm text-red-700">Select images to permanently delete.</p>
                    </div>
                 </div>
                 
                 {imagesToDelete.length > 0 && (
                    <div className="flex items-center gap-4">
                       <span className="text-sm font-bold text-red-900">{imagesToDelete.length} selected</span>
                       {isConfirmingDelete ? (
                          <div className="flex items-center gap-2">
                             <button onClick={() => setIsConfirmingDelete(false)} className="px-5 py-2.5 text-sm font-bold rounded-xl hover:bg-red-100 text-red-700">Cancel</button>
                             <button onClick={handleBatchDelete} className="px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-red-700 hover:scale-105 transition-all">Confirm Delete</button>
                          </div>
                       ) : (
                          <button onClick={() => setIsConfirmingDelete(true)} className="px-5 py-2.5 bg-red-200 text-red-900 text-sm font-bold rounded-xl hover:bg-red-300 transition-colors">Delete Selected</button>
                       )}
                    </div>
                 )}
              </div>
        )}

        {library.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {library.map(img => {
                 const isSelected = isPruning && imagesToDelete.includes(String(img.id));
                 
                 return (
                 <ImageWithOverlay 
                    key={img.id} 
                    image={img} 
                    className={`aspect-[3/4] transition-all duration-300
                      ${isPruning 
                         ? (isSelected ? 'ring-4 ring-red-500 scale-95 opacity-100 z-10 rounded-xl' : 'opacity-60 grayscale hover:opacity-100 hover:scale-[1.02] cursor-pointer') 
                         : ''
                      }
                    `}
                    onClick={isPruning ? () => toggleImageForDeletion(String(img.id)) : undefined}
                 >

                    {isPruning && isSelected && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 shadow-md z-20">
                           <Trash2 size={16} />
                        </div>
                    )}
                    {isPruning && !isSelected && (
                        <div className="absolute top-4 right-4 bg-black/20 text-white/50 rounded-full p-2 z-20">
                           <div className="w-4 h-4 rounded-full border-2 border-white/50" />
                        </div>
                    )}
                 </ImageWithOverlay>
              )})}
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

import React, { useState } from 'react';
import { Plus, Share2, Copy, FileText, ArrowRight, ExternalLink, Check, Sparkles, RefreshCw, Square } from 'lucide-react';
import { FrontPlate } from '@/components/card/FrontPlate';
import { BackPlate } from '@/components/card/BackPlate';
import { CardData, ImageItem, Profile } from '@/types';
import { copyToClipboard } from '@/lib/utils';
import { toast } from 'sonner';

interface CardPreviewProps {
  cardData: {
    profile: Profile;
    images: ImageItem[];
  };
  currentCardId: string | null;
  onSave: (name: string, frontLayout: string, backLayout: string) => void;
  onExport: (frontLayout: string, backLayout: string, filename?: string) => void;
  onShare: () => void;
  initialName?: string;
  onNameChange?: (name: string) => void;
  initialFrontLayout?: string;
  initialBackLayout?: string;
}

export const CardPreview: React.FC<CardPreviewProps> = ({ 
  cardData, 
  currentCardId, 
  onSave, 
  onExport, 
  onShare,
  initialName,
  onNameChange,
  initialFrontLayout = 'classic',
  initialBackLayout = 'grid'
}) => {
  // Use initial props but fallback to defaults or previous state if needed
  // Since key can change component instance, simple init is fine
  const [frontLayout, setFrontLayout] = useState<string>(initialFrontLayout);
  const [backLayout, setBackLayout] = useState<string>(initialBackLayout);
  const [compCardSide, setCompCardSide] = useState<'front' | 'back'>('front');
  const [isStyling, setIsStyling] = useState(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSavedMark, setLastSavedMark] = useState<string>(JSON.stringify({ n: initialName, f: initialFrontLayout, b: initialBackLayout }));

  const handleStyleWithAI = async () => {
      setIsStyling(true);
      const toastId = toast.loading("AI is designing your layout...");
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
          const res = await fetch('/api/recommend-layout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  images: cardData.images.map(i => i.url),
                  profile: cardData.profile
              }),
              signal: controller.signal
          });
          
          if (!res.ok) throw new Error("Layout generation failed");
          
          const data = await res.json();
          if (data.frontLayout) setFrontLayout(data.frontLayout);
          if (data.backLayout) setBackLayout(data.backLayout);
          
          toast.success("Design refreshed!", { id: toastId });
          if (data.reasoning) toast.info(data.reasoning, { duration: 5000 });

      } catch (e: any) {
          if (e.name === 'AbortError') {
              console.log("Layout generation aborted");
          } else {
              console.error(e);
              toast.error("Could not generate layout", { id: toastId });
          }
      } finally {
          setIsStyling(false);
          abortControllerRef.current = null;
      }
  };

  const handleStopAI = () => {
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
        setIsStyling(false);
        toast.info("AI design stopped.");
    }
  };

  const publicUrl = currentCardId ? `${window.location.origin}?cardId=${currentCardId}` : null;
  
  const [cardName, setCardName] = useState(initialName || "");
  const [showSaveInput, setShowSaveInput] = useState(false);

  // Sync with prop changes if needed (e.g. opening different card)
  React.useEffect(() => {
     if (initialName !== undefined) setCardName(initialName);
  }, [initialName]);

  // Debounced Auto-save
  useEffect(() => {
    if (!currentCardId) return; // Only auto-save if card already exists

    const currentMark = JSON.stringify({ n: cardName, f: frontLayout, b: backLayout });
    if (currentMark === lastSavedMark) {
      setHasChanges(false);
      return;
    }

    setHasChanges(true);
    const timer = setTimeout(async () => {
      setIsSaving(true);
      try {
        await onSave(cardName, frontLayout, backLayout);
        setLastSavedMark(currentMark);
        setHasChanges(false);
      } catch (error) {
        console.error("Card Auto-save failed:", error);
      } finally {
        setIsSaving(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [cardName, frontLayout, backLayout, currentCardId, onSave, lastSavedMark]);

  const handleNameChange = (val: string) => {
     setCardName(val);
     onNameChange?.(val);
  };

  const handleSaveClick = () => {
    if (!cardName.trim()) {
        toast.error("Please name your card");
        return;
    }
    onSave(cardName, frontLayout, backLayout);
    setShowSaveInput(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-4 space-y-8 sticky top-12">
        <div className="flex items-center justify-between">
            <h2 className="text-4xl font-serif">Deployment</h2>
        </div>
        
        {/* Helper to edit name if already saved or just working */}
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
               <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Card Name</label>
               {currentCardId && (
                   <div className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 px-2 py-1 rounded-md ${isSaving ? 'text-zinc-400' : hasChanges ? 'text-indigo-400' : 'text-green-500'}`}>
                      {isSaving ? <RefreshCw size={10} className="animate-spin" /> : hasChanges ? <RefreshCw size={10} /> : <Check size={10} />}
                      {isSaving ? 'Saving...' : hasChanges ? 'Changes Pending' : 'Saved'}
                   </div>
               )}
            </div>
            <input 
                value={cardName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Untitled Card"
                className="bg-transparent text-lg font-serif border-b border-transparent focus:border-zinc-300 focus:outline-none w-full placeholder:text-zinc-300"
            />
        </div>

        <div className="space-y-6">
           {/* AI Style Button */}
           {isStyling ? (
               <button 
                  onClick={handleStopAI}
                  className="w-full py-3 bg-red-50 text-red-700 border border-red-100 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
               >
                  <Square size={14} fill="currentColor" /> Stop AI Designer
               </button>
           ) : (
               <button 
                  onClick={handleStyleWithAI}
                  className="w-full py-3 bg-purple-50 text-purple-700 border border-purple-100 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-purple-100 transition-colors"
               >
                  <Sparkles size={14} /> Style Card Layout Using AI
               </button>
           )}

           <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Front Design</h4>
              <div className="grid grid-cols-3 gap-2">
                 {(['classic', 'modern', 'minimal'] as const).map(l => (
                   <button 
                     key={l} 
                     onClick={() => setFrontLayout(l)} 
                     className={`py-2 rounded-lg border text-[10px] uppercase font-bold tracking-widest transition-all ${frontLayout === l ? 'bg-black text-white' : 'bg-white text-zinc-300'}`}
                   >
                     {l}
                   </button>
                 ))}
              </div>
           </div>
           <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Back Layout</h4>
              <div className="grid grid-cols-3 gap-2">
                  {(['grid', 'masonry', 'triptych', 'agency', 'focus', 'band', 'quad'] as const).map(l => (
                   <button 
                     key={l} 
                     onClick={() => setBackLayout(l)} 
                     className={`py-2 rounded-lg border text-[10px] uppercase font-bold tracking-widest transition-all ${backLayout === l ? 'bg-black text-white' : 'bg-white text-zinc-300'}`}
                   >
                     {l}
                   </button>
                 ))}
              </div>
           </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
           <button onClick={() => setCompCardSide('front')} className={`py-3 rounded-xl border text-[10px] font-bold uppercase ${compCardSide === 'front' ? 'bg-black text-white shadow-xl' : 'bg-white text-zinc-400'}`}>View Front</button>
           <button onClick={() => setCompCardSide('back')} className={`py-3 rounded-xl border text-[10px] font-bold uppercase ${compCardSide === 'back' ? 'bg-black text-white shadow-xl' : 'bg-white text-zinc-400'}`}>View Back</button>
        </div>
        <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-[2rem] space-y-4 shadow-inner">
           {!currentCardId ? (
             <div className="space-y-4">
                {showSaveInput ? (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <input 
                            autoFocus
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Name this card (e.g. 'Paris Fashion Week')..."
                            className="w-full p-3 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setShowSaveInput(false)} className="py-3 bg-white border border-zinc-200 rounded-xl text-[10px] font-bold uppercase hover:bg-zinc-50">Cancel</button>
                            <button onClick={handleSaveClick} className="py-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase hover:bg-zinc-800">Confirm Save</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setShowSaveInput(true)} className="w-full py-4 bg-black text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center space-x-2 shadow-xl hover:scale-[1.02] transition-transform">
                        <Plus size={16} /> <span>Save Card</span>
                    </button>
                )}
             </div>
           ) : (
             <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border flex items-center justify-between overflow-hidden shadow-sm">
                  <span className="text-[10px] font-mono text-zinc-400 truncate">{publicUrl || ""}</span>
                  <div className="flex items-center gap-1">
                      <button onClick={() => copyToClipboard(publicUrl || "")} className="p-2 hover:bg-zinc-50 rounded-lg"><Copy size={14} /></button>
                      <button onClick={() => window.open(publicUrl || "", "_blank")} className="p-2 hover:bg-zinc-50 rounded-lg"><ExternalLink size={14} /></button>
                  </div>
                </div>
                <button onClick={onShare} className="w-full py-4 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center space-x-2 shadow-xl">
                  <Share2 size={16} /> <span>Share Digital Card</span>
                </button>
             </div>
           )}
        </div>
        <button onClick={() => onExport(frontLayout, backLayout, cardName || 'composite-card')} className="w-full py-5 bg-black text-white rounded-2xl font-bold text-xs uppercase flex items-center justify-center space-x-2 shadow-2xl hover:bg-zinc-800 transition-all">
          <FileText size={16} /> <span>Export Hi-Res PDF</span>
        </button>
      </div>
      
      <div className="lg:col-span-8 flex justify-center min-h-[900px] bg-zinc-50 p-12 rounded-[3.5rem] border border-zinc-100">
         <div className="relative group perspective">
            <div className={`transition-all duration-1000 preserve-3d ${compCardSide === 'back' ? 'rotate-y-180' : ''}`}>
               <div className={`bg-white shadow-2xl w-[450px] aspect-[5.5/8.5] p-0 flex flex-col border backface-hidden rounded-sm ${compCardSide === 'back' ? 'opacity-0' : 'opacity-100'}`}>
                  <FrontPlate layout={frontLayout as 'classic' | 'modern' | 'minimal'} images={cardData.images.map(i => i.url)} profile={cardData.profile} />
               </div>
               <div className={`bg-white shadow-2xl w-[450px] aspect-[5.5/8.5] p-0 absolute top-0 left-0 flex flex-col border backface-hidden rotate-y-180 rounded-sm ${compCardSide === 'front' ? 'opacity-0' : 'opacity-100'}`}>
                  <BackPlate layout={backLayout as 'grid' | 'masonry' | 'triptych' | 'agency' | 'focus' | 'band' | 'quad'} images={cardData.images.map(i => i.url)} profile={cardData.profile} />
               </div>
            </div>
         </div>
      </div>
      <style>{`
        .perspective { perspective: 1500px; }
        .preserve-3d { transform-style: preserve-3d; position: relative; height: 100%; width: 100%; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>

      {/* Hidden Export Container - Renders flat versions for PDF capture */}
      <div id="export-container" style={{ position: 'fixed', left: '-9999px', top: 0 }}>
         <div id="export-front" className="w-[450px] aspect-[5.5/8.5] bg-white relative">
            <FrontPlate layout={frontLayout as 'classic' | 'modern' | 'minimal'} images={cardData.images.map(i => i.url)} profile={cardData.profile} />
         </div>
         <div id="export-back" className="w-[450px] aspect-[5.5/8.5] bg-white relative">
            <BackPlate layout={backLayout as 'grid' | 'masonry' | 'triptych' | 'agency' | 'focus' | 'band' | 'quad'} images={cardData.images.map(i => i.url)} profile={cardData.profile} />
         </div>
      </div>
    </div>
  );
};

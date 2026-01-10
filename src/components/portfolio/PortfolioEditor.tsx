import React, { useState, useEffect } from 'react';
import { Shoot, Profile } from '@/types';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { LayoutGrid, AppWindow, Maximize2, Globe, Lock, ExternalLink, Layers, RefreshCw } from 'lucide-react';
import { PortfolioRenderer, PortfolioSettings } from './PortfolioRenderer';

interface PortfolioEditorProps {
  shoots: Shoot[];
  initialSettings?: PortfolioSettings;
  isPublic?: boolean;
  username: string;
  profile?: Profile;
  portfolioId: string | null;
  onUpdate: (settings: PortfolioSettings) => Promise<void>;
  onPublish: (isPublic: boolean) => Promise<void>;
  onCurate: () => void;
  onBack: () => void;
}

const DEFAULT_SETTINGS: PortfolioSettings = {
  layout: 'grid',
  showHero: true,
  groupByCollection: false
};

export const PortfolioEditor: React.FC<PortfolioEditorProps> = ({ 
  shoots, 
  initialSettings, 
  isPublic: initialIsPublic = false, 
  username,
  profile,
  portfolioId,
  onUpdate, 
  onPublish, 
  onCurate,
  onBack 
}) => {
  const [settings, setSettings] = useState<PortfolioSettings>(initialSettings || DEFAULT_SETTINGS);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes to show "Update" button state
  useEffect(() => {
     // rudimentary change detection
     setHasChanges(true); // Always allowing update for now for simplicity, or we deep compare
  }, [settings]);

  const handleUpdate = async () => {
    setIsSaving(true);
    await onUpdate(settings);
    setIsSaving(false);
    setHasChanges(false);
  };

  const handlePublishToggle = async () => {
    const newState = !isPublic;
    setIsPublic(newState);
    await onPublish(newState);
  };
  
  const publicUrl = portfolioId ? `/public_preview?userid=${username}&portfolioid=${portfolioId}` : null;

  return (
    <div className="max-w-7xl mx-auto py-8 px-8 min-h-screen flex flex-col">
      {/* Editor Toolbar */}
      <div className="sticky top-4 z-40 bg-zinc-900/90 backdrop-blur-md text-white p-4 rounded-full shadow-2xl mb-12 flex justify-between items-center animate-in slide-in-from-top-4">
         <div className="flex items-center space-x-6 px-4">
            <BrandIcon size={20} className="text-white" />
            <div className="h-4 w-px bg-white/20"></div>
            
            {/* Display Toggles */}
            <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest">
                <button 
                  onClick={() => setSettings(s => ({ ...s, showHero: !s.showHero }))}
                  className={`flex items-center space-x-2 transition-opacity ${settings.showHero ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                >
                   <AppWindow size={14} /> <span>Hero</span>
                </button>
                <button 
                  onClick={() => setSettings(s => ({ ...s, layout: settings.layout === 'grid' ? 'masonry' : 'grid' }))}
                  className="flex items-center space-x-2 transition-opacity hover:opacity-80"
                >
                   {settings.layout === 'grid' ? <LayoutGrid size={14} /> : <Maximize2 size={14} />}
                   <span>{settings.layout}</span>
                </button>
                <button 
                   onClick={() => setSettings(s => ({ ...s, groupByCollection: !s.groupByCollection }))}
                   className={`flex items-center space-x-2 transition-opacity ${settings.groupByCollection ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                >
                   <Layers size={14} /> <span>Group</span>
                </button>
            </div>
         </div>

         {/* Actions */}
         <div className="flex items-center space-x-4">
             {publicUrl && (
               <a 
                 href={publicUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex items-center space-x-2 text-[10px] font-bold uppercase px-4 py-2 hover:bg-white/10 rounded-full transition-colors"
               >
                 <ExternalLink size={14} /> <span>View Live</span>
               </a>
             )}
             
             <button 
               onClick={onCurate}
               className="flex items-center space-x-2 text-[10px] font-bold uppercase px-4 py-2 hover:bg-white/10 rounded-full transition-colors"
             >
               <Layers size={14} /> <span>Curate</span>
             </button>

             <button 
               onClick={handleUpdate}
               className={`flex items-center space-x-2 text-[10px] font-bold uppercase px-6 py-3 rounded-full transition-all 
                 ${isSaving ? 'bg-zinc-700 cursor-wait' : 'bg-white text-black hover:bg-zinc-200'}
               `}
             >
                {isSaving ? <RefreshCw size={14} className="animate-spin" /> : null}
                <span>{isSaving ? 'Updating...' : 'Update'}</span>
             </button>

             <button 
               onClick={handlePublishToggle}
               className={`flex items-center space-x-2 text-[10px] font-bold uppercase px-6 py-3 rounded-full border transition-all
                 ${isPublic ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'}
               `}
             >
                {isPublic ? <Globe size={14} /> : <Lock size={14} />}
                <span>{isPublic ? 'Public' : 'Private'}</span>
             </button>
         </div>
      </div>

      <div className="flex-1">
         <PortfolioRenderer shoots={shoots} settings={settings} profile={profile} />
      </div>
      
      <div className="mt-12 text-center text-xs text-zinc-400 uppercase tracking-widest font-bold">
         <p>Portfolio Editor Mode</p>
         <button onClick={onBack} className="mt-4 hover:text-black underline">Back to Dashboard</button>
      </div>
    </div>
  );
};

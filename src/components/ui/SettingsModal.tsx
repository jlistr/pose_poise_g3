import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, Shield, Settings, Database } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetPortfolio: () => Promise<void>;
  onClearCompCards: () => Promise<void>;
  onClearLibrary: () => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onResetPortfolio, onClearCompCards, onClearLibrary }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'privacy' | 'data'>('general');
  const [confirmInput, setConfirmInput] = useState('');
  const [actionToConfirm, setActionToConfirm] = useState<'reset_portfolio' | 'clear_cards' | 'clear_library' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleAction = async () => {
    if (confirmInput.toUpperCase() !== 'DELETE') return;
    
    setIsProcessing(true);
    try {
      if (actionToConfirm === 'reset_portfolio') {
        await onResetPortfolio();
      } else if (actionToConfirm === 'clear_cards') {
        await onClearCompCards();
      } else if (actionToConfirm === 'clear_library') {
        await onClearLibrary();
      }
      // Reset state
      setActionToConfirm(null);
      setConfirmInput('');
    } catch (error) {
       console.error("Action failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-100 rounded-full">
                <Settings size={20} className="text-zinc-600" />
              </div>
              <h2 className="text-xl font-serif font-bold">Account Settings</h2>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
              <X size={20} />
           </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
           {/* Sidebar */}
           <div className="w-48 bg-zinc-50 border-r border-zinc-100 p-4 space-y-1">
              <button 
                onClick={() => setActiveTab('general')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3
                  ${activeTab === 'general' ? 'bg-white shadow text-black' : 'text-zinc-500 hover:text-black hover:bg-zinc-200/50'}
                `}
              >
                  <Settings size={16} /> General
              </button>
              <button 
                onClick={() => setActiveTab('privacy')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3
                  ${activeTab === 'privacy' ? 'bg-white shadow text-black' : 'text-zinc-500 hover:text-black hover:bg-zinc-200/50'}
                `}
              >
                  <Shield size={16} /> Privacy
              </button>
              <button 
                onClick={() => setActiveTab('data')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3
                  ${activeTab === 'data' ? 'bg-red-50 text-red-600 shadow-sm ring-1 ring-red-100' : 'text-zinc-500 hover:text-red-500 hover:bg-red-50'}
                `}
              >
                  <AlertTriangle size={16} /> Admin Zone
              </button>
           </div>

           {/* Content */}
           <div className="flex-1 p-8 overflow-y-auto">
              
              {activeTab === 'general' && (
                 <div className="space-y-6">
                    <h3 className="text-lg font-bold">General Preferences</h3>
                    <p className="text-sm text-zinc-500">General settings functionality coming soon.</p>
                 </div>
              )}

              {activeTab === 'privacy' && (
                 <div className="space-y-6">
                    <h3 className="text-lg font-bold">Privacy & Security</h3>
                    <p className="text-sm text-zinc-500">Manage your visibility and privacy settings here.</p>
                 </div>
              )}

              {activeTab === 'data' && (
                 <div className="space-y-8">
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-4">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600">
                           <Shield size={24} />
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-red-900">Security Level 3: Admin Controls</h3>
                              <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase rounded-full">Admin Only</span>
                           </div>
                           <p className="text-sm text-red-700/80 leading-relaxed">
                              These actions are destructive and <strong>cannot be undone</strong>. They will permanently remove data from your account. Please proceed with extreme caution.
                           </p>
                        </div>
                    </div>

                    {/* Reset Portfolio Card */}
                    <div className="p-6 border border-zinc-200 rounded-2xl space-y-4 hover:border-red-200 transition-colors group">
                        <div className="flex items-start justify-between">
                           <div>
                              <h4 className="font-bold text-zinc-900 group-hover:text-red-900 transition-colors">Reset Portfolio Configuration</h4>
                              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                                 Permanently deletes all shoots, resets layout settings, and clears your portfolio configuration. Your uploaded images in the Library are preserved.
                              </p>
                           </div>
                           <button 
                              onClick={() => setActionToConfirm('reset_portfolio')}
                              className="px-4 py-2 bg-zinc-50 border border-zinc-200 text-zinc-600 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                           >
                              Reset Portfolio
                           </button>
                        </div>
                    </div>

                    {/* Clear Card Designs */}
                    <div className="p-6 border border-zinc-200 rounded-2xl space-y-4 hover:border-red-200 transition-colors group">
                        <div className="flex items-start justify-between">
                           <div>
                              <h4 className="font-bold text-zinc-900 group-hover:text-red-900 transition-colors">Clear Saved Designs</h4>
                              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                                 Permanently deletes all saved Composite Card designs and layouts.
                              </p>
                           </div>
                           <button 
                              onClick={() => setActionToConfirm('clear_cards')}
                              className="px-4 py-2 bg-zinc-50 border border-zinc-200 text-zinc-600 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                           >
                              Clear Cards
                           </button>
                        </div>
                    </div>

                    {/* Clear Asset Library */}
                    <div className="p-6 border border-zinc-200 rounded-2xl space-y-4 hover:border-red-200 transition-colors group">
                        <div className="flex items-start justify-between">
                           <div>
                              <h4 className="font-bold text-zinc-900 group-hover:text-red-900 transition-colors">Clear Asset Library</h4>
                              <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                                 Permanently deletes ALL images and uploaded assets from your library. This is irreversible.
                              </p>
                           </div>
                           <button 
                              onClick={() => setActionToConfirm('clear_library')}
                              className="px-4 py-2 bg-zinc-50 border border-zinc-200 text-zinc-600 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                           >
                              Clear Library
                           </button>
                        </div>
                    </div>
                 </div>
              )}
           </div>
        </div>

        {/* Confirmation Overlay */}
        {actionToConfirm && (
           <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95">
               <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <AlertTriangle size={32} />
               </div>
               <h3 className="text-2xl font-serif font-bold text-center mb-2">Are you absolutely sure?</h3>
               <p className="text-zinc-500 text-center max-w-md mb-8">
                  This action cannot be undone. To confirm, please type <span className="font-bold text-black">DELETE</span> below.
               </p>

               <input 
                 type="text" 
                 placeholder="Type DELETE"
                 value={confirmInput}
                 onChange={(e) => setConfirmInput(e.target.value)}
                 className="w-64 text-center text-xl font-bold tracking-widest border-2 border-zinc-200 focus:border-red-500 focus:outline-none rounded-xl py-3 mb-6 uppercase"
                 autoFocus
               />

               <div className="flex items-center gap-4">
                  <button 
                    onClick={() => { setActionToConfirm(null); setConfirmInput(''); }}
                    className="px-6 py-3 bg-zinc-100 text-zinc-600 font-bold rounded-xl hover:bg-zinc-200"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAction}
                    disabled={confirmInput.toUpperCase() !== 'DELETE' || isProcessing}
                    className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isProcessing ? 'Deleting...' : (
                        <>
                           <Trash2 size={18} />
                           <span>Confirm Nuke</span>
                        </>
                    )}
                  </button>
               </div>
           </div>
        )}

      </div>
    </div>
  );
};

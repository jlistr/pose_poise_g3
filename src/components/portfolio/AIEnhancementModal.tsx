import React, { useState, useEffect } from 'react';
import { X, Sparkles, Wand2, Check, RefreshCw, AlertCircle, Search, Square, Quote, ArrowUpCircle, CheckCircle2 } from 'lucide-react';
import { Shoot, Profile } from '@/types';
import { PortfolioSettings } from './PortfolioRenderer';

interface AIEnhancementModalProps {
  isOpen: boolean;
  onClose: () => void;
  shoots: Shoot[];
  profile?: Profile;
  settings: PortfolioSettings;
  onRemoveDuplicates?: (indices: number[]) => void;
  onApplySuggestions?: (heroIndex: number, highlightIndices: number[]) => void;
  library?: { id: string | number; url: string }[];
  onApplyCuration?: (curatedShoots: any[], heroUrl?: string, highlightedUrls?: string[]) => void;
}

interface AIAnalysis {
  summary: string;
  theme?: string;
  imageQuality: {
    status: 'excellent' | 'good' | 'needs_work';
    details: string;
    upscaleRecommendation: string[];
  };
  highlightIndices?: number[];
  heroIndex?: number;
  duplicateIndices: number[]; // Ensure this is always defined or optional
  layoutSuggestions?: string[];
  careerAlignment: string;
  suggestedAutomations?: {
    heroIndex: number;
    highlightIndices: number[];
    rationale: string;
  };
  curatedShoots?: {
    name: string;
    images: string[];
    vibes: string[];
    rationale: string;
  }[];
  heroUrl?: string;
  highlightedUrls?: string[];
  bioSuggestion?: string;
}

export const AIEnhancementModal: React.FC<AIEnhancementModalProps> = ({ 
  isOpen, onClose, shoots, profile, settings, 
  onRemoveDuplicates, onApplySuggestions, onApplyCuration, 
  library = [] 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCleaning, setIsCleaning] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [customInstructions, setCustomInstructions] = useState('');
  const abortControllerRef = React.useRef<AbortController | null>(null);

  useEffect(() => {
    if (isOpen && !analysis && !isAnalyzing) {
      runAnalysis();
    }
  }, [isOpen]);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Analyze the ENTIRE library
      const allUrls = library.map(i => i.url);
      
      const response = await fetch('/api/enhance-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            imageUrls: allUrls,
            profile,
            settings,
            customInstructions 
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error('Failed to analyze portfolio');
      }

      const data: AIAnalysis = await response.json();
      setAnalysis(data); // Changed from setSuggestions to setAnalysis
    } catch (err: any) {
      if (err.name === 'AbortError') {
          console.log("Portfolio analysis aborted");
      } else {
          console.error('Enhancement error:', err);
          setError('The AI was unable to curate your library. Please try again or refine your goal.');
      }
    } finally {
      setIsAnalyzing(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopAI = () => {
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
        setIsAnalyzing(false);
    }
  };

  const handleCleanup = async () => {
    if (!analysis?.duplicateIndices?.length || !onRemoveDuplicates) return;
    setIsCleaning(true);
    try {
      await onRemoveDuplicates(analysis.duplicateIndices);
      // Update local analysis to clear duplicates once handled
      setAnalysis(prev => prev ? { ...prev, duplicateIndices: [] } : null);
    } catch (err) {
      console.error("Cleanup failed:", err);
    } finally {
      setIsCleaning(false);
    }
  };

  const handleApplyAutomations = () => {
     if (!analysis?.suggestedAutomations || !onApplySuggestions) return;
     setIsApplying(true);
     try {
       onApplySuggestions(analysis.suggestedAutomations.heroIndex, analysis.suggestedAutomations.highlightIndices);
       setHasApplied(true);
     } catch (err) {
       console.error("Failed to apply automations", err);
     } finally {
       setIsApplying(false);
     }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
           <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-500 rounded-xl text-white">
                 <Sparkles size={20} />
              </div>
              <div>
                 <h2 className="text-xl font-serif">Google AI Curator</h2>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Gemini Pro Vision</p>
              </div>
           </div>
           <div className="flex items-center space-x-2">
              {analysis && !isAnalyzing && (
                <button 
                  onClick={() => {
                    setHasApplied(false);
                    runAnalysis();
                  }}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors border border-indigo-100"
                >
                   <Sparkles size={14} />
                   <span>Regenerate</span>
                </button>
              )}
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                 <X size={20} />
              </button>
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
           {/* Custom Prompt Input Section */}
           <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100/50 space-y-4">
              <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-2 text-indigo-600">
                    <Wand2 size={18} />
                    <h3 className="text-[10px] font-bold uppercase tracking-widest">Curation Strategy</h3>
                 </div>
                 {isAnalyzing && <RefreshCw size={14} className="text-indigo-400 animate-spin" />}
              </div>
              
              <textarea 
                 value={customInstructions}
                 onChange={(e) => setCustomInstructions(e.target.value)}
                 placeholder="e.g. Group images by outfit color, collections by Street vs Studio, or focus on 'The Blue Dress' themes..."
                 className="w-full bg-white border border-indigo-100/50 rounded-2xl px-5 py-4 text-sm font-serif focus:outline-none focus:ring-2 focus:ring-indigo-500/10 placeholder:text-zinc-300 min-h-[80px] resize-none transition-all shadow-sm"
              />
              
              <div className="flex justify-end pt-2">
                 <button 
                    onClick={() => runAnalysis()}
                    disabled={isAnalyzing}
                    className="px-6 py-2.5 bg-indigo-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center space-x-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                 >
                    {isAnalyzing ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    <span>{analysis ? 'Re-Curate with This Goal' : 'Start AI Curation'}</span>
                 </button>
              </div>
           </div>

            {isAnalyzing ? (
               <div className="flex flex-col items-center justify-center space-y-4 py-12">
                  <div className="relative">
                    <RefreshCw className="w-12 h-12 text-zinc-200 animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-indigo-500 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-serif text-xl mb-1 italic">Thinking...</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Curating your creative narrative</p>
                  </div>
                  <button 
                    onClick={handleStopAI}
                    className="mt-4 px-6 py-2 bg-red-50 text-red-600 border border-red-100 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center gap-2"
                  >
                    <Square size={12} fill="currentColor" /> Stop Analysis
                  </button>
               </div>
            ) : error ? (
             <div className="py-20 flex flex-col items-center justify-center space-y-4 text-center">
                <AlertCircle size={40} className="text-red-400" />
                <p className="text-zinc-500">{error}</p>
                <button onClick={runAnalysis} className="px-6 py-2 bg-zinc-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors">Retry</button>
             </div>
           ) : analysis ? (
             <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Summary Section */}
                <div className="relative p-8 bg-zinc-900 text-white rounded-[2rem] overflow-hidden shadow-xl">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Sparkles size={80} />
                   </div>
                   <div className="relative z-10 space-y-4">
                      {analysis.theme && (
                        <div className="inline-block px-3 py-1 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
                           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-200">Curated Theme: {analysis.theme}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 text-indigo-300">
                         <Quote size={20} />
                         <span className="text-[10px] font-bold uppercase tracking-[0.2em]">The Insight</span>
                      </div>
                      <p className="text-2xl font-serif italic leading-relaxed">{analysis.summary}</p>
                   </div>
                </div>

                {/* Career Goals Section */}
                <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[2rem] space-y-4 shadow-sm">
                   <div className="flex items-center space-x-2 text-indigo-500">
                      <ArrowUpCircle size={20} />
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Path to Success</h3>
                   </div>
                   <p className="text-sm text-indigo-900/80 leading-relaxed font-serif italic">{analysis.careerAlignment}</p>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Quality */}
                   <div className="p-6 bg-white border border-zinc-100 rounded-[1.5rem] space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-50 pb-4">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Image Quality</span>
                         <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border ${
                            analysis.imageQuality.status === 'excellent' ? 'bg-green-50 text-green-500 border-green-100' :
                            analysis.imageQuality.status === 'good' ? 'bg-blue-50 text-blue-500 border-blue-100' :
                            'bg-orange-50 text-orange-500 border-orange-100'
                         }`}>
                            {analysis.imageQuality.status.replace('_', ' ')}
                         </span>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">{analysis.imageQuality.details}</p>
                      {analysis.imageQuality.upscaleRecommendation.length > 0 && (
                        <div className="pt-2 text-center text-center">
                           <button className="w-full flex items-center justify-center space-x-2 p-3 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10">
                              <ArrowUpCircle size={14} />
                              <span>Upscale for Web & Print</span>
                           </button>
                        </div>
                      )}
                   </div>

                   {/* Layout */}
                   <div className="p-6 bg-white border border-zinc-100 rounded-[1.5rem] space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-50 pb-4">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Layout Optimization</span>
                         <CheckCircle2 size={14} className="text-zinc-300" />
                      </div>
                      <ul className="space-y-3">
                         {analysis.layoutSuggestions?.map((s, i) => (
                           <li key={i} className="flex items-start space-x-3 group text-center text-left">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-200 mt-1.5 shrink-0 group-hover:bg-indigo-500 transition-colors" />
                              <span className="text-xs text-zinc-600 leading-tight">{s}</span>
                           </li>
                         ))}
                      </ul>
                   </div>
                </div>

                {hasApplied && (
                   <div className="p-6 bg-green-50 border border-green-100 rounded-[1.5rem] flex items-center justify-center space-x-3 animate-in fade-in zoom-in">
                       <CheckCircle2 size={20} className="text-green-600" />
                       <span className="text-xs font-bold uppercase tracking-widest text-green-800">Changes Applied Successfully</span>
                   </div>
                )}

                {/* Curated Collections Section */}
                {analysis.curatedShoots && !hasApplied && (
                   <div className="p-8 bg-zinc-50 border border-zinc-100 rounded-[2rem] space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                               <Sparkles size={18} />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">AI Reorganization Plan</h3>
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{analysis.curatedShoots.length} Sets</span>
                      </div>

                      <div className="space-y-4">
                         {analysis.curatedShoots.map((s, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm space-y-3">
                               <div className="flex justify-between items-start">
                                  <div>
                                     <h4 className="text-sm font-serif italic text-indigo-900">{s.name}</h4>
                                     <p className="text-[10px] text-zinc-400 mt-1">{s.rationale}</p>
                                  </div>
                                  <div className="flex -space-x-2">
                                     {s.images.slice(0, 3).map((img, j) => (
                                        <div key={j} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-zinc-100 shadow-sm">
                                           <img src={img} className="w-full h-full object-cover" />
                                        </div>
                                     ))}
                                     {s.images.length > 3 && (
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[8px] font-bold text-zinc-400 shadow-sm">
                                           +{s.images.length - 3}
                                        </div>
                                     )}
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>

                      <button 
                        onClick={() => {
                           if (onApplyCuration && analysis.curatedShoots) {
                              onApplyCuration(analysis.curatedShoots, analysis.heroUrl, analysis.highlightedUrls);
                              setHasApplied(true);
                           }
                        }}
                        className="w-full py-4 bg-zinc-900 text-white hover:bg-black rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 shadow-xl shadow-zinc-900/10"
                      >
                         <Sparkles size={16} />
                         <span>Apply AI Collection Names & Layout</span>
                      </button>
                   </div>
                )}

                {/* Duplicates Section */}
                {analysis.duplicateIndices && analysis.duplicateIndices.length > 0 && (
                   <div className="p-8 bg-orange-50 border border-orange-100 rounded-[2rem] space-y-6 animate-in zoom-in-95">
                      <div className="flex items-center space-x-3">
                         <div className="p-2 bg-orange-500 rounded-lg text-white">
                            <AlertCircle size={18} />
                         </div>
                         <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-orange-950">Duplicate Detected</h3>
                            <p className="text-[10px] text-orange-800 opacity-60">I've found {analysis.duplicateIndices.length} identical images in your set.</p>
                         </div>
                      </div>
                      
                      <button 
                        onClick={handleCleanup}
                        disabled={isCleaning}
                        className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-2xl text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 shadow-lg shadow-orange-900/20"
                      >
                         {isCleaning ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                         <span>{isCleaning ? 'Cleaning...' : 'Remove Duplicates from Portfolio & Library'}</span>
                      </button>
                   </div>
                )}
             </div>
           ) : null}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-zinc-100 bg-zinc-50/50 flex justify-end">
           <button 
             onClick={onClose}
             className="px-8 py-3 bg-white border border-zinc-200 text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 transition-colors"
           >
             Close Analysis
           </button>
        </div>
      </div>
    </div>
  );
};

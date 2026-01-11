
'use client';

import React, { useState, useRef } from 'react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getProfile, getShootsForPortfolio } from '@/lib/data-supabase';
import { toast } from 'sonner';
import { Search, Globe, Shield, Zap, Sparkles, ArrowRight, ExternalLink, ChevronRight, Check, Languages, Target, Lightbulb, MapPin, Loader2, Square } from 'lucide-react';

export default function DomainSearchPage() {
  const { user } = useAuth();
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<{domain: string, available: boolean, price: number}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // AI State
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = async (query: string = domain) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setResults([]);

    try {
      await new Promise(resolve => setTimeout(resolve, 800)); 

      const base = query.split('.')[0].toLowerCase().replace(/[^a-z0-9-]/g, '');
      const tlds = ['com', 'studio', 'agency', 'art', 'fashion', 'model'];
      
      const mockData = tlds.map(tld => ({
        domain: `${base}.${tld}`,
        available: Math.random() > 0.3,
        price: tld === 'com' ? 12.00 : tld === 'studio' ? 24.00 : 10.00
      })).sort((a, b) => (Number(b.available) - Number(a.available)));

      setResults(mockData);
    } catch (err) {
      setError('Could not verify availability.');
    } finally {
      setLoading(false);
    }
  };

  const handleAiSuggest = async () => {
    if (!user) {
      toast.error("Please login to use AI suggestions based on your profile.");
      return;
    }

    setIsAiLoading(true);
    setAiSuggestions([]);
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    try {
      // 1. Fetch Profile & Shoots Data
      // Parallel fetch for speed
      const [profileRes, shootsRes] = await Promise.all([
         getProfile({ uid: user.id }),
         getShootsForPortfolio({ uid: user.id }) // Uses user.id as portfolio uid per data-supabase
      ]);

      const profile = profileRes.data.profiles[0] || {};
      const shoots = shootsRes.data.shoots || [];

      // 2. Infer Aesthetic from Shoots
      // Collect all vibe tags, count frequency
      const vibeCounts: Record<string, number> = {};
      shoots.forEach(shoot => {
          shoot.vibes.forEach((vibe: string) => {
              const v = vibe.trim();
              if (v) vibeCounts[v] = (vibeCounts[v] || 0) + 1;
          });
      });
      
      // Get top 3 vibes
      const topVibes = Object.entries(vibeCounts)
          .sort((a, b) => b[1] - a[1]) // Descending count
          .slice(0, 3)
          .map(([vibe]) => vibe)
          .join(', ');

      const inferredAesthetic = topVibes || 'Editorial'; // Fallback if no shoots
      
      // 3. Call AI API
      const res = await fetch('/api/suggest-domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          aesthetic: inferredAesthetic, 
          description: profile.description,
          careerGoals: profile.careerGoals,
          profile: profile || {},
          shoots 
        }),
        signal: controller.signal
      });

      if (!res.ok) throw new Error("AI Request Failed");
      
      const { suggestions } = await res.json();
      setAiSuggestions(suggestions);
      toast.success(`Generated ideas based on your ${inferredAesthetic} style`);

    } catch (err: any) {
      if (err.name === 'AbortError') {
          console.log("Domain suggestion aborted");
      } else {
          console.error('AI Suggest Error:', err);
          toast.error("Failed to generate suggestions.");
      }
    } finally {
      setIsAiLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopAI = () => {
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
        setIsAiLoading(false);
    }
  };

  const handleSelect = (domainName: string) => {
    alert(`Domain selected: ${domainName}`);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white flex flex-col">
      <nav className="relative z-50 p-8 flex justify-between items-center animate-in fade-in slide-in-from-top-4 duration-700">
        <Link href="/" className="hover:opacity-70 transition-opacity">
           <BrandIcon size={32} />
        </Link>
        <Link href="/" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
          Return to Studio
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-8 -mt-20">
        <div className="w-full max-w-xl text-center space-y-8 animate-in fade-in zoom-in-95 duration-1000">
          
          <div className="space-y-4">
             <h1 className="text-5xl md:text-6xl font-serif text-black tracking-tight">
               Claim your <span className="italic text-zinc-400">digital</span> signature.
             </h1>
             <p className="text-zinc-500 font-light text-lg">
               Secure a custom domain to professionalize your portfolio.
             </p>
          </div>

          {/* Search Input */}
          <div className="relative group max-w-md mx-auto">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(domain)}
              placeholder="yourname.com"
              className="w-full bg-transparent border-b border-zinc-200 text-center text-3xl font-serif py-4 focus:outline-none focus:border-black transition-colors placeholder:text-zinc-200"
              autoFocus
            />
            <button
               onClick={() => handleSearch(domain)}
               disabled={loading || !domain}
               className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black disabled:opacity-0 transition-all"
            >
               Search
            </button>
          </div>

          {/* AI Suggestion Button - Initial State */}
          {user && !isAiLoading && aiSuggestions.length === 0 && (
             <button 
                onClick={handleAiSuggest}
                className="group flex items-center justify-center space-x-2 mx-auto text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 transition-all"
             >
                <Sparkles className="w-3 h-3 group-hover:text-purple-400" />
                <span>Ask AI for Ideas</span>
             </button>
          )}

          {/* AI Loading */}
          {isAiLoading && (
             <div className="flex items-center justify-center space-x-2 text-zinc-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-bold uppercase tracking-widest">Consulting Brand Expert...</span>
             </div>
          )}

          {/* AI Results */}
          {aiSuggestions.length > 0 && (
             <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-6 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-transparent rounded-bl-full opacity-50" />
                
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center justify-center space-x-2">
                   <Sparkles className="w-3 h-3 text-purple-400" />
                   <span>Curated For You</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                   {aiSuggestions.map((sug) => (
                      <button
                         key={sug}
                         onClick={() => { setDomain(sug); handleSearch(sug); }}
                         className="p-3 bg-white border border-zinc-100 rounded-lg hover:border-black hover:shadow-md transition-all text-left"
                      >
                         <span className="font-serif text-lg">{sug}</span>
                      </button>
                   ))}
                </div>

                {/* Re-Ask AI Button */}
                {isAiLoading ? (
                <button 
                  onClick={handleStopAI}
                  className="px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-red-100 transition-all"
                >
                  <Square size={14} fill="currentColor" /> Stop AI Generator
                </button>
              ) : (
                <button 
                  onClick={handleAiSuggest}
                  className="px-6 py-3 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-purple-100 transition-all shadow-lg shadow-purple-500/10"
                >
                  <Sparkles size={14} /> Generate Custom Ideas
                </button>
              )}
             </div>
          )}

          {/* Standard Loading */}
          {loading && !isAiLoading && (
             <div className="py-12 flex justify-center">
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce mx-2 [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
             </div>
          )}

          {/* Search Results */}
          {!loading && hasSearched && results.length > 0 && (
             <div className="mt-8 space-y-2 text-left animate-in slide-in-from-bottom-8 fade-in duration-700">
                <p className="text-xs uppercase font-bold text-zinc-300 tracking-widest mb-6 text-center">Availability</p>
                
                <div className="rounded-2xl p-2 border border-zinc-100 overflow-hidden">
                   {results.map((r, i) => (
                      <div 
                        key={r.domain}
                        className="group flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl hover:bg-zinc-50 transition-all duration-300"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                         <span className={`text-xl font-serif ${r.available ? 'text-black' : 'text-zinc-300 decoration-zinc-300 line-through'}`}>
                              {r.domain}
                         </span>

                         <div className="flex items-center justify-between md:justify-end space-x-6 mt-2 md:mt-0 w-full md:w-auto">
                            {r.available ? (
                              <>
                                <span className="text-sm text-zinc-500">${r.price}/yr</span>
                                <button 
                                  onClick={() => handleSelect(r.domain)}
                                  className="bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-2 rounded-full hover:bg-zinc-800 transition-transform active:scale-95"
                                >
                                  Claim
                                </button>
                              </>
                            ) : (
                               <span className="text-xs font-bold uppercase tracking-widest text-zinc-300 px-6 py-2">
                                 Taken
                               </span>
                            )}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      </main>
      
      <footer className="p-8 text-center text-zinc-300 text-[10px] uppercase tracking-widest">
         Pose & Poise &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

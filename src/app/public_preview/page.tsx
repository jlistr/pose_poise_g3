'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore'; // Keep for now if legacy fallback needed, or remove
import { db } from '@/lib/firebase';
import { getPortfolio, getShootsForPortfolio, getProfile, getProfileByInstagram } from '@/lib/data-supabase';
import { PortfolioRenderer, PortfolioSettings } from '@/components/portfolio/PortfolioRenderer';
import { Shoot, Profile } from '@/types';
import { BrandIcon } from '@/components/ui/BrandIcon';

const APP_ID = 'pose-poise-v1';

function PublicPreview() { // Renamed from PublicPreviewContent
  const [shoots, setShoots] = useState<Shoot[]>([]);
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [portfolioName, setPortfolioName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const userId = searchParams.get('userid');
      const portfolioId = searchParams.get('portfolioid');
      const username = searchParams.get('username');

      if (!userId && !portfolioId && !username) {
        setError('Missing parameters');
        setLoading(false);
        return;
      }

      try {
        let dcUid = userId;
        let dcPortId = portfolioId;
        
        // Resolve Username to UID if needed
        if (!dcUid && !dcPortId && username) {
            console.log("Resolving username:", username);
            const userRes = await getProfileByInstagram({ handle: username });
            if (userRes.data.profiles.length > 0) {
                dcUid = userRes.data.profiles[0].uid;
                console.log("Resolved to UID:", dcUid);
            } else {
                throw new Error("User not found via handle");
            }
        }

        if (!dcUid && !dcPortId) throw new Error("No ID provided");

        // 1. Fetch Portfolio first to resolve identity if using portId
        const portQuery = dcPortId ? { id: dcPortId } : { uid: dcUid! };
        const portfolioRes = await getPortfolio(portQuery);
        
        if (portfolioRes.data.portfolios.length === 0) {
             throw new Error("Portfolio not found");
        }

        const p = portfolioRes.data.portfolios[0];
        const resolvedUid = p.uid;
        
        // Process Portfolio Settings
        if (p.settings) {
            try {
                setSettings(JSON.parse(p.settings));
            } catch (e) { console.error("Settings parse error", e); }
        }

        // 2. Parallel fetch Shoots and Profile using resolved UID
        const [shootsRes, profileRes] = await Promise.all([
             getShootsForPortfolio({ uid: resolvedUid }),
             getProfile({ uid: resolvedUid })
        ]);

        // Process Shoots
        if (shootsRes.data.shoots.length > 0) {
             setShoots(shootsRes.data.shoots as any);
        }

        // Process Profile
        if (profileRes.data.profiles.length > 0) {
            const prof = profileRes.data.profiles[0];
            setProfile(prof as any);
            setPortfolioName(prof.name);
        } else {
             setPortfolioName("Professional Portfolio");
        }

      } catch (err) {
        console.error(err);
        setError('Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-serif text-2xl animate-pulse">
         <div className="text-center">
            <BrandIcon size={48} className="mx-auto mb-6 opacity-20" />
            <p className="tracking-widest text-xs uppercase font-bold text-zinc-400">Loading Preview...</p>
         </div>
      </div>
    );
  }

  if (error || (!shoots.length && !settings)) {
    return (
      <div className="min-h-screen flex items-center justify-center font-serif text-2xl text-zinc-400">
         {error || 'Not Found'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white pb-24">
       <div className="text-center pt-12 mb-8">
          <BrandIcon size={32} className="mx-auto mb-4" />
          {portfolioName && (
             <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">{portfolioName}</p>
          )}

          {profile?.instagram && (
             <a 
               href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
               target="_blank"
               rel="noopener noreferrer"
               className="mt-6 inline-flex items-center space-x-2 px-8 py-3 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-black/5"
             >
               <span>Inquire for Collaborations</span>
             </a>
          )}
       </div>
       <div className="px-8">
          <PortfolioRenderer
             shoots={shoots}
             settings={settings || { layout: 'grid', showHero: true, groupByCollection: false }}
             isPublicView={true}
             profile={profile}
          />
       </div>
    </div>
  );
}

export default function PublicPreviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PublicPreview />
    </Suspense>
  );
}

'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore'; // Keep for now if legacy fallback needed, or remove
import { db, dataConnect } from '@/lib/firebase';
import { getPortfolio, getShootsForPortfolio, getProfile } from '@/dataconnect-generated';
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

      if (!userId && !portfolioId) {
        setError('Missing parameters');
        setLoading(false);
        return;
      }

      try {
        let dcUid = userId || portfolioId;
        
        // Use Data Connect SDK
        // We assume fetching by UID works for now as the portfolioId implies the user's portfolio.
        // If public viewing requires a distinct check, we might need a specific 'getPublicPortfolio' query later.
        // For now, standard getter works if rules allow or if we are in an emulator environment/testing.
        
        if (!dcUid) throw new Error("No ID provided");

        // Parallel fetch from Data Connect
        const [portfolioRes, shootsRes, profileRes] = await Promise.all([
             getPortfolio(dataConnect, { uid: dcUid }),
             getShootsForPortfolio(dataConnect, { uid: dcUid }),
             getProfile(dataConnect, { uid: dcUid })
        ]);

        // Process Portfolio Settings
        if (portfolioRes.data.portfolios.length > 0) {
            const p = portfolioRes.data.portfolios[0];
            if (p.settings) {
                try {
                    setSettings(JSON.parse(p.settings));
                } catch (e) { console.error("Settings parse error", e); }
            }
        } 

        // Process Shoots
        if (shootsRes.data.shoots.length > 0) {
            console.log("PublicPreview: Shoots raw data:", JSON.stringify(shootsRes.data.shoots, null, 2));
            const mappedShoots = shootsRes.data.shoots.map(s => {
                const allShootImages = (s.shootImages_on_shoot as any[] || []).sort((a,b) => a.order - b.order);
                const imgUrls = allShootImages.map(i => i.image?.url).filter(Boolean);
                const hiddenUrls = allShootImages.filter(i => i.isVisible === false).map(i => i.image?.url).filter(Boolean);
                
                console.log(`PublicPreview: Shoot ${s.name} has ${imgUrls.length} total, ${hiddenUrls.length} hidden`);
                
                return {
                    id: s.id,
                    name: s.name,
                    vibes: s.vibes ? s.vibes.split(',').filter(Boolean) : [],
                    photographer: s.photographer || '',
                    studio: s.studio || '',
                    images: imgUrls,
                    hiddenImages: hiddenUrls
                };
            });
            setShoots(mappedShoots);
        } else {
            console.log("PublicPreview: No shoots found for UID:", dcUid);
        }

        // Process Profile (for Name)
        if (profileRes.data.profiles.length > 0) {
            const p = profileRes.data.profiles[0];
            setProfile(p as any); // Cast to match UI type if slight mismatch
            setPortfolioName(p.name);
        } else {
             setPortfolioName("Professional Portfolio");
        }

        if (portfolioRes.data.portfolios.length === 0 && shootsRes.data.shoots.length === 0) {
             setError("Portfolio not found");
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
             <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Portfolio: {portfolioName}</p>
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

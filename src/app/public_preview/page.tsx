'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PortfolioRenderer, PortfolioSettings } from '@/components/portfolio/PortfolioRenderer';
import { Shoot, Profile } from '@/types';
import { BrandIcon } from '@/components/ui/BrandIcon';

const APP_ID = 'pose-poise-v1'; // Updated APP_ID to match the new hardcoded value in the fetch logic

function PublicPreview() { // Renamed from PublicPreviewContent
  const [shoots, setShoots] = useState<Shoot[]>([]);
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
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
        let pSnap;
        let uid = userId || portfolioId; // Determine UID context

        if (userId) {
           const docRef = doc(db, 'artifacts', APP_ID, 'users', userId, 'portfolio', 'data');
           pSnap = await getDoc(docRef);
        } else if (portfolioId) {
           const docRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'portfolios', portfolioId);
           pSnap = await getDoc(docRef);
           // If public record, we might need to get the original UID if it's stored, or fetch profile from public record
           // For now assume portfolioId IS the uid for public access or structured similarly
           
           // Actually, if we use portfolioId as the doc ID in 'public/data/portfolios', the data inside should contain the portfolio.
           // Does it contain the user ID to fetch the profile?
           // The current saving logic in page.tsx saves to `users/{uid}/portfolio/data`.
           // It does NOT save to a 'public' collection yet in this codebase (it handles isPublic flag).
           // So for now, we assume public preview is accessing via ?uid=...
           // If the code supports 'portfolioid', it implies a separate tailored ID.
           // Let's stick to 'uid' primarily as per previous logic which I removed.
           // Wait, previous code had `const userId = searchParams.get('userid');`
           
           if (!userId) uid = portfolioId; 
        }

        if (pSnap && pSnap.exists()) {
           const data = pSnap.data();
           setShoots(data.shoots || []);
           setSettings(data.settings || null);
           
           // If we have a UID, fetch profile
           if (uid) {
             const profileRef = doc(db, 'users', uid as string, 'profile', 'data');
             const profileSnap = await getDoc(profileRef);
             if (profileSnap.exists()) {
                setProfile(profileSnap.data() as Profile);
             } else {
                // Legacy path check
                const legacyRef = doc(db, 'artifacts', APP_ID, 'users', uid as string, 'settings', 'profile');
                const legacySnap = await getDoc(legacyRef);
                if (legacySnap.exists()) setProfile(legacySnap.data() as Profile);
             }
           }
        } else {
           setError('Portfolio not found');
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
          {profile?.name && (
             <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Portfolio: {profile.name}</p>
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

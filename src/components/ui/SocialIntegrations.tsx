import React, { useState, useEffect } from 'react';
import { Instagram, Music2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'; // Music2 for TikTok-ish icon
import { httpsCallable } from 'firebase/functions';
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { functions, db } from '@/lib/firebase';
import { SocialStats } from '@/types';

interface SocialIntegrationsProps {
  uid: string;
}

interface ConnectionData {
  platform: 'instagram' | 'tiktok';
  profileId: string;
  username?: string;
  connectedAt: number;
}

export const SocialIntegrations: React.FC<SocialIntegrationsProps> = ({ uid }) => {
  const [connections, setConnections] = useState<Record<string, ConnectionData>>({});
  const [stats, setStats] = useState<Record<string, SocialStats>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  // Load existing connections
  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(doc(db, 'users', uid, 'social_connections', 'data'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setConnections(data as Record<string, ConnectionData>);
        
        // If we have connections, try to fetch fresh stats for them
        Object.values(data).forEach((conn: any) => {
           fetchStats(conn.platform, conn.profileId);
        });
      }
    });
    return () => unsub();
  }, [uid]);

  const fetchStats = async (platform: string, profileId: string) => {
    try {
      setLoading(prev => ({ ...prev, [platform]: true }));
      const getConnectedProfile = httpsCallable(functions, 'getConnectedProfile');
      
      const result = await getConnectedProfile({ profileId });
      const data = result.data as any; // Using explicit any for Cloud Function result

      if (data.success) {
        setStats(prev => ({ 
           ...prev, 
           [platform]: {
              followers: data.stats.followers,
              following: data.stats.following,
              username: data.username,
              platform: data.platform,
              avatarUrl: data.avatarUrl
           }
        }));
      }
    } catch (err) {
      console.error(`Failed to fetch stats for ${platform}`, err);
    } finally {
      setLoading(prev => ({ ...prev, [platform]: false }));
    }
  };

  const handleConnect = async (platform: 'instagram' | 'tiktok') => {
    setLoading(prev => ({ ...prev, [platform]: true }));
    setError(null);

    try {
      // SIMULATED OAUTH FLOW
      // In production, this would redirect to an OAuth URL, and the callback
      // would handle saving the profileId. 
      // Here we just simulate getting a profileId from the "provider".
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Fake network delay
      
      // Mock IDs that might work with the user's test setup, or random ones
      // Since we don't have real Keys, the Cloud Function might fail unless mocked there too.
      // But we will proceed as if we got a valid ID.
      const mockProfileId = platform === 'instagram' ? 'insta_12345' : 'tt_67890';
      const mockUsername = platform === 'instagram' ? '@jbananadancer' : '@janadance';

      const newConnection: ConnectionData = {
        platform,
        profileId: mockProfileId,
        username: mockUsername,
        connectedAt: Date.now()
      };

      // Save to Firestore
      await setDoc(doc(db, 'users', uid, 'social_connections', 'data'), {
        [platform]: newConnection
      }, { merge: true });

      // After saving, fetch stats (which might fail if Cloud Function keys aren't real, but UI should handle it)
      await fetchStats(platform, mockProfileId);

    } catch (err) {
      console.error("Connection failed", err);
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, [platform]: false }));
    }
  };

  const SocialButton = ({ platform, icon: Icon, label }: { platform: 'instagram' | 'tiktok', icon: any, label: string }) => {
    const isConnected = !!connections[platform];
    const isLoading = loading[platform];
    const statData = stats[platform];

    return (
      <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 flex items-center justify-between group hover:border-zinc-200 transition-all">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isConnected ? 'bg-black text-white' : 'bg-zinc-200 text-zinc-400'}`}>
            <Icon size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wide">{label}</h4>
            {isConnected ? (
               <div className="flex items-center gap-2">
                 <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                   <CheckCircle2 size={10} /> Connected
                 </span>
                 <span className="text-xs text-zinc-400">
                    {statData?.username || connections[platform]?.username}
                 </span>
               </div>
            ) : (
               <p className="text-xs text-zinc-400">Not connected</p>
            )}
          </div>
        </div>

        {isConnected && statData ? (
           <div className="text-right">
              <span className="block font-serif text-xl font-bold">{statData.followers.toLocaleString()}</span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Followers</span>
           </div>
        ) : (
           <button 
             onClick={(e) => { e.preventDefault(); handleConnect(platform); }}
             disabled={isConnected || isLoading}
             className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
               ${isConnected 
                 ? 'bg-transparent text-zinc-400 cursor-default' 
                 : 'bg-white border border-zinc-200 hover:bg-black hover:text-white hover:border-black shadow-sm'
               }
             `}
           >
             {isLoading ? <Loader2 size={14} className="animate-spin" /> : isConnected ? 'Linked' : 'Connect'}
           </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
       <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
          Social Integrations
       </h4>
       
       <div className="grid grid-cols-1 gap-4">
          <SocialButton platform="instagram" icon={Instagram} label="Instagram" />
          <SocialButton platform="tiktok" icon={Music2} label="TikTok" />
       </div>

       {error && (
         <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg">
            <AlertCircle size={14} />
            {error}
         </div>
       )}
    </div>
  );
};

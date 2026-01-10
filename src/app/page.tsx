'use client';

import React, { useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, onSnapshot, addDoc, deleteDoc } from 'firebase/firestore';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { Login } from '@/components/auth/Login';
import { Landing } from '@/components/dashboard/Landing';
import { AestheticSelector } from '@/components/wizard/AestheticSelector';
import { ProfileForm } from '@/components/wizard/ProfileForm';
import { ImageSelector } from '@/components/wizard/ImageSelector';
import { PortfolioBuilder } from '@/components/wizard/PortfolioBuilder';
import { CardPreview } from '@/components/card/CardPreview';
import { PublicCardView } from '@/components/public/PublicCardView';
import { PortfolioEditor } from '@/components/portfolio/PortfolioEditor';
import { PortfolioRenderer, PortfolioSettings } from '@/components/portfolio/PortfolioRenderer';
import { MetadataUploadModal } from '@/components/ui/MetadataUploadModal';
import { ProfileModal } from '@/components/ui/ProfileModal';

import { auth, db } from '@/lib/firebase';
import { compressImageForCloud, sleep, copyToClipboard } from '@/lib/utils';
import { Profile, ImageItem, Shoot, CardData } from '@/types';

// Constants
const APP_ID = 'pose-and-poise';

const DEFAULT_PROFILE: Profile = {
  name: 'Jana Elise Lister', height: "5'10", bust: '33B', waist: '27', hips: '33', 
  shoeSize: '9.5"', hairColor: 'Dirty Blonde', eyeColor: 'Blue/Grey', instagram: '@jbananadancer'
};

export default function Home() {
  // --- State ---
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [sessionUsername, setSessionUsername] = useState<string | null>(null);
  const [step, setStep] = useState(-1); 
  const [mode, setMode] = useState<'card' | 'portfolio' | null>(null); 
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'png' | null>(null);
  const [exportStatus, setExportStatus] = useState<string>("");

  // Upload Interception State
  const [uploadQueue, setUploadQueue] = useState<{ files: File[], context: 'library' | 'shoot', shootId?: string | number } | null>(null);

  // Data State
  const [images, setImages] = useState<ImageItem[]>([]); 
  const [shoots, setShoots] = useState<Shoot[]>([{ id: 1, name: 'Main Shoot', images: [] }]); 
  const [library, setLibrary] = useState<ImageItem[]>([]); 
  const [savedCards, setSavedCards] = useState<CardData[]>([]); 
  
  // Selection State
  const [selectedAesthetic, setSelectedAesthetic] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [currentCardId, setCurrentCardId] = useState<string | null>(null);
  
  // Public View State
  const [publicCard, setPublicCard] = useState<CardData | null>(null);
  const [publicPortfolio, setPublicPortfolio] = useState<{ settings: PortfolioSettings, shoots: Shoot[], username: string } | null>(null);
  const [isPublicLoading, setIsPublicLoading] = useState(false);

  // Profile Modal State
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // --- Effects ---
  const [portfolioSettings, setPortfolioSettings] = useState<PortfolioSettings | undefined>(undefined);
  const [isPortfolioPublic, setIsPortfolioPublic] = useState(false);
  const [portfolioId, setPortfolioId] = useState<string | null>(null);

  // --- handlers ---

  const handleLogin = async (username: string) => {
    try {
      await signInAnonymously(auth);
      setSessionUsername(username);
      setStep(0);
    } catch (err) {
      console.error("Login failed", err);
      alert("Connection failed");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setSessionUsername(null);
    setStep(-1);
    setImages([]);
    setLibrary([]);
    setSavedCards([]);
  };

  const saveToLibrary = async (base64: string, metadata: Partial<ImageItem> = {}) => {
    if (!user) return;
    try {
      const compressed = await compressImageForCloud(base64);
      const libraryRef = collection(db, 'artifacts', APP_ID, 'users', user.uid, 'library');
      await addDoc(libraryRef, { url: compressed, timestamp: Date.now(), ...metadata });
    } catch (err) {
      console.error("Library save error:", err);
    }
  };

  const deleteFromLibrary = async (docId: string | number) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'library', String(docId)));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // --- Actions ---

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadQueue({ 
        files: Array.from(e.target.files), 
        context: 'library' 
      });
      // Reset input
      e.target.value = ''; 
    }
  };
  
  // Specific handler for ImageSelector in Wizard (mix of library and new uploads)
  const handleWizardFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const url = reader.result as string;
        // Add to local selection immediately
        setImages(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), url }]);
        // Also save to library
        await saveToLibrary(url);
      };
      reader.readAsDataURL(file);
    });
  };

  const saveProfile = async (newProfile: Profile) => {
    if (!user) return;
    try {
      setProfile(newProfile);
      await setDoc(doc(db, 'users', user.uid, 'profile', 'data'), newProfile);
      setIsProfileOpen(false);
    } catch (err) {
      console.error("Profile save error:", err);
    }
  };

  const deleteCard = async (docId: string) => {
     if (!user) return;
     try {
        await deleteDoc(doc(db, 'users', user.uid, 'cards', docId));
     } catch (err) {
        console.error("Error deleting card:", err);
     }
  };

  const runAnalysis = async () => {
    setStep(5); // Loading state
    await sleep(2000);
    if (mode === 'portfolio') {
      setStep(7); // Portfolio Output
    } else {
      setStep(6); // Card Output
    }
  };

  const handleMetadataConfirm = async (metadata: Partial<ImageItem>) => {
    if (!uploadQueue) return;

    const { files, context, shootId } = uploadQueue;
    
    // Process uploads
    files.forEach(file => {
       const reader = new FileReader();
       reader.onloadend = async () => {
          const url = reader.result as string;
          
          if (context === 'shoot' && shootId) {
             // Add to portfolio shoot
             setShoots(prev => prev.map(s => s.id === shootId ? { ...s, images: [...s.images, url] } : s));
             
             // Also save to library with metadata for future use
             // Note: In a real app we'd upload to cloud storage here and get a URL
             await saveToLibrary(url, metadata);
          } else {
             // Library upload
             await saveToLibrary(url, metadata);
          }
       };
       reader.readAsDataURL(file);
    });

    setUploadQueue(null);
  };

  const handleAddShoot = () => {
    setShoots(prev => [...prev, { id: Date.now(), name: 'New Set', images: [] }]);
  };

  const handleShootUpload = (shootId: string | number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
       setUploadQueue({
          files: Array.from(e.target.files).slice(0, 4), 
          context: 'shoot',
          shootId
       });
       e.target.value = '';
    }
  };
 
  const handleUpdateShootName = (shootId: string | number, name: string) => {
    setShoots(prev => prev.map(s => {
      if (s.id === shootId) return { ...s, name };
      return s;
    }));
  };
  
  const handleUpdateShootMeta = (shootId: string | number, field: keyof Shoot, value: string) => {
    setShoots(prev => prev.map(s => {
      if (s.id === shootId) return { ...s, [field]: value };
      return s;
    }));
  };
  
  const handleRemoveImageFromShoot = (shootId: string | number, index: number) => {
    setShoots(prev => prev.map(s => {
      if (s.id === shootId) {
        const newImages = [...s.images];
        newImages.splice(index, 1);
        return { ...s, images: newImages };
      }
      return s;
    }));
  };

  const handleSaveCard = async (frontLayout: string, backLayout: string) => {
    if (!user || images.length < 1) return;
    
    try {
      // Compress selected images for the card record
      const compressedImageUrls = await Promise.all(
        images.map(img => compressImageForCloud(img.url))
      );

      const cardData: CardData = {
        profile,
        images: compressedImageUrls,
        aesthetic: selectedAesthetic || 'editorial',
        frontLayout: frontLayout as any,
        backLayout: backLayout as any,
        timestamp: Date.now(),
        modelId: sessionUsername || 'unknown'
      };

      const userCardRef = doc(collection(db, 'artifacts', APP_ID, 'users', user.uid, 'compositeCards'));
      await setDoc(userCardRef, cardData);
      
      // Also save to public collection for sharing
      await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'compositeCards', userCardRef.id), cardData);
      
      setCurrentCardId(userCardRef.id);
      alert("Card Saved Successfully!");
      setCurrentCardId(userCardRef.id);
      alert("Card Saved Successfully!");
    } catch (err) {
      console.error(err);
      alert("Save failed.");
    }
  };

  const handlePortfolioUpdate = async (settings: PortfolioSettings) => {
    if (!user) return;
    try {
       // Save settings
       const portfolioRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'portfolio', 'data');
       await setDoc(portfolioRef, { 
         settings, 
         shoots, // Save the shoot data here too for persistence
         updatedAt: Date.now() 
       }, { merge: true });
       
       setPortfolioSettings(settings);
       
       // If public, update public record too
       if (isPortfolioPublic && portfolioId) {
          const publicRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'portfolios', portfolioId);
          await setDoc(publicRef, { settings, shoots, username: sessionUsername, outdated: false }, { merge: true });
       }

       // Ensure we have a persistent ID locally if first time
       if (!portfolioId) {
          // Typically we might use user.uid as ID or a random one. Let's use user.uid for simplicity 1:1
          setPortfolioId(user.uid);
       }
    } catch (err) {
       console.error("Portfolio Update Error", err);
       alert("Failed to update portfolio.");
    }
  };

  const handlePortfolioPublish = async (isPublic: boolean) => {
     if (!user) return;
     try {
        const publicRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'portfolio', 'meta');
        await setDoc(publicRef, { isPublic }, { merge: true });
        
        // Also update the public collection
        if (isPublic) {
           const publicId = portfolioId || user.uid;
           setPortfolioId(publicId);
           await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'portfolios', publicId), {
              username: sessionUsername,
              shoots,
              settings: portfolioSettings,
              active: true
           });
        } else if (portfolioId) {
           // If unpublishing, maybe delete or mark inactive in public
           await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'portfolios', portfolioId));
        }

        setIsPortfolioPublic(isPublic);
     } catch (err) {
        console.error("Publish Error", err);
        alert("Failed to change publish status.");
     }
  };

  // --- Effects ---
  useEffect(() => {
    // Load jspdf (optional, could be dynamic import in component)
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      // Check for public card ID in URL
      const params = new URLSearchParams(window.location.search);
      const cardId = params.get('cardId');
      const pId = params.get('portfolioId');
      
      if (cardId) {
        setStep(100); // Public Card View
        setIsPublicLoading(true);
        try {
          const docRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'compositeCards', cardId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setPublicCard(docSnap.data() as CardData);
        } catch (err) { console.error(err); } finally { setIsPublicLoading(false); }
      } else if (pId) {
        setStep(101); // Public Portfolio View
        setIsPublicLoading(true);
        try {
           const docRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'portfolios', pId);
           const docSnap = await getDoc(docRef);
           if (docSnap.exists()) {
              setPublicPortfolio(docSnap.data() as any);
           }
        } catch (err) { console.error(err); } finally { setIsPublicLoading(false); }
      } else {
        // Normal Flow
        onAuthStateChanged(auth, (u) => {
          setUser(u);
          if (!u && step !== 100 && step !== 101) setStep(-1);
        });
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    // Load Profile
    const loadProfile = async () => {
      // Trying persistent path first
      let profileRef = doc(db, 'users', user.uid, 'profile', 'data');
      let snap = await getDoc(profileRef);
      
      if (!snap.exists()) {
          // Fallback or create default? 
          // For now just don't set it, or set default.
          // Check if artifacts path was used previously (migrating)
          const legacyRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'settings', 'profile');
          const legacySnap = await getDoc(legacyRef);
          if (legacySnap.exists()) {
             setProfile(legacySnap.data() as Profile);
             return;
          }
      } else {
          setProfile(snap.data() as Profile);
      }
    };
    loadProfile();

    const unsubCards = onSnapshot(collection(db, 'artifacts', APP_ID, 'users', user.uid, 'compositeCards'), (snapshot) => {
      setSavedCards(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CardData)));
    });

    const unsubLibrary = onSnapshot(collection(db, 'artifacts', APP_ID, 'users', user.uid, 'library'), (snapshot) => {
      setLibrary(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ImageItem)));
    });

    // Load Portfolio Data
    const loadPortfolio = async () => {
       const pDataRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'portfolio', 'data');
       const pMetaRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'portfolio', 'meta');
       
       const pDataSnap = await getDoc(pDataRef);
       if (pDataSnap.exists()) {
          const data = pDataSnap.data();
          if (data.settings) setPortfolioSettings(data.settings);
          if (data.shoots) setShoots(data.shoots);
          setPortfolioId(user.uid); 
       }

       const pMetaSnap = await getDoc(pMetaRef);
       if (pMetaSnap.exists()) {
          setIsPortfolioPublic(pMetaSnap.data().isPublic || false);
       }
    };
    loadPortfolio();

    return () => {
      unsubCards();
      unsubLibrary();
    };
  }, [user]);

  // --- Rendering ---

  if (step === 100) {
    if (isPublicLoading) return <div className="min-h-screen flex items-center justify-center font-serif text-2xl animate-pulse">Retrieving identity...</div>;
    if (!publicCard) return <div className="min-h-screen flex items-center justify-center font-serif text-2xl">Identity not found.</div>;
    return <PublicCardView card={publicCard} />;
  }

  if (step === 101) {
    if (isPublicLoading) return <div className="min-h-screen flex items-center justify-center font-serif text-2xl animate-pulse">Loading portfolio...</div>;
    if (!publicPortfolio) return <div className="min-h-screen flex items-center justify-center font-serif text-2xl">Portfolio not found.</div>;
    return (
       <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
          <div className="text-center pt-12">
             <BrandIcon size={32} className="mx-auto mb-4" />
             <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Portfolio: {publicPortfolio.username}</p>
          </div>
          <div className="px-8 pb-12">
             <PortfolioRenderer 
                shoots={publicPortfolio.shoots} 
                settings={publicPortfolio.settings}
                isPublicView={true}
             />
          </div>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white antialiased">
      <nav className="p-8 flex justify-between items-center border-b border-zinc-50 relative z-20">
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setStep(0)}>
          <BrandIcon size={28} />
          <span className="font-serif tracking-[0.3em] text-sm uppercase font-bold">Pose & Poise</span>
        </div>
        {user && sessionUsername && (
          <button onClick={handleLogout} className="text-[10px] font-bold uppercase bg-zinc-50 px-6 py-3 rounded-full hover:bg-black hover:text-white transition-all flex items-center shadow-sm">
            Sign Out
          </button>
        )}
      </nav>
      
      <main className="container mx-auto px-8 py-12 relative z-10">
        {uploadQueue && (
           <MetadataUploadModal 
              files={uploadQueue.files}
              onConfirm={handleMetadataConfirm}
              onCancel={() => setUploadQueue(null)}
           />
        )}
        
        {isProfileOpen && (
           <ProfileModal 
              initialProfile={profile}
              onSave={saveProfile}
              onClose={() => setIsProfileOpen(false)}
           />
        )}

        {step === -1 && <Login onLogin={handleLogin} />}
        
        {step === 0 && (
          <Landing 
            username={sessionUsername || ''} 
            library={library} 
            savedCards={savedCards}
            portfolioId={portfolioId}
            onNavigate={(m) => { setMode(m); setStep(1); }}
            onFileUpload={handleFileUpload}
            onDeleteAsset={deleteFromLibrary}
            onOpenCard={(card) => {
              setProfile(card.profile);
              setImages((card.images || []).map(url => ({ id: Math.random(), url })));
              setSelectedAesthetic(card.aesthetic);
              setCurrentCardId(card.id || null);
              setMode('card');
              setStep(6);
            }}
            onViewCard={(card) => {
               setPublicCard(card);
               setStep(100); // Simulate public view mode
            }}
            onEditProfile={() => setIsProfileOpen(true)}
            onOpenPortfolio={async () => {
               // Smart Entry: Check if we have shoots/settings via DB
               setMode('portfolio');
               if (!user) return; // Should not happen if on landing

               try {
                   const portfolioRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'portfolio', 'data');
                   const snap = await getDoc(portfolioRef);

                   if (snap.exists() && snap.data().shoots?.length > 0) {
                       // Existing Portfolio -> Editor
                       // Update local state to ensure sync
                       const data = snap.data();
                       if (data.shoots) setShoots(data.shoots);
                       if (data.settings) setPortfolioSettings(data.settings);
                       setStep(7);
                   } else {
                       // New Portfolio logic
                       // Hydrate from library if we have assets
                       // Always check library even if shoots initialized to default empty
                       if (library.length > 0) {
                          setShoots(prev => {
                             // Check if we have a single empty "New Set"
                             const isDefaultEmpty = prev.length === 1 && prev[0].images.length === 0;
                             if (isDefaultEmpty || prev.length === 0) {
                                return [{ 
                                   id: Date.now(), 
                                   name: 'Main Shoot', 
                                   images: library.map(i => i.url),
                                   vibe: 'Portfolio',
                                   photographer: '',
                                   studio: '' 
                                }];
                             }
                             return prev;
                          });
                       }
                       setStep(3); // Go to Builder
                   }
               } catch (e) {
                   console.error("Navigation Error", e);
                   // Fallback to builder on error
                   setStep(3);
               }
            }}
          />
        )}
        
        {step === 1 && (
          <AestheticSelector 
            selectedId={selectedAesthetic} 
            onSelect={setSelectedAesthetic} 
            onNext={() => setStep(mode === 'card' ? 2 : 3)} 
          />
        )}
        
        {step === 2 && (
          <ProfileForm 
            profile={profile} 
            onChange={(f, v) => setProfile(p => ({ ...p, [f]: v }))} 
            onBack={() => setStep(1)} 
            onNext={async () => { 
                if (profile) await saveProfile(profile); 
                setStep(3); 
            }} 
          />
        )}
        
        {step === 3 && mode === 'card' && (
          <ImageSelector 
            library={library} 
            selectedImages={images} 
            onToggleImage={(img) => {
              const exists = images.some(i => i.url === img.url);
              if (exists) setImages(images.filter(i => i.url !== img.url));
              else setImages([...images, { id: Math.random(), url: img.url }]);
            }}
            onRemoveSelected={(id) => setImages(images.filter(i => i.id !== id))}
            onFileUpload={handleWizardFileUpload}
            onBack={() => setStep(2)}
            onNext={runAnalysis}
          />
        )}

        {step === 3 && mode === 'portfolio' && (
          <PortfolioBuilder 
            shoots={shoots}
            onAddShoot={handleAddShoot}
            onShootUpload={handleShootUpload}
            onUpdateShootName={handleUpdateShootName}
            onUpdateShootMeta={handleUpdateShootMeta}
            onRemoveImage={handleRemoveImageFromShoot}
            onNext={runAnalysis}
            onBack={() => setStep(0)}
          />
        )}
        
        {step === 5 && (
           <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-pulse">
              <div className="relative">
                <div className="w-24 h-24 border-[1px] border-zinc-100 border-t-black rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center"><BrandIcon size={32} /></div>
              </div>
              <p className="font-serif text-xl tracking-tighter italic">Establishing Visual Narrative...</p>
           </div>
        )}
        
        {step === 6 && (
           <CardPreview 
             cardData={{ profile, images }} 
             currentCardId={currentCardId}
             onSave={handleSaveCard}
             onExport={(font, back, fmt) => alert(`Exporting ${fmt} layout... (PDF Generation uses global script in this version)`)}
             onShare={() => {
                const url = `${window.location.origin}?cardId=${currentCardId}`;
                copyToClipboard(url);
                alert("Public URL copied!");
             }}
           />
        )}

        {step === 7 && (
          <PortfolioEditor 
            shoots={shoots} 
            initialSettings={portfolioSettings}
            isPublic={isPortfolioPublic}
            username={sessionUsername || 'Model'}
            profile={profile}
            portfolioId={portfolioId}
            onUpdate={handlePortfolioUpdate}
            onPublish={handlePortfolioPublish}
            onCurate={() => {
              setStep(3); // Go back to builder
            }}
            onBack={() => {
               setMode(null); // 'dashboard' is effectively mode=null
               setStep(0);
            }}/>
        )}
      </main>
    </div>
  );
}

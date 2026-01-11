'use client';

import React, { useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged, signOut, User as FirebaseUser, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from "sonner";
import { doc, setDoc, getDoc, collection, onSnapshot, addDoc, deleteDoc, enableNetwork } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { 
  getProfile, upsertProfile, 
  getPortfolio, upsertPortfolio, 
  getShootsForPortfolio, upsertShoot, deleteShoot,
  getLibrary, upsertImage, deleteImage,
  addImageToShoot,
  createUser,
  // @ts-ignore - Assuming this is generated but not yet in d.ts
  getImagesByHash,
  // @ts-ignore - Assuming this is generated but not yet in d.ts
  getCompCards,
  // @ts-ignore - Assuming this is generated but not yet in d.ts
  deleteCompCard,
  // @ts-ignore - Assuming this is generated but not yet in d.ts
  deletePortfolio
} from '@/dataconnect-generated';
import { v4 as uuidv4 } from 'uuid'; // Need to install uuid? Or use crypto.randomUUID

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
import { UserMenu } from '@/components/ui/UserMenu';
import { NotificationPanel, Notification } from '@/components/ui/NotificationPanel';
import { ActionDialog, ActionDialogProps } from '@/components/ui/ActionDialog';
import { SettingsModal } from '@/components/ui/SettingsModal';

import { auth, db, storage, dataConnect } from '@/lib/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { compressImageForCloud, sleep, copyToClipboard } from '@/lib/utils';
import { Profile, ImageItem, Shoot, CardData } from '@/types';

// Constants
const APP_ID = 'pose-and-poise';

const DEFAULT_PORTFOLIO_SETTINGS: PortfolioSettings = {
  layout: 'grid',
  showHero: true,
  groupByCollection: false
};

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
  const [uploadQueue, setUploadQueue] = useState<{ files: File[], context: 'library' | 'shoot' | 'wizard_card', shootId?: string | number } | null>(null);

  // Data State
  const [images, setImages] = useState<ImageItem[]>([]); 
  const [shoots, setShoots] = useState<Shoot[]>([{ id: uuidv4(), name: 'Main Shoot', images: [], vibes: [] }]); 
  const [library, setLibrary] = useState<ImageItem[]>([]); 
  const [savedCards, setSavedCards] = useState<CardData[]>([]); 
  
  // Selection State
  const [selectedAesthetic, setSelectedAesthetic] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [currentCardId, setCurrentCardId] = useState<string | null>(null);
  const [currentCardName, setCurrentCardName] = useState<string>("");
  
  // Dialog State
  const [dialogConfig, setDialogConfig] = useState<Partial<ActionDialogProps>>({ isOpen: false });

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
  
  // AI State
  const [recommendedFrontLayout, setRecommendedFrontLayout] = useState<string | undefined>(undefined);
  const [recommendedBackLayout, setRecommendedBackLayout] = useState<string | undefined>(undefined);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Notification State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // --- handlers ---

  const handleLogin = async (username: string) => {
    try {
      // Create a deterministic email for the "workstation username"
      const email = `${username.toLowerCase().replace(/\s+/g, '.')}@posepoise.test`;
      const password = 'dev-password-123'; // Hardcoded for dev convenience

      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        // Ensure user exists in Data Connect (Postgres)
        await createUser(dataConnect, { uid: cred.user.uid, email, now: new Date().toISOString() });
      } catch (e: any) {
        if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
           const cred = await createUserWithEmailAndPassword(auth, email, password);
           await createUser(dataConnect, { uid: cred.user.uid, email, now: new Date().toISOString() });
        } else {
           throw e;
        }
      }
      setSessionUsername(username);
      setStep(0);
    } catch (err) {
      console.error("Login failed", err);
      // alert("Connection failed: " + (err as any).message); // Optional
    }
  };

  const handleAddNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'notifications'), {
        ...notification,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Failed to add notification:", error);
      toast.error("Could not add notification.");
    }
  };

  const handleRemoveNotification = async (notificationId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'notifications', notificationId));
      // The onSnapshot listener will update the state automatically.
    } catch (error) {
      console.error("Failed to remove notification:", error);
      toast.error("Could not remove notification.");
    }
  };

  const isAssetHashInDB = async (hash: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const result = await getImagesByHash(dataConnect, { hash: hash });
      return result.data.images.length > 0;
    } catch (error) {
      console.error("Failed to check asset hash:", error);
      // Fail open (assume not a duplicate) to not block uploads on DB error
      return false;
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

  const saveToLibrary = async (base64: string, metadata: Partial<ImageItem> = {}, file?: File): Promise<ImageItem | undefined> => {
    console.warn("`saveToLibrary` is deprecated. The new upload flow should be used.");
    return undefined;
  };

  const calculateFileHash = async (file: File): Promise<string> => {
     const buffer = await file.arrayBuffer();
     const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
     const hashArray = Array.from(new Uint8Array(hashBuffer));
     const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
     return hashHex;
  };

  const deleteFromLibrary = async (docId: string | number) => {
    if (!user) return;
    try {
      await deleteImage(dataConnect, { id: String(docId) });
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleBatchDeleteImages = async (ids: string[]) => {
      if (!user || ids.length === 0) return;
      try {
         // Update Local State Optimistically
         setLibrary(prev => prev.filter(img => !ids.includes(String(img.id))));
         
         // Also remove from any selected "images" state if in wizard
         setImages(prev => prev.filter(img => !ids.includes(String(img.id))));

         // Delete from DB
         await Promise.all(ids.map(id => deleteImage(dataConnect, { id })));
         
         toast.success(`Pruned ${ids.length} images.`);
      } catch (err) {
         console.error("Batch delete failed", err);
         toast.error("Failed to delete some images.");
         // Ideally rollback state here, but simple for now
      }
  };

  const handleRemoveDuplicates = async (indices: number[]) => {
    if (!user) return;
    
    // The list provided to AI was filtered by visibility
    const allVisibleImages = shoots.flatMap(s => s.images.filter(url => !s.hiddenImages?.includes(url)));
    const urlsToRemove = indices.map(i => allVisibleImages[i]).filter(Boolean);
    
    if (urlsToRemove.length === 0) return;

    try {
      // 1. Identify IDs to remove from Library
      const idsToRemove: string[] = library
        .filter(img => urlsToRemove.includes(img.url))
        .map(img => String(img.id));

      // 2. Update local state
      const newLibrary = library.filter(img => !urlsToRemove.includes(img.url));
      const newShoots = shoots.map(s => ({
        ...s,
        images: s.images.filter(url => !urlsToRemove.includes(url))
      }));

      setLibrary(newLibrary);
      setShoots(newShoots);

      // 3. Persist deletions from Library in DB
      await Promise.all(idsToRemove.map(id => deleteImage(dataConnect, { id })));
      
      // 4. Update the portfolio in DB using the local override to avoid state races
      await handlePortfolioUpdate(portfolioSettings || DEFAULT_PORTFOLIO_SETTINGS, newShoots);

      toast.success(`Removed ${urlsToRemove.length} duplicate images.`);
    } catch (err) {
      console.error("Cleanup failed:", err);
      toast.error("Failed to remove some images.");
    }
  };

  const handleApplyAISuggestions = async (heroIndex: number, highlightIndices: number[]) => {
    if (!user) return;
    
    // The list provided to AI was filtered by visibility
    const allVisibleImages = shoots.flatMap(s => s.images.filter(url => !s.hiddenImages?.includes(url)));
    const heroUrl = allVisibleImages[heroIndex];
    const highlightedUrls = highlightIndices.map(i => allVisibleImages[i]).filter(Boolean);

    if (!heroUrl && highlightedUrls.length === 0) return;

    try {
      const newSettings: PortfolioSettings = {
        ...(portfolioSettings || DEFAULT_PORTFOLIO_SETTINGS),
        // Force hero settings on if we have a suggestion
        showHero: true,
        heroImageUrl: heroUrl,
        highlightedImageUrls: highlightedUrls
      };

      setPortfolioSettings(newSettings);
      await handlePortfolioUpdate(newSettings);
      toast.success("Design improvements applied!");
    } catch (err) {
      console.error("Failed to apply suggestions:", err);
      toast.error("Failed to update portfolio.");
    }
  };

  const handleResetPortfolio = async () => {
    if (!user) return;
    try {
       // 1. Delete all shoots
       const allShoots = shoots; // already have them in state
       await Promise.all(allShoots.map(s => deleteShoot(dataConnect, { id: String(s.id) })));

       // 2. Delete Portfolio Record (so it appears as "New" / "Launch Builder")
       await deletePortfolio(dataConnect, { uid: user.uid });

       // 3. Update Local State
       setShoots([{ id: uuidv4(), name: 'Main Shoot', images: [], vibes: [] }]);
       setPortfolioSettings(DEFAULT_PORTFOLIO_SETTINGS);
       setIsPortfolioPublic(false);
       setPortfolioId(null); 

       toast.success("Portfolio completely reset.");
    } catch (err) {
       console.error("Reset failed", err);
       toast.error("Failed to reset portfolio.");
    }
  };

  const handleResetCompCards = async () => {
    if (!user) return;
    try {
      // 1. Fetch all cards (if not already fully synced, better to fetch fresh)
      const result = await getCompCards(dataConnect, { uid: user.uid });
      const cards = result.data.compCards;

      if (cards.length === 0) {
        toast.info("No saved cards to delete.");
        return;
      }

      // 2. Delete all
      await Promise.all(cards.map((c: any) => deleteCompCard(dataConnect, { id: c.id })));

      // 3. Update Local State
      setSavedCards([]);
      toast.success(`Deleted ${cards.length} saved designs.`);
    } catch (err) {
       console.error("Clear cards failed", err);
       toast.error("Failed to clear saved designs.");
    }
  };

  const handleClearLibrary = async () => {
     if (!user) return;
     try {
        const allIds = library.map(img => String(img.id));
        if (allIds.length === 0) {
           toast.info("Library is already empty.");
           return;
        }

        // Reuse batch delete logic
        await handleBatchDeleteImages(allIds);
        
        toast.success("Asset Library completely cleared.");
     } catch (err) {
        console.error("Clear library failed", err);
        toast.error("Failed to clear library.");
     }
  };

  // --- Actions ---

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileHash?: string): Promise<boolean> => {
    if (!e.target.files || e.target.files.length === 0) return false;

    const file = e.target.files[0];
    const toastId = toast.loading(`Uploading "${file.name}"...`);
    
    try {
      const functions = getFunctions();
      const requestUploadURLCallable = httpsCallable(functions, 'requestImageUploadURL');

      // The hash is now calculated and passed in from the component
      const imageHash = fileHash || await calculateFileHash(file);
      
      const result = await requestUploadURLCallable({
        imageHash: imageHash,
        contentType: file.type,
      });

      const data = result.data as any;

      if (data.duplicate) {
        toast.info(`"${file.name}" is already in your library.`, { id: toastId });
        return false;
      }
      
      const uploadResponse = await fetch(data.signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed for IMG_0114.png: ${await uploadResponse.text()}`);
      }
      
      toast.success(`"${file.name}" uploaded successfully.`, { id: toastId });
      return true;

    } catch (error: any) {
      console.error(`Upload failed for ${file.name}:`, error);
      toast.error(error.message || `Upload failed for "${file.name}".`, { id: toastId });
      return false;
    }
  };
  
  // Specific handler for ImageSelector in Wizard (mix of library and new uploads)
  const handleWizardFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadQueue({ 
        files: Array.from(e.target.files), 
        context: 'wizard_card'
      });
      e.target.value = ''; 
    }
  };

  const saveProfile = async (newProfile: Profile) => {
    if (!user) return;
    try {
      setProfile(newProfile);
      // Migrate to Data Connect
      await upsertProfile(dataConnect, {
        uid: user.uid,
        name: newProfile.name,
        instagram: newProfile.instagram,
        height: newProfile.height,
        bust: newProfile.bust,
        waist: newProfile.waist,
        hips: newProfile.hips,
        shoeSize: newProfile.shoeSize,
        hairColor: newProfile.hairColor,
        eyeColor: newProfile.eyeColor,
        dressSize: newProfile.dressSize || 'Unknown', // Schema required dressSize?
        avatar: newProfile.avatar || null,
        description: newProfile.description || null,
        careerGoals: newProfile.careerGoals || null
      });
      // Legacy Firestore for safety/backup (Optional, removed to force switch)
      // await setDoc(doc(db, 'users', user.uid, 'profile', 'data'), newProfile);
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
    // await sleep(2000); // Removed artificial delay
    if (mode === 'portfolio') {
      await handlePortfolioUpdate(portfolioSettings || DEFAULT_PORTFOLIO_SETTINGS);
      setStep(7); // Portfolio Output
    } else {
      setStep(6); // Card Output
    }
  };

  const handleMetadataConfirm = async (metadata: Partial<ImageItem>) => {
    if (!uploadQueue || !user) return;

    const { files, context, shootId } = uploadQueue;
    const functions = getFunctions();
    const requestUploadURLCallable = httpsCallable(functions, 'requestImageUploadURL');

    setUploadQueue(null); // Close the modal immediately

    for (const file of files) {
      const toastId = toast.loading(`Uploading "${file.name}"...`);
      try {
        // 1. Calculate hash
        const imageHash = await calculateFileHash(file);

        // 2. Request upload URL from backend
        const result = await requestUploadURLCallable({
          imageHash,
          contentType: file.type,
        });

        const data = result.data as any;

        if (data.duplicate) {
          toast.info(`"${file.name}" is already in your library.`, { id: toastId });
          // The real-time listener for the library will handle adding the image if it wasn't there before
          continue;
        }
        
        // 3. Upload file directly to signed URL
        const uploadResponse = await fetch(data.signedUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });

        if (!uploadResponse.ok) {
            throw new Error(`Storage upload failed with status ${uploadResponse.status}`);
        }

        // 4. UI is updated via the Firestore listener on the `images` or `library` collection
        // which is triggered by the `processUploadedImage` cloud function.
        toast.success(`"${file.name}" uploaded. Processing...`, { id: toastId });

      } catch (error: any) {
        console.error(`Upload failed for ${file.name}:`, error);
        toast.error(error.message || `Upload failed for "${file.name}".`, { id: toastId });
      }
    }
  };

  const handleAddShoot = () => {
    setShoots(prev => [...prev, { id: uuidv4(), name: 'New Set', images: [], vibes: [] }]);
  };

  const handleAddImagesToShoot = (shootId: string | number, imageUrls: string[]) => {
    setShoots(prev => prev.map(s => {
      if (s.id === shootId) {
        // Filter out duplicates if any (optional, but good UX)
        const newImages = imageUrls.filter(url => !s.images.includes(url));
        if (newImages.length === 0) return s;
        return { ...s, images: [...s.images, ...newImages] };
      }
      return s;
    }));
    toast.success(`Allocated ${imageUrls.length} assets to section.`);
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
  
  const handleUpdateShootMeta = (shootId: string | number, field: keyof Shoot, value: string | string[]) => {
    setShoots(prev => prev.map(s => {
      if (s.id === shootId) return { ...s, [field]: value };
      return s;
    }));
  };

  const handleToggleVisibility = async (shootId: string | number, url: string) => {
    setShoots(prev => prev.map(s => {
      if (s.id === shootId) {
        const hidden = s.hiddenImages || [];
        const newHidden = hidden.includes(url) ? hidden.filter(u => u !== url) : [...hidden, url];
        return { ...s, hiddenImages: newHidden };
      }
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

  const handleSaveCard = async (name: string, frontLayout: string, backLayout: string) => {
    if (!user || images.length < 1) return;
    
    try {
      // Compress selected images for the card record
      const compressedImageUrls = await Promise.all(
        images.map(img => compressImageForCloud(img.url))
      );

      const sanitizedProfile = {
          name: profile.name || '',
          instagram: profile.instagram || '',
          height: profile.height || '',
          bust: profile.bust || '',
          waist: profile.waist || '',
          hips: profile.hips || '',
          shoeSize: profile.shoeSize || '',
          hairColor: profile.hairColor || '',
          eyeColor: profile.eyeColor || '',
          dressSize: profile.dressSize || 'Unknown',
          avatar: profile.avatar || null
      };

      const cardData: CardData = {
        profile: sanitizedProfile,
        name,
        images: compressedImageUrls,
        aesthetic: selectedAesthetic || 'editorial',
        frontLayout: frontLayout as any,
        backLayout: backLayout as any,
        timestamp: Date.now(),
        modelId: sessionUsername || 'unknown'
      };

      let userCardRef;
      if (currentCardId) {
          userCardRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'compositeCards', currentCardId);
      } else {
          userCardRef = doc(collection(db, 'artifacts', APP_ID, 'users', user.uid, 'compositeCards'));
      }

      await setDoc(userCardRef, { ...cardData, id: userCardRef.id });
      
      // Also save to public collection for sharing
      await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'compositeCards', userCardRef.id), { ...cardData, id: userCardRef.id });
      
      setCurrentCardId(userCardRef.id);
      setCurrentCardName(name); // Sync local name state
      toast.success("Card Saved Successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Save failed.");
    }
  };

  const handlePortfolioUpdate = async (settings: PortfolioSettings, shootsOverride?: Shoot[]) => {
    if (!user) return;
    const activeShoots = shootsOverride || shoots;
    try {
       // 1. Update Portfolio Record
       await upsertPortfolio(dataConnect, {
         uid: user.uid,
         settings: JSON.stringify(settings),
         isPublic: isPortfolioPublic,
         now: new Date().toISOString()
       });

       // 2. Sync Shoots & Images
       // Create a lookup map for Image URLs to IDs from the loaded library
       const urlToId = new Map(library.map(img => [img.url, String(img.id)]));

       for (const shoot of shoots) {
          let shootId = String(shoot.id);
          // Ensure shoot ID is UUID compliant if needed (assumed handled by handleAddShoot)

          await upsertShoot(dataConnect, {
             id: shootId,
             uid: user.uid,
             name: shoot.name,
             vibes: shoot.vibes ? shoot.vibes.join(',') : '',
             photographer: shoot.photographer || '',
             studio: shoot.studio || '',
             now: new Date().toISOString()
          });

          // Sync Images for this shoot
          if (shoot.images) {
             for (let i = 0; i < shoot.images.length; i++) {
                const url = shoot.images[i];
                let imgId = urlToId.get(url);

                if (!imgId) {
                   console.warn("Image not found in library, creating new record:", url);
                   imgId = uuidv4();
                   await upsertImage(dataConnect, {
                      id: imgId,
                      uid: user.uid,
                      url: url,
                      now: new Date().toISOString()
                   });
                   urlToId.set(url, imgId); 
                }

                // Link Image to Shoot
                await addImageToShoot(dataConnect, {
                   shootId: shootId,
                   imageId: imgId,
                   order: i,
                   isVisible: !(shoot.hiddenImages?.includes(url))
                });
             }
          }
       }
       
       setPortfolioSettings(settings); // Local state update
       toast.success("Portfolio Updated");

    } catch (err) {
       console.error("Portfolio Update Error", err);
       toast.error("Failed to update portfolio.");
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
        toast.error("Failed to change publish status.");
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
      try {
        const response = await getProfile(dataConnect, { uid: user.uid });
        if (response.data.profiles.length > 0) {
           const p = response.data.profiles[0];
           setProfile({
              name: p.name,
              instagram: p.instagram || '',
              avatar: p.avatar || undefined,
              height: p.height,
              bust: p.bust,
              waist: p.waist,
              hips: p.hips,
              shoeSize: p.shoeSize,
              hairColor: p.hairColor,
              eyeColor: p.eyeColor,
              description: p.description || undefined,
              careerGoals: p.careerGoals || undefined,
              // dressSize missing in local Profile type but present in DB?
           });
        }
      } catch (e) {
         console.warn("Data Connect Profile Load Failed", e);
      }
    };
    loadProfile();

    const unsubCards = onSnapshot(collection(db, 'artifacts', APP_ID, 'users', user.uid, 'compositeCards'), (snapshot) => {
      setSavedCards(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CardData)));
    });

    // Load Library via Data Connect
    const loadLibrary = async () => {
        try {
           const res = await getLibrary(dataConnect, { uid: user.uid });
           setLibrary(res.data.images.map(img => ({
               id: img.id,
               url: img.url,
               // metadata: JSON.parse(img.metadata || '{}') // TODO: Handle metadata parsing if storing as string
           } as ImageItem)));
        } catch (e) {
            console.warn("Library load failed", e);
        }
    };
    loadLibrary();
    // Legacy onSnapshot removed
    /*
    const unsubLibrary = onSnapshot(collection(db, 'artifacts', APP_ID, 'users', user.uid, 'library'), (snapshot) => {
      setLibrary(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ImageItem)));
    });
    */

    // Load Portfolio Data
    const loadPortfolio = async () => {
       // ... existing implementation
    };
    loadPortfolio();

    // Fetch Notifications in real-time
    const unsubNotifications = onSnapshot(
      collection(db, 'users', user.uid, 'notifications'),
      (snapshot) => {
        const serverNotifications: Notification[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Notification)).sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        setNotifications(serverNotifications);
      },
      (error) => {
        console.error("Notification listener error:", error);
      }
    );

    return () => {
      unsubCards();
      unsubNotifications();
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
          <div className="relative flex items-center">
            <UserMenu 
               user={{ 
                   displayName: profile.name || sessionUsername, 
                   email: user.isAnonymous ? 'Guest User' : user.uid,
                   photoURL: profile.avatar || null
               }}
               onSignOut={handleLogout}
               onEditProfile={() => setIsProfileOpen(true)}
               onOpenSettings={() => setIsSettingsOpen(true)}
               onOpenNotifications={() => setIsNotificationsOpen(prev => !prev)}
               hasNewNotifications={notifications.length > 0}
            />
            {isNotificationsOpen && (
              <div className="absolute top-full right-0 mt-2">
                <NotificationPanel 
                  notifications={notifications}
                  onClose={() => setIsNotificationsOpen(false)}
                  onRemoveNotification={handleRemoveNotification}
                />
              </div>
            )}
          </div>
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
        


        <ActionDialog 
          isOpen={!!dialogConfig.isOpen}
          onClose={() => setDialogConfig({ isOpen: false })}
          onConfirm={dialogConfig.onConfirm || (() => {})}
          title={dialogConfig.title || ''}
          description={dialogConfig.description || ''}
          type={dialogConfig.type}
          confirmText={dialogConfig.confirmText}
          cancelText={dialogConfig.cancelText}
        />

        {step === -1 && <Login onLogin={handleLogin} />}
        
        {step === 0 && (
          <Landing 
            username={sessionUsername || ''} 
            uid={user?.uid || ''}
            profile={profile}
            library={library} 
            savedCards={savedCards}
            portfolioId={portfolioId}
            shoots={shoots}
            portfolioSettings={portfolioSettings || { layout: 'grid', showHero: true, groupByCollection: false }}
            onBatchDeleteAssets={handleBatchDeleteImages}
            notifications={notifications}
            onRemoveNotification={handleRemoveNotification}
            onAddNotification={handleAddNotification}
            isAssetHashInDB={isAssetHashInDB}
            onNavigate={(m) => { setMode(m); setStep(1); }}
            onFileUpload={handleFileUpload}
            onDeleteAsset={deleteFromLibrary}
            onDeleteCard={(id) => {
               if (!user) return;
               setDialogConfig({
                   isOpen: true,
                   title: "Delete Card",
                   description: "Are you sure you want to permanently delete this composite card? This action cannot be undone.",
                   type: 'danger',
                   confirmText: 'Delete Forever',
                   onConfirm: async () => {
                       try {
                          await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'compositeCards', id));
                          await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'compositeCards', id));
                          toast.success("Card Deleted");
                          if (currentCardId === id) {
                             setCurrentCardId(null);
                             setCurrentCardName("");
                          }
                       } catch (e) {
                          console.error("Delete failed", e);
                          toast.error("Failed to delete card");
                       }
                   }
               });
            }}
            onOpenCard={(card) => {
              setProfile(card.profile);
              setImages((card.images || []).map((url: string) => ({ id: Math.random(), url })));
              setSelectedAesthetic(card.aesthetic);
              setCurrentCardId(card.id || null);
              setCurrentCardName(card.name || "");
              setMode('card');
              setStep(6);
            }}
            onViewCard={(card) => {
               setPublicCard(card);
               setStep(100); // Simulate public view mode
            }}
            onEditProfile={() => setIsProfileOpen(true)}
            onOpenPortfolio={() => {
                setMode('portfolio');
                setStep(7);
            }}
            onCuratePortfolio={() => {
                setMode('portfolio');
                // Ensure at least one shoot exists if starting fresh
                if (shoots.length === 0) {
                   setShoots([{ id: uuidv4(), name: 'Main Shoot', images: [], vibes: [] }]);
                }
                setStep(3); // Skip Aesthetic (1) and Profile (2), go straight to Builder
            }}
          />
        )}
        
        {step === 1 && (
          <AestheticSelector 
            selectedId={selectedAesthetic} 
            onSelect={setSelectedAesthetic} 
            onNext={async () => {
                if (selectedAesthetic === 'ai_auto') {
                    // AI Flow
                    if (!profile.careerGoals) {
                        toast.info("Please set your Career Goals for AI Curation");
                        setIsProfileOpen(true);
                        return;
                    }
                    
                    setStep(5); // Loading
                    try {
                        // Gather Library Images
                        const imageUrls = library.map(img => img.url).slice(0, 15); // Limit to top 15 for API safety
                        
                        const res = await fetch('/api/analyze-portfolio', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                imageUrls, 
                                profile, 
                                careerGoals: profile.careerGoals 
                            })
                        });

                        if (!res.ok) throw new Error("AI Analysis Failed");
                        
                        const selection = await res.json();
                        // selection = { frontIndex: number, backIndices: number[] }
                        
                        // Map back to ImageItems
                        const frontImage = library[selection.frontIndex];
                        const backImages = selection.backIndices.map((idx: number) => library[idx]).filter(Boolean);
                        
                        // Set images state (Front is first)
                        const curatedImages = [frontImage, ...backImages].filter(Boolean);
                        const otherImages = library.filter(img => !curatedImages.some(ci => ci.url === img.url));
                        const allPortfolioImages = [...curatedImages, ...otherImages];
                        
                        if (mode === 'portfolio') {
                           // For Portfolio, create/update a shoot with ALL images, AI-ordered first
                           setShoots([{ 
                              id: uuidv4(), 
                              name: 'AI Curated Selection', 
                              images: allPortfolioImages.map(img => img.url),
                              vibes: selection.vibe ? [selection.vibe] : ['Curated']
                           }]);
                           setStep(3); // Go to Builder to review
                           toast.success("AI has curated your portfolio!");
                        } else {
                           setImages(curatedImages); 
                           if (selection.frontLayout) setRecommendedFrontLayout(selection.frontLayout);
                           if (selection.backLayout) setRecommendedBackLayout(selection.backLayout);
                           setStep(6); 
                           toast.success("AI has curated your card!");
                        }

                    } catch (e) {
                        console.error("AI Error", e);
                        toast.error("AI Curation Failed. Please select manually.");
                        setStep(mode === 'card' ? 2 : 3);
                    }
                } else {
                    // Manual Flow
                    setStep(mode === 'card' ? 2 : 3);
                }
            }} 
          />
        )}
        
        {step === 2 && (
          <ProfileForm 
            profile={profile} 
            onEdit={() => setIsProfileOpen(true)}
            onBack={() => setStep(1)} 
            onNext={async () => {
                // Just advance step, assuming data was saved via modal if edited
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
             onDeleteImages={handleBatchDeleteImages}
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
            onToggleVisibility={handleToggleVisibility}
            library={library}
            onAddImagesToShoot={handleAddImagesToShoot}
            onNext={runAnalysis}
            onBack={() => setStep(1)}
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
             initialName={currentCardName}
             initialFrontLayout={recommendedFrontLayout}
             initialBackLayout={recommendedBackLayout}
             // onNameChange decoupled to allow detecting changes
             onSave={handleSaveCard}
             onExport={async (frontLayout, backLayout, filename) => {
              const frontFace = document.getElementById('export-front');
              const backFace = document.getElementById('export-back');
              
              if (!frontFace || !backFace) {
                  toast.error("Export elements not found. Please try again.");
                  return;
              }
              
              const toastId = toast.loading("Generating High-Res PDF...");

              try {
                  // Capture Front & Back from hidden container (no 3D transforms)
                   // Scale 4 for high quality print (approx 300dpi)
                  const frontCanvas = await html2canvas(frontFace, { scale: 4, useCORS: true, backgroundColor: '#ffffff' });
                  const backCanvas = await html2canvas(backFace, { scale: 4, useCORS: true, backgroundColor: '#ffffff' });

                  const pdf = new jsPDF('p', 'mm', [139.7, 215.9]); // 5.5 x 8.5 inches
                  const width = pdf.internal.pageSize.getWidth();
                  const height = pdf.internal.pageSize.getHeight();

                  // Page 1: Front
                  pdf.addImage(frontCanvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, width, height);
                  
                  // Page 2: Back
                  pdf.addPage();
                  pdf.addImage(backCanvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, width, height);

                  // Use provided filename or default
                  const safeName = (filename || 'composite-card').replace(/[^a-z0-9]/gi, '_').toLowerCase();
                  pdf.save(`${safeName}.pdf`);
                  toast.success("PDF Downloaded", { id: toastId });
              } catch (e) {
                  console.error("PDF Fail", e);
                  toast.error("Failed to generate PDF", { id: toastId });
              }
            }}
             onShare={() => {
                const url = `${window.location.origin}?cardId=${currentCardId}`;
                copyToClipboard(url);
                toast.success("Public URL copied!");
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
            }}
            onRemoveDuplicates={handleRemoveDuplicates}
            onApplySuggestions={handleApplyAISuggestions}
          />
        )}
      </main>

      {isProfileOpen && (
           <ProfileModal 
              initialProfile={profile} 
              uid={user?.uid}
              libraryImages={library}
              onSave={async (p) => {
                await saveProfile(p);
              }} 
              onClose={() => setIsProfileOpen(false)}
           />
      )}

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetPortfolio={handleResetPortfolio}
        onClearCompCards={handleResetCompCards}
        onClearLibrary={handleClearLibrary}
      />
    </div>
  );
}

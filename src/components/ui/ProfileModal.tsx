import React, { useState } from 'react';
import { X, Ruler, User, Instagram, Camera, Upload, Sparkles } from 'lucide-react';
import { upload } from '@vercel/blob/client';
import { SocialIntegrations } from '@/components/ui/SocialIntegrations';
import { Profile, ImageItem } from '@/types';
import { toast } from 'sonner';

interface ProfileModalProps {
  initialProfile: Profile;
  uid?: string;
  token?: string;
  libraryImages?: ImageItem[];
  onSave: (profile: Profile) => Promise<void> | void;
  onClose: () => void;
  settings?: any;
  onUpdateSettings?: (settings: any) => Promise<void>;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ initialProfile, uid, token, libraryImages = [], onSave, onClose, settings, onUpdateSettings }) => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isGenerating, setIsGenerating] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(initialProfile.avatar || null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof Profile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleGenerateBio = async () => {
    if (libraryImages.length === 0) {
        toast.error("Upload images to your library first for AI analysis.");
        return;
    }
    
    setIsGenerating(true);
    const toastId = toast.loading("AI is crafting your story...");
    
    try {
       const res = await fetch('/api/generate-bio', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
               imageUrls: libraryImages.map(i => i.url),
               profile: profile
           })
       });

      if (!res.ok) {
           const errData = await res.json().catch(() => ({}));
           throw new Error(errData.error || "Failed to generate");
       }
       
       const data = await res.json();
       if (data.bio) {
           handleChange('description', data.bio);
           toast.success("Bio Generated!", { id: toastId });
       }
    } catch (e: any) {
       console.error(e);
       toast.error(e.message || "AI Generation failed", { id: toastId });
    } finally {
       setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // If avatar file exists, we'd normally upload it here using a callback prop
    // But since the save logic is in page.tsx, we can pass the file differently or handle it here if we had storage access.
    // For now, let's assume the parent handles the actual upload if we pass the file object attached to the profile temporarily or via a separate callback.
    // However, the `onSave` only takes `Profile`. We might need to base64 it or update the prop signature.
    // Let's modify the profile object with a temporary data property or assume onSave is updated.
    // Actually, looking at page.tsx, onSave is `handleProfileSave`. 
    // We will update the Profile interface locally or just use a data URL which works with the `avatar` string field directly!
    let finalProfile = { ...profile };
    
    if (avatarFile && uid) {
        try {
            // Replaced Firebase Storage with Vercel Blob
            // Manually handle filename uniqueness
            const uniqueFilename = `${crypto.randomUUID()}-${avatarFile.name}`;
            
            const blob = await upload(uniqueFilename, avatarFile, {
                access: 'public',
                handleUploadUrl: `/api/upload?auth=${token}`,
                clientPayload: JSON.stringify({
                    userId: uid,
                    imageHash: 'avatar', // Optional or specific string
                    contentType: avatarFile.type
                })
            });

            finalProfile.avatar = blob.url;
        } catch (error) {
            console.error("Avatar upload failed:", error);
            toast.error("Avatar upload failed.");
        }
    } else if (previewAvatar && !avatarFile) {
        // Keep existing avatar URL
        finalProfile.avatar = previewAvatar;
    }

    await onSave(finalProfile);
    setIsSaving(false);
    setIsSaved(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 relative">
        <div className="p-8 border-b border-zinc-50 flex justify-between items-center">
           <div>
             <h3 className="font-serif text-2xl">Model Profile</h3>
             <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">
                Your professional identity & stats
             </p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors relative z-50"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
           {/* Identity */}
           <div className="flex flex-col items-center mb-6">
              <div className="relative w-24 h-24 rounded-full bg-zinc-100 overflow-hidden group shadow-inner">
                {previewAvatar ? (
                    <img src={previewAvatar} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300">
                        <User size={32} />
                    </div>
                )}
                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white" size={20} />
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                const file = e.target.files[0];
                                setAvatarFile(file);
                                const reader = new FileReader();
                                reader.onload = (ev) => setPreviewAvatar(ev.target?.result as string);
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                </label>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mt-2">Profile Photo</p>
           </div>

           <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                 <User size={12} /> Identity
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500">Professional Name</label>
                    <input 
                       value={profile.name}
                       onChange={(e) => handleChange('name', e.target.value)}
                       className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 uppercase tracking-wide placeholder-zinc-300"
                       placeholder="JANA ELISE LISTER"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500">Instagram Handle</label>
                    <div className="relative">
                       <Instagram size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                       <input 
                          value={profile.instagram}
                          onChange={(e) => handleChange('instagram', e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-100 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 placeholder-zinc-300"
                          placeholder="@username"
                       />
                    </div>
                 </div>
              </div>
           </div>

           {/* Measurements */}
           <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                 <Ruler size={12} /> Measurements
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[
                    { label: 'Height', key: 'height' },
                    { label: 'Bust', key: 'bust' },
                    { label: 'Waist', key: 'waist' },
                    { label: 'Hips', key: 'hips' },
                    { label: 'Shoe', key: 'shoeSize' },
                    { label: 'Hair', key: 'hairColor' },
                    { label: 'Eyes', key: 'eyeColor' },
                 ].map((field) => (
                    <div key={field.key} className="space-y-1">
                       <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{field.label}</label>
                       <input 
                          value={profile[field.key as keyof Profile] || ''}
                          onChange={(e) => handleChange(field.key as keyof Profile, e.target.value)}
                          className="w-full bg-zinc-50 border-b border-zinc-200 focus:border-black outline-none px-2 py-2 text-sm font-medium transition-colors"
                       />
                    </div>
                 ))}
              </div>
           </div>
           {/* AI Context */}
           <div className="space-y-4">
               <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                  <User size={12} /> Career & AI Context
               </h4>
               <div className="space-y-4">
                  <div className="space-y-1">
                      <div className="flex justify-between items-end">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Professional Bio (Short)</label>
                        <div className="flex flex-col items-end space-y-1">
                          <button 
                               type="button"
                               onClick={handleGenerateBio}
                               disabled={isGenerating}
                               className="text-[10px] font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1 hover:bg-purple-50 px-2 py-1 rounded-md transition-colors"
                          >
                              <Sparkles size={12} /> {isGenerating ? 'Writing...' : 'Auto-Write with AI'}
                          </button>
                          <p className="text-[8px] text-zinc-300 font-bold uppercase tracking-widest italic leading-none pb-1">Requires images in library for analysis</p>
                        </div>
                      </div>
                      <textarea
                          value={profile.description || ''}
                          onChange={(e) => handleChange('description', e.target.value)}
                          className="w-full bg-zinc-50 border-b border-zinc-200 focus:border-black outline-none px-2 py-2 text-sm font-medium transition-colors min-h-[60px]"
                          placeholder="E.g. Aspiring commercial model based in NYC..."
                      />
                  </div>
                  <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Career Goals (For AI Curation)</label>
                      <textarea
                          value={profile.careerGoals || ''}
                          onChange={(e) => handleChange('careerGoals', e.target.value)}
                          className="w-full bg-zinc-50 border-b border-zinc-200 focus:border-black outline-none px-2 py-2 text-sm font-medium transition-colors min-h-[60px]"
                          placeholder="E.g. I want to book more high-fashion runway shows and editorial print work."
                      />
                  </div>
               </div>
            </div>
            
            {/* Dashboard Experience */}
            <div className="space-y-4">
               <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                  <Sparkles size={12} /> Dashboard Experience
               </h4>
               <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-zinc-700">Photoshoot Timeline</p>
                    <p className="text-xs text-zinc-500 max-w-sm mt-1">
                      Display a timeline of your past photoshoot events, creating a visual about your modeling and photoshoot experiences.
                    </p>
                  </div>
                  <button 
                     type="button"
                     onClick={() => onUpdateSettings?.({ ...settings, showTimeline: settings?.showTimeline === false })}
                     className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ml-4 ${settings?.showTimeline !== false ? 'bg-black' : 'bg-zinc-200'}`}
                  >
                     <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings?.showTimeline !== false ? 'right-1' : 'left-1'}`} />
                  </button>
               </div>
            </div>

           {/* Social Integrations */}
           {uid && <SocialIntegrations uid={uid} />}

            <div className="pt-4 flex justify-end gap-3">
              <button 
                 type="submit"
                 disabled={isSaving}
                 className={`px-12 py-4 font-bold uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl text-xs flex items-center justify-center gap-2
                   ${isSaved ? 'bg-green-600 text-white' : 'bg-black text-white'}
                 `}
              >
                 {isSaving && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                 {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save Profile'}
              </button>
              <button 
                 type="button"
                 onClick={onClose}
                 className="px-6 py-4 font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-100 transition-all text-xs text-zinc-500 border border-zinc-100"
              >
                 Close
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

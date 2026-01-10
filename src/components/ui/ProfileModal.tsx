import React, { useState } from 'react';
import { X, Ruler, User, Instagram } from 'lucide-react';
import { Profile } from '@/types';

interface ProfileModalProps {
  initialProfile: Profile;
  onSave: (profile: Profile) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ initialProfile, onSave, onClose }) => {
  const [profile, setProfile] = useState<Profile>(initialProfile);

  const handleChange = (field: keyof Profile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8">
        <div className="p-8 border-b border-zinc-50 flex justify-between items-center">
           <div>
             <h3 className="font-serif text-2xl">Model Profile</h3>
             <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">
                Your professional identity & stats
             </p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
           {/* Identity */}
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
        
           <div className="pt-4 flex justify-end">
              <button 
                 type="submit"
                 className="px-12 py-4 bg-black text-white font-bold uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl text-xs"
              >
                 Save Profile
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

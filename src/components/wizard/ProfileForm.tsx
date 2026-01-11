import React from 'react';
import { Profile } from '@/types';

interface ProfileFormProps {
  profile: Profile;
  onEdit: () => void;
  onNext: () => Promise<void> | void;
  onBack: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onEdit, onNext, onBack }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onNext();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in slide-in-from-bottom-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif mb-2">Confirm Stats</h2>
        <p className="text-xs text-zinc-400 uppercase tracking-widest">
            Verify your details for the card
        </p>
      </div>

      <div className="bg-zinc-50 rounded-3xl p-8 mb-8 border border-zinc-100 flex flex-col md:flex-row gap-8 items-start">
         <div className="flex-1 space-y-6 w-full">
             <div className="flex justify-between items-start border-b border-zinc-200 pb-4">
                 <div>
                    <h3 className="font-serif text-2xl">{profile.name || "MODEL NAME"}</h3>
                    <p className="text-sm text-zinc-500 font-bold">{profile.instagram || "@instagram"}</p>
                 </div>
                 <button 
                   onClick={onEdit}
                   className="text-[10px] font-bold uppercase tracking-wider underline hover:text-blue-600"
                 >
                   Edit Details
                 </button>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Height', val: profile.height },
                  { label: 'Bust', val: profile.bust },
                  { label: 'Waist', val: profile.waist },
                  { label: 'Hips', val: profile.hips },
                  { label: 'Shoe', val: profile.shoeSize },
                  { label: 'Hair', val: profile.hairColor },
                  { label: 'Eyes', val: profile.eyeColor },
                ].map((item, i) => (
                   <div key={i} className="">
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{item.label}</span>
                      <span className="block text-sm font-medium">{item.val || '-'}</span>
                   </div>
                ))}
             </div>
         </div>
      </div>

      <div className="mt-12 flex justify-between items-center">
        <button onClick={onBack} className="text-zinc-400 uppercase text-[10px] font-bold hover:text-black transition-colors">Back</button>
        <button 
          onClick={handleConfirm} 
          disabled={isLoading}
          className="px-14 py-5 bg-black text-white rounded-full font-bold uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          <span>{isLoading ? 'Processing...' : 'Confirm & Continue'}</span>
        </button>
      </div>
    </div>
  );
};

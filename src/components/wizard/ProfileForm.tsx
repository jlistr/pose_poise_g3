import React from 'react';
import { Profile } from '@/types';

interface ProfileFormProps {
  profile: Profile;
  onChange: (field: keyof Profile, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onChange, onNext, onBack }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.name as keyof Profile, e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in slide-in-from-bottom-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif mb-2">Technical Blueprint</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-50 p-12 rounded-[3rem] border border-zinc-100 shadow-sm">
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] uppercase font-bold text-zinc-400">Professional Name</label>
          <input name="name" value={profile.name} onChange={handleChange} className="w-full bg-transparent border-b border-zinc-200 py-3 font-serif text-3xl focus:border-black outline-none" />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] uppercase font-bold text-zinc-400">Instagram Authority</label>
          <input name="instagram" value={profile.instagram} onChange={handleChange} className="w-full bg-transparent border-b border-zinc-200 py-3 font-sans text-xl focus:border-black outline-none" />
        </div>
        {["height", "bust", "waist", "hips", "shoeSize", "hairColor", "eyeColor"].map(field => (
          <div key={field} className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-zinc-400">{field}</label>
            <input 
              name={field} 
              value={profile[field as keyof Profile]} 
              onChange={handleChange} 
              className="w-full bg-transparent border-b border-zinc-200 py-2 focus:border-black outline-none" 
            />
          </div>
        ))}
      </div>
      <div className="mt-12 flex justify-between">
        <button onClick={onBack} className="text-zinc-400 uppercase text-[10px] font-bold">Back</button>
        <button onClick={onNext} className="px-14 py-5 bg-black text-white rounded-full font-bold uppercase shadow-2xl">Confirm Stats</button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { BrandIcon } from '@/components/ui/BrandIcon';

interface LoginProps {
  onLogin: (username: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const validUsers: Record<string, string> = { "Model1": "comp", "Model2": "comp" };
    
    // Simple mock auth from monolith
    if (validUsers[form.username] === form.password) {
      onLogin(form.username);
    } else {
      setError("Invalid credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] animate-in fade-in duration-700">
      <div className="w-full max-w-md bg-white p-12 rounded-[3rem] border border-zinc-100 shadow-2xl">
         <div className="flex flex-col items-center mb-10 space-y-4">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-xl">
              <BrandIcon className="text-white" size={36} />
            </div>
            <h2 className="text-3xl font-serif tracking-tighter">Enter Identity</h2>
         </div>
         <form onSubmit={handleSubmit} className="space-y-6">
            <input 
              className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 outline-none font-serif text-lg focus:ring-1 focus:ring-black" 
              placeholder="Model1 or Model2" 
              value={form.username} 
              onChange={(e) => setForm({...form, username: e.target.value})} 
            />
            <input 
              type="password" 
              className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 outline-none font-serif text-lg focus:ring-1 focus:ring-black" 
              placeholder="Password" 
              value={form.password} 
              onChange={(e) => setForm({...form, password: e.target.value})} 
            />
            {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{error}</p>}
            <button className="w-full py-5 bg-black text-white rounded-2xl font-bold uppercase tracking-[0.4em] shadow-xl hover:bg-zinc-800 transition-all">
              Authenticate
            </button>
         </form>
      </div>
    </div>
  );
};

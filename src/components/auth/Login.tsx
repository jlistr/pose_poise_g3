import React, { useState } from 'react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { supabase } from '@/lib/supabase';

interface LoginProps {
  onLogin: (username: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.username,
        password: form.password,
      });
      if (error) throw error;
      // onLogin is optional if we rely on AuthContext, but we might keep it for transitions
      // Passing email as fallback for display name
      if (data.user) {
         onLogin(data.user.email || "User");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
           redirectTo: window.location.origin // Ensure redirect back
        }
      });
      if (error) throw error;
      // OAuth redirects, so execution stops here usually
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    } 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] animate-in fade-in duration-700 relative overflow-hidden">
      {/* Ambient Background Text */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none z-0 flex items-center justify-center">
          <span className="text-[20vw] leading-none font-serif text-zinc-200 whitespace-nowrap select-none blur-sm opacity-30">
            POSE & POISE
          </span>
      </div>
      <div className="w-full max-w-md bg-white p-12 rounded-[3rem] border border-zinc-100 shadow-2xl">
         <div className="flex flex-col items-center mb-10 space-y-4">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-xl">
              <BrandIcon className="text-white" size={36} />
            </div>
            <h2 className="text-3xl font-serif tracking-tighter">Enter Identity</h2>
         </div>
         <form onSubmit={handleEmailLogin} className="space-y-6">
            <input 
              className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 outline-none font-serif text-lg focus:ring-1 focus:ring-black" 
              placeholder="Email" 
              type="email"
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
            <button disabled={loading} className="w-full py-5 bg-black text-white rounded-2xl font-bold uppercase tracking-[0.4em] shadow-xl hover:bg-zinc-800 transition-all disabled:opacity-50">
              {loading ? 'Authenticating...' : 'Authenticate'}
            </button>
         </form>
         <div className="flex items-center my-6">
            <div className="flex-grow border-t border-zinc-200"></div>
            <span className="flex-shrink mx-4 text-zinc-400 text-sm">Or</span>
            <div className="flex-grow border-t border-zinc-200"></div>
        </div>
        <button onClick={handleGoogleLogin} disabled={loading} className="w-full py-4 bg-white text-black border border-zinc-200 rounded-2xl font-bold shadow-lg hover:bg-zinc-50 transition-all flex items-center justify-center disabled:opacity-50">
            <svg className="w-6 h-6 mr-2" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Sign in with Google
        </button>
      </div>
    </div>
  );
};

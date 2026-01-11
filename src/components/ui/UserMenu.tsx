import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, FileText, Shield, HelpCircle, Trash2, ChevronDown, Settings, Bell } from 'lucide-react';

interface UserMenuProps {
  user: {
      email?: string | null;
      displayName?: string | null;
      photoURL?: string | null;
  };
  onSignOut: () => void;
  onEditProfile?: () => void;
  onOpenSettings?: () => void;
  onOpenNotifications?: () => void;
  hasNewNotifications?: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = ({ 
  user, 
  onSignOut, 
  onEditProfile, 
  onOpenSettings,
  onOpenNotifications,
  hasNewNotifications
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = () => {
     if (user.displayName) {
         return user.displayName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
     }
     return "U";
  };

  return (
    <div className="flex items-center gap-4">
      {/* Notification Bell */}
      <button 
        onClick={onOpenNotifications} 
        className="relative p-2 rounded-full hover:bg-zinc-100 text-zinc-600"
        aria-label="Open notifications"
      >
        <Bell size={20} />
        {hasNewNotifications && (
          <div className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        )}
      </button>

      {/* User Menu Dropdown */}
      <div className="relative" ref={menuRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 hover:bg-zinc-50 p-2 rounded-full pr-4 transition-colors group"
        >
           <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-serif font-bold text-xs ring-2 ring-transparent group-hover:ring-black/5 overflow-hidden">
              {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
              ) : (
                  <span>{getInitials()}</span>
              )}
           </div>
           <div className="hidden md:block text-left">
               <p className="text-[10px] font-bold uppercase tracking-wider text-black">{user.displayName || 'User'}</p>
               <p className="text-[10px] text-zinc-400">Settings</p>
           </div>
           <ChevronDown size={14} className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
           <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right z-50">
               <div className="p-4 border-b border-zinc-50 bg-zinc-50/50">
                   <p className="font-bold text-sm truncate">{user.displayName || 'User'}</p>
                   <p className="text-xs text-zinc-400 truncate">{user.email}</p>
               </div>
               
               <div className="p-2 space-y-1">
                   {onEditProfile && (
                       <button onClick={() => { onEditProfile(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-zinc-50 rounded-lg text-left">
                          <User size={16} className="text-zinc-400" />
                          <span>View & Edit Profile</span>
                       </button>
                   )}
                   {onOpenSettings && (
                       <button onClick={() => { onOpenSettings(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-zinc-50 rounded-lg text-left">
                          <Settings size={16} className="text-zinc-400" />
                          <span>Account Settings</span>
                       </button>
                   )}
               </div>
               
               <div className="h-px bg-zinc-100 my-1 mx-2" />

               <div className="p-2 space-y-1">
                   <Link href="/privacy" className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-zinc-50 rounded-lg text-zinc-600 hover:text-black">
                       <Shield size={16} className="text-zinc-400" />
                       <span>Privacy Policy</span>
                   </Link>
                   <Link href="/terms" className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-zinc-50 rounded-lg text-zinc-600 hover:text-black">
                       <FileText size={16} className="text-zinc-400" />
                       <span>Terms of Service</span>
                   </Link>
                   <Link href="/data-deletion" className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-zinc-50 rounded-lg text-zinc-600 hover:text-black">
                       <Trash2 size={16} className="text-zinc-400" />
                       <span>User Data Deletion</span>
                   </Link>
                   <Link href="/support" className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-zinc-50 rounded-lg text-zinc-600 hover:text-black">
                       <HelpCircle size={16} className="text-zinc-400" />
                       <span>Support</span>
                   </Link>
               </div>

               <div className="p-2 border-t border-zinc-50 bg-zinc-50/30">
                   <button onClick={onSignOut} className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-red-50 text-red-600 rounded-lg text-left">
                       <LogOut size={16} />
                       <span>Sign Out</span>
                   </button>
               </div>
           </div>
        )}
      </div>
    </div>
  );
};


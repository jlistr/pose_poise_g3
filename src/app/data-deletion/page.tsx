
import React from 'react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import Link from 'next/link';

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans p-8 md:p-12 max-w-4xl mx-auto">
      <header className="mb-12 flex items-center justify-between">
         <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors">
            <BrandIcon size={24} />
            <span className="font-serif font-bold uppercase tracking-widest text-xs">Home</span>
         </Link>
         <h1 className="font-serif text-3xl font-bold">User Data Deletion</h1>
      </header>

      <div className="prose prose-zinc max-w-none space-y-8">
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
           <h3 className="text-red-700 font-bold mb-2">Instructions for Data Deletion</h3>
           <p className="text-red-900/80">According to our policy and platform requirements, users have the right to request the complete deletion of their personal data.</p>
        </div>

        <div>
            <h3 className="font-bold text-xl mb-4">Option 1: In-App Deletion</h3>
            <p>We are currently rolling out a self-service deletion button in the User Settings panel. If this is available to you:</p>
            <ol className="list-decimal list-inside space-y-2 mt-4 ml-4">
                <li>Log in to your account.</li>
                <li>Go to <strong>Settings</strong> or click your User Avatar.</li>
                <li>Select <strong>Delete Account</strong> at the bottom of the menu.</li>
                <li>Confirm the deletion action. This will permanently remove your profile, images, and portfolios.</li>
            </ol>
        </div>

        <hr className="border-zinc-100" />

        <div>
            <h3 className="font-bold text-xl mb-4">Option 2: Deletion Request Callback</h3>
            <p>If you cannot access your account or the self-service option is unavailable, you may submit a manual request. We will process your deletion within 24 hours.</p>
            
            <div className="mt-8 bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                <h4 className="font-serif text-lg mb-4">Request Deletion</h4>
                <p className="text-sm text-zinc-500 mb-6">Send an email to our data privacy team with the subject "Data Deletion Request". Please include your account email or username.</p>
                <a 
                   href="mailto:privacy@poseandpoise.com?subject=Data Deletion Request" 
                   className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:scale-105 transition-transform"
                >
                    Email privacy@poseandpoise.com
                </a>
            </div>
        </div>

        <p className="text-sm text-zinc-400 mt-8">Note: Deletion is permanent and cannot be undone.</p>
      </div>
    </div>
  );
}

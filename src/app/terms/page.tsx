
import React from 'react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans p-8 md:p-12 max-w-4xl mx-auto">
      <header className="mb-12 flex items-center justify-between">
         <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors">
            <BrandIcon size={24} />
            <span className="font-serif font-bold uppercase tracking-widest text-xs">Home</span>
         </Link>
         <h1 className="font-serif text-3xl font-bold">Terms of Service</h1>
      </header>

      <div className="prose prose-zinc max-w-none">
        
        <h3>1. Terms</h3>
        <p>By accessing the website at Pose & Poise, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>

        <h3>2. Use License</h3>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on Pose & Poise's website for personal, non-commercial transitory viewing only.</p>
        
        <h3>3. User Content</h3>
        <p>You retain full ownership of the images and data you upload. By uploading content, you grant Pose & Poise a license to host and display this content solely for the purpose of providing the portfolio service.</p>

        <h3>4. Disclaimer</h3>
        <p>The materials on Pose & Poise's website are provided on an 'as is' basis. Pose & Poise makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

        <p className="text-sm text-zinc-400 mt-8">Last Updated: January 10, 2026</p>
      </div>
    </div>
  );
}

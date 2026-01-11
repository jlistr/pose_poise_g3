
import React from 'react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans p-8 md:p-12 max-w-4xl mx-auto">
      <header className="mb-12 flex items-center justify-between">
         <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors">
            <BrandIcon size={24} />
            <span className="font-serif font-bold uppercase tracking-widest text-xs">Home</span>
         </Link>
         <h1 className="font-serif text-3xl font-bold">Privacy Policy</h1>
      </header>

      <div className="prose prose-zinc max-w-none">
        <p className="lead">Your privacy is important to us. It is Pose & Poise's policy to respect your privacy regarding any information we may collect from you across our website.</p>

        <h3>1. Information We Collect</h3>
        <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>

        <h3>2. Usage of Information</h3>
        <p>We use your information to provide our model portfolio hosting services, including:</p>
        <ul>
            <li>Hosting user-generated content (images, profile stats)</li>
            <li>Social media integration (Instagram/TikTok follower counts validation)</li>
            <li>Generating composite cards</li>
        </ul>

        <h3>3. Data Retention</h3>
        <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>

        <h3>4. Sharing of Data</h3>
        <p>We do not share any personally identifying information publicly or with third-parties, except when required to by law.</p>

        <p className="text-sm text-zinc-400 mt-8">Last Updated: January 10, 2026</p>
      </div>
    </div>
  );
}

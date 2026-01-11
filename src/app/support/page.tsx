
'use client';

import React, { useState } from 'react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import Link from 'next/link';

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans p-8 md:p-12">
      <div className="max-w-2xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors">
                <BrandIcon size={24} />
                <span className="font-serif font-bold uppercase tracking-widest text-xs">Home</span>
            </Link>
            <h1 className="font-serif text-3xl font-bold">Support</h1>
        </header>

        {submitted ? (
            <div className="bg-green-50 text-green-800 p-12 rounded-3xl text-center border border-green-100 animate-in fade-in zoom-in">
                <h3 className="text-2xl font-serif mb-4">Message Sent</h3>
                <p className="mb-8">Thank you for reaching out. Our support team will respond to your inquiry shortly.</p>
                <Link href="/" className="text-xs font-bold uppercase tracking-widest underline">Return Home</Link>
            </div>
        ) : (
            <div className="bg-zinc-50 p-8 md:p-12 rounded-3xl border border-zinc-100">
                <p className="mb-8 text-zinc-500">Have a question or running into issues? Fill out the form below.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Email Address</label>
                        <input 
                            required 
                            type="email" 
                            className="w-full bg-white border border-zinc-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Subject</label>
                        <select className="w-full bg-white border border-zinc-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5">
                            <option>Technical Issue</option>
                            <option>Account Access</option>
                            <option>Billing</option>
                            <option>Feature Request</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Message</label>
                        <textarea 
                            required
                            rows={5}
                            className="w-full bg-white border border-zinc-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                            placeholder="Describe your issue..."
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-black text-white font-bold uppercase tracking-widest text-xs py-5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
                    >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
        )}
      </div>
    </div>
  );
}

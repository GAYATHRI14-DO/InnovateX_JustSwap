
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Package, Search, Handshake, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HowItWorksPage() {
  const steps = [
    {
      title: "1. List Your Items",
      description: "Take a few photos of items you no longer need. Use our AI assistant to generate a compelling description in seconds.",
      icon: <Package className="h-8 w-8" />,
    },
    {
      title: "2. Find What You Need",
      description: "Browse thousands of items from people in your community. Filter by category, condition, or location.",
      icon: <Search className="h-8 w-8" />,
    },
    {
      title: "3. Propose a Swap",
      description: "See something you like? Offer one or more of your listed items in exchange. It's that simple—no money involved.",
      icon: <Handshake className="h-8 w-8" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-white border-b">
          <div className="container mx-auto px-4 text-center space-y-6">
            <h1 className="text-5xl lg:text-7xl font-script font-bold">How it Works</h1>
            <div className="space-y-8">
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                JustSwap is a community-driven platform designed to make bartering easy, safe, and sustainable.
              </p>
              <div className="relative max-w-3xl mx-auto aspect-[16/9] rounded-[2rem] overflow-hidden shadow-xl border bg-muted">
                <Image 
                  src="https://picsum.photos/seed/barter-swap/1200/800" 
                  alt="Barter item exchange illustration" 
                  fill 
                  className="object-cover" 
                  data-ai-hint="barter illustration"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {steps.map((step, index) => (
                <div key={index} className="space-y-6 p-8 rounded-[2rem] border-2 border-transparent hover:border-black/5 transition-all">
                  <div className="bg-black text-white h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-headline font-bold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Section */}
        <section className="py-24 bg-black text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/20 bg-white/5 text-sm font-medium">
                  <ShieldCheck className="h-4 w-4" />
                  Swap Safe Guarantee
                </div>
                <h2 className="text-4xl font-headline font-bold">Your safety is our priority.</h2>
                <p className="text-white/70 text-lg leading-relaxed">
                  We verify every user on the platform to ensure a trustworthy community. We recommend meeting in public, well-lit "Swap Zones" for all exchanges.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    Verified user profiles
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    Secure in-app messaging
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    Community ratings and reviews
                  </li>
                </ul>
              </div>
              <div className="flex-1 w-full aspect-square bg-white/10 rounded-[3rem] flex items-center justify-center border border-white/10">
                <ShieldCheck className="h-32 w-32 opacity-20" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 text-center space-y-8">
            <h2 className="text-4xl font-headline font-bold">Ready to start swapping?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/list-item">
                <Button size="lg" className="h-14 px-10 rounded-2xl font-bold text-lg bg-black hover:bg-black/90">
                  List Your First Item
                </Button>
              </Link>
              <Link href="/browse">
                <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl font-bold text-lg border-2">
                  Browse Listings
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} JustSwap. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

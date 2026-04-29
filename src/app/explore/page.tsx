
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { SwapLogo } from '@/components/layout/SwapLogo';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExplorePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const heroImage = PlaceHolderImages.find(img => img.id === 'item-camera');
  const ctaImage = PlaceHolderImages.find(img => img.id === 'community-collaboration');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-24 lg:pb-32 border-b">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
              <Badge variant="outline" className="px-4 py-1 text-black border-black/20 bg-black/5 rounded-full font-semibold uppercase tracking-widest text-[10px]">
                Bartering Reimagined
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-script font-bold leading-[1.1] text-foreground">
                Get what you <span className="font-merriweather italic text-muted-foreground">NEED</span> without money.
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Exchange items with your neighbors. justSwap helps you find new homes for your belongings while getting the things you want, sustainably.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/browse">
                  <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl bg-black text-white hover:bg-black/90">
                    Explore Listings
                  </Button>
                </Link>
                <Link href="/list-item">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-2xl border-2 border-black/10 hover:bg-black/5">
                    Post an Item
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-1000 border bg-white">
                {heroImage && (
                  <Image 
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover grayscale"
                    data-ai-hint={heroImage.imageHint}
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits / Info Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-black text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <SwapLogo className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-headline">Smart Swapping</h3>
              <p className="text-muted-foreground text-sm">Exchange items you don't use for things you actually need, without spending a dime.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-black text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <ArrowRight className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-headline">Eco-Friendly</h3>
              <p className="text-muted-foreground text-sm">Reduce your carbon footprint by giving items a second life within your local community.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-black text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Badge variant="outline" className="border-white text-white bg-black">99+</Badge>
              </div>
              <h3 className="text-xl font-bold font-headline">Community Trust</h3>
              <p className="text-muted-foreground text-sm">Connect with verified neighbors for safe, reliable, and friendly exchanges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-24">
        <div className="container mx-auto px-4">
          <div className="bg-white/5 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative shadow-2xl border border-white/10">
            <div className="flex-1 space-y-6 relative z-10">
              <h2 className="text-3xl md:text-5xl font-headline font-bold leading-tight">
                Ready to trade your first item?
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Join thousands of people who are saving money and living more sustainably by bartering. It takes less than 2 minutes to list an item.
              </p>
              <Link href="/list-item" className="inline-block">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 h-14 px-10 rounded-2xl font-bold text-lg">
                  Get Started Now
                </Button>
              </Link>
            </div>
            <div className="flex-1 relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-xl z-10 border border-white/10">
              {ctaImage && (
                <Image 
                  src={ctaImage.imageUrl} 
                  alt={ctaImage.description} 
                  fill 
                  className="object-cover grayscale"
                  data-ai-hint={ctaImage.imageHint}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 border-t bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-black text-white p-1.5 rounded-xl shadow-sm">
                  <SwapLogo className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold">justSwap</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The world's friendliest platform for bartering and item exchange. Built for community, sustainability, and saving.
              </p>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t text-center text-xs text-muted-foreground font-medium uppercase tracking-widest">
            © {new Date().getFullYear()} justSwap. Designed for Sustainability.
          </div>
        </div>
      </footer>
    </div>
  );
}

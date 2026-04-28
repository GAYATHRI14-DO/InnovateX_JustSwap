
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { ItemCard } from '@/components/items/ItemCard';
import { Button } from '@/components/ui/button';
import { ITEMS } from '@/lib/mock-data';
import { ArrowRight, RefreshCw, ShieldCheck, Heart } from 'lucide-react';
import { SwapLogo } from '@/components/layout/SwapLogo';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const firestore = useFirestore();
  const featuredItems = ITEMS.slice(0, 4);
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-camera');
  const ctaImage = PlaceHolderImages.find(img => img.id === 'sustainable-living');

  const recentSwapsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'swapProposals'),
      where('status', '==', 'Accepted'),
      limit(1)
    );
  }, [firestore]);

  const { data: recentSwaps, isLoading: isSwapsLoading } = useCollection(recentSwapsQuery);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 pb-20 lg:pt-24 lg:pb-32 border-b">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
              <Badge variant="outline" className="px-4 py-1 text-primary border-primary/20 bg-primary/5 rounded-full font-semibold uppercase tracking-widest text-[10px]">
                Bartering Reimagined
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-headline font-bold leading-[1.1] text-foreground">
                Get what you <span className="italic text-primary/60">NEED</span> without money.
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Exchange items with your neighbors. JustSwap helps you find new homes for your belongings while getting the things you want, sustainably.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/browse">
                  <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">
                    Explore Listings
                  </Button>
                </Link>
                <Link href="/list-item">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-2xl border-2 border-primary/20 hover:bg-primary/5">
                    Post an Item
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Verified
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-primary" />
                  Sustainable
                </div>
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
                
                {/* Recent Swap Activity Overlay */}
                {!isSwapsLoading && recentSwaps && recentSwaps.length > 0 && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-white animate-in slide-in-from-bottom duration-1000">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary text-white p-1.5 rounded-xl">
                        <RefreshCw className="h-3 w-3" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Recent Swap Activity</p>
                        <p className="text-xs font-medium">Someone just swapped an item!</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Grid */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-headline font-bold">Featured Items</h2>
              <p className="text-muted-foreground max-w-xl">
                Discover items available in your community right now. From electronics to plants, everything is up for trade.
              </p>
            </div>
            <Link href="/browse">
              <Button variant="link" className="text-primary underline font-bold gap-2 text-lg">
                View all items
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="bg-black rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative shadow-2xl">
            <div className="flex-1 space-y-6 relative z-10">
              <h2 className="text-3xl md:text-5xl font-headline font-bold text-white leading-tight">
                Ready to trade your first item?
              </h2>
              <p className="text-white/60 text-lg leading-relaxed">
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

      <footer className="bg-white py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-primary text-white p-1.5 rounded-xl shadow-sm">
                  <SwapLogo className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold">JustSwap</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The world's friendliest platform for bartering and item exchange. Built for community, sustainability, and saving.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-widest text-xs">Platform</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/browse" className="hover:text-primary transition-colors">Browse All Items</Link></li>
                <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-widest text-xs">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-widest text-xs">Connect</h4>
              <div className="flex gap-4">
                <div className="h-10 w-10 border rounded-full flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-all">
                  <Heart className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t text-center text-xs text-muted-foreground font-medium uppercase tracking-widest">
            © {new Date().getFullYear()} JustSwap. Designed for Sustainability.
          </div>
        </div>
      </footer>
    </div>
  );
}

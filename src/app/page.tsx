"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { ItemCard } from '@/components/items/ItemCard';
import { Button } from '@/components/ui/button';
import { ITEMS } from '@/lib/mock-data';
import { ArrowRight, RefreshCw, ShieldCheck, Heart, Loader2 } from 'lucide-react';
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
      <section className="relative overflow-hidden bg-background pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
              <Badge variant="outline" className="px-4 py-1 text-primary border-primary/20 bg-primary/5 rounded-full font-semibold">
                Bartering Reimagined
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-headline font-bold leading-[1.1] text-foreground">
                Get what you <span className="italic underline decoration-accent text-primary/80">NEED</span> without paying money.
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
              <div className="flex items-center gap-6 pt-4 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Verified Users
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  Safe Exchange
                </div>
              </div>
            </div>
            <div className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-1000">
              {heroImage && (
                <Image 
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={heroImage.imageHint}
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Recent Swap Activity Overlay */}
              {!isSwapsLoading && recentSwaps && recentSwaps.length > 0 && (
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white animate-in slide-in-from-bottom duration-1000">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary text-white p-2 rounded-xl">
                      <RefreshCw className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Swap Activity</p>
                      <p className="text-sm font-medium">Someone just swapped a vintage item!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-1" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl -z-1" />
      </section>

      {/* Featured Items Grid */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-headline font-bold">Featured Items</h2>
              <p className="text-muted-foreground max-w-xl">
                Discover items available in your community right now. From electronics to plants, everything is up for trade.
              </p>
            </div>
            <Link href="/browse">
              <Button variant="link" className="text-primary font-bold gap-2 text-lg">
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
      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
            <div className="flex-1 space-y-6 relative z-10">
              <h2 className="text-3xl md:text-5xl font-headline font-bold text-white leading-tight">
                Ready to trade your first item?
              </h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">
                Join thousands of people who are saving money and living more sustainably by bartering. It takes less than 2 minutes to list an item.
              </p>
              <Link href="/list-item" className="inline-block">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-14 px-10 rounded-2xl font-bold text-lg">
                  Get Started Now
                </Button>
              </Link>
            </div>
            <div className="flex-1 relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-xl z-10">
              {ctaImage && (
                <Image 
                  src={ctaImage.imageUrl} 
                  alt={ctaImage.description} 
                  fill 
                  className="object-cover"
                  data-ai-hint={ctaImage.imageHint}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-primary text-white p-1.5 rounded-xl shadow-sm">
                  <SwapLogo className="h-6 w-6" />
                </div>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The world's friendliest platform for bartering and item exchange. Built for community, sustainability, and saving.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/browse" className="hover:text-primary">Browse All Items</Link></li>
                <li><Link href="/how-it-works" className="hover:text-primary">How It Works</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold">Connect</h4>
              <div className="flex gap-4">
                <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                  <Heart className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} JustSwap. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

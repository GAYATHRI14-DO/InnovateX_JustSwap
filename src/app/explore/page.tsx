
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { SwapLogo } from '@/components/layout/SwapLogo';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, limit } from 'firebase/firestore';
import { ITEMS } from '@/lib/mock-data';
import { ItemCard } from '@/components/items/ItemCard';

export default function ExplorePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const heroImage = PlaceHolderImages.find(img => img.id === 'item-camera');
  const ctaImage = PlaceHolderImages.find(img => img.id === 'community-collaboration');

  const firestore = useFirestore();
  const itemsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'items'), limit(4));
  }, [firestore]);

  const { data: firestoreItems, isLoading: isItemsLoading } = useCollection(itemsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-black" />
          <p className="text-sm font-medium animate-pulse text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  const firestoreList = firestoreItems || [];
  const combinedItems = [...firestoreList, ...ITEMS];
  const uniqueItems = Array.from(new Map(combinedItems.map(item => [item.id, item])).values());
  const featuredItems = uniqueItems.filter(item => user && item.ownerId !== user.uid).slice(0, 2);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-24 lg:pb-32 border-b">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700 lg:-ml-12">
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

      {/* Featured Items Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-4xl font-headline font-bold">Featured Items</h2>
              <p className="text-muted-foreground text-lg">
                Discover items available in your community right now. From electronics to books, everything is up for trade.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {featuredItems.map(item => (
              <ItemCard key={item.id} item={{
                ...item,
                imageUrl: item.imageUrls?.[0] || item.imageUrl || `https://picsum.photos/seed/${item.id}/600/400`,
                ownerName: item.ownerName || 'Community Member',
                createdAt: item.listedDate || item.createdAt
              }} />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link href="/browse">
              <Button variant="ghost" className="font-bold gap-2 text-primary hover:bg-primary/5 px-6 rounded-xl">
                View all items
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
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

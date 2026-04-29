
"use client";

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ITEMS } from '@/lib/mock-data';
import { MapPin, Calendar, User, RefreshCw, ChevronLeft, ShieldCheck, Heart, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase, useCollection, useUser, addDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';

export default function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [selectedOfferItems, setSelectedOfferItems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch target item from Firestore
  const itemDocRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'items', id);
  }, [firestore, id]);

  const { data: firestoreItem, isLoading: isItemLoading } = useDoc(itemDocRef);

  // My items for the swap proposal
  const myItemsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'items');
  }, [firestore, user]);

  const { data: myItems, isLoading: isMyItemsLoading } = useCollection(myItemsQuery);

  // Merge Firestore data with Mock data for fallback
  const item = firestoreItem || ITEMS.find(i => i.id === id);

  if (isItemLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Listing not found</h1>
        <Link href="/browse">
          <Button variant="outline" className="rounded-xl">Back to browse</Button>
        </Link>
      </div>
    );
  }

  const handleProposeSwap = () => {
    if (!user) {
      toast({
        title: "Account required",
        description: "Please sign in to propose a swap.",
        variant: "destructive"
      });
      return;
    }

    if (selectedOfferItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one of your items to offer in exchange.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    const proposalData = {
      proposerId: user.uid,
      receiverId: item.ownerId,
      targetItemId: item.id,
      offeredItemIds: selectedOfferItems,
      proposalDate: new Date().toISOString(),
      status: 'pending',
      message: `I'd like to swap for your ${item.title}!`
    };

    const proposalsRef = collection(firestore, 'swapProposals');
    addDocumentNonBlocking(proposalsRef, proposalData)
      .then(() => {
        toast({
          title: "Swap Proposal Sent!",
          description: `Your offer has been sent to the owner.`,
        });
        router.push('/dashboard');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedOfferItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  const displayImage = item.imageUrls?.[0] || item.imageUrl || `https://picsum.photos/seed/${item.id}/800/600`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link href="/browse" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors font-medium">
          <ChevronLeft className="h-4 w-4" />
          Back to browsing
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Primary Image */}
          <div className="space-y-6">
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border bg-white">
              <Image 
                src={displayImage} 
                alt={item.title} 
                fill 
                className="object-cover" 
                data-ai-hint={item.category.toLowerCase()}
              />
            </div>
          </div>

          {/* Right Column: Info & Actions */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="px-3 py-1 text-black border-black/20 bg-black/5 rounded-full font-bold uppercase tracking-wider text-[10px]">
                  {item.category}
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  Listed {item.listedDate ? new Date(item.listedDate).toLocaleDateString() : 'recently'}
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-headline font-bold text-foreground leading-tight tracking-tight">
                {item.title}
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 font-bold">
                  <Badge className="bg-black text-white border-none rounded-lg px-3 py-1">
                    {item.condition}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <MapPin className="h-4 w-4 text-black" />
                  {item.location}
                </div>
              </div>
            </div>

            <Card className="rounded-3xl border shadow-sm overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="p-6 border-b flex items-center justify-between bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center text-white font-bold overflow-hidden border-2 border-white">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold">{item.ownerName || 'Community Member'}</p>
                      <p className="text-xs text-muted-foreground font-medium">Verified Neighbor</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-xl font-bold text-black hover:bg-black/5">
                    View Profile
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-headline font-bold text-lg">Listing Information</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex-1 h-16 rounded-2xl bg-black text-white hover:bg-black/90 text-xl font-bold gap-3 shadow-xl transition-all active:scale-[0.98]">
                    <RefreshCw className="h-6 w-6" />
                    Propose a Swap
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl rounded-[2.5rem] border-2">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-headline font-bold">What will you offer?</DialogTitle>
                    <DialogDescription className="text-base">
                      Select items from your collection to exchange for the <strong>{item.title}</strong>.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-6 space-y-4">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Your Listed Items</p>
                    <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2">
                      {myItems && myItems.length > 0 ? myItems.map(myItem => (
                        <div 
                          key={myItem.id}
                          className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                            selectedOfferItems.includes(myItem.id) 
                            ? 'border-black bg-black/5' 
                            : 'border-border hover:border-black/30'
                          }`}
                          onClick={() => toggleItemSelection(myItem.id)}
                        >
                          <Checkbox 
                            checked={selectedOfferItems.includes(myItem.id)}
                            onCheckedChange={() => toggleItemSelection(myItem.id)}
                            className="h-6 w-6 rounded-md border-2"
                          />
                          <div className="relative h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 border shadow-sm">
                            <Image src={myItem.imageUrls?.[0] || `https://picsum.photos/seed/${myItem.id}/200/200`} alt={myItem.title} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-lg truncate">{myItem.title}</p>
                            <p className="text-xs text-muted-foreground font-bold">{myItem.category} • {myItem.condition}</p>
                          </div>
                        </div>
                      )) : (
                        <div className="p-8 text-center bg-muted/30 rounded-2xl border-2 border-dashed">
                          <p className="text-muted-foreground font-medium">You haven't listed any items yet.</p>
                        </div>
                      )}
                    </div>
                    <Link href="/list-item" className="block">
                      <Button variant="outline" className="w-full border-dashed border-2 rounded-2xl py-12 hover:bg-black/5 hover:border-black/50 text-muted-foreground hover:text-black transition-all">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-lg font-bold">+ List a new item</span>
                          <span className="text-xs font-medium">Don't see what you want to trade? Add it now!</span>
                        </div>
                      </Button>
                    </Link>
                  </div>
                  <DialogFooter className="sm:justify-between items-center border-t pt-6 gap-4">
                    <p className="text-sm font-bold text-muted-foreground">
                      {selectedOfferItems.length} {selectedOfferItems.length === 1 ? 'item' : 'items'} selected
                    </p>
                    <Button 
                      onClick={handleProposeSwap} 
                      disabled={isSubmitting || selectedOfferItems.length === 0}
                      className="rounded-2xl px-10 h-14 bg-black text-white font-bold text-lg shadow-xl"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Send Proposal"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="h-16 px-8 rounded-2xl border-2 hover:bg-black/5 transition-all shadow-sm group">
                <Heart className="h-6 w-6 group-hover:fill-current" />
                <span className="sr-only">Favorite</span>
              </Button>
            </div>

            <div className="bg-muted/30 p-6 rounded-[2rem] border border-border space-y-3">
              <div className="flex items-center gap-2 text-black font-bold">
                <ShieldCheck className="h-5 w-5" />
                Secure Community Exchange
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Remember to meet in a public, well-lit place for your exchange. We prioritize the safety of our swap community.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

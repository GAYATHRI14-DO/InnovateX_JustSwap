
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
import { ITEMS, MY_ITEMS } from '@/lib/mock-data';
import { MapPin, Calendar, User, RefreshCw, ChevronLeft, ShieldCheck, Heart, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  
  const item = ITEMS.find(i => i.id === id);
  const [selectedOfferItems, setSelectedOfferItems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (selectedOfferItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one of your items to offer in exchange.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Swap Proposal Sent!",
        description: `Your offer has been sent to ${item.ownerName}.`,
      });
      router.push('/dashboard');
    }, 1500);
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedOfferItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link href="/browse" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to browsing
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border bg-white">
              <Image 
                src={item.imageUrl} 
                alt={item.title} 
                fill 
                className="object-cover" 
                data-ai-hint={item.category.toLowerCase()}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border bg-muted cursor-pointer hover:border-primary transition-all">
                   <Image 
                    src={`https://picsum.photos/seed/${item.id + i}/200/200`} 
                    alt="Thumbnail" 
                    width={200} 
                    height={200} 
                    className="object-cover opacity-50 hover:opacity-100 transition-opacity" 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Info & Actions */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="px-3 py-1 text-primary border-primary/20 bg-primary/5 rounded-full font-semibold uppercase tracking-wider text-[10px]">
                  {item.category}
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Calendar className="h-4 w-4" />
                  Listed on {item.createdAt}
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-headline font-bold text-foreground leading-tight">
                {item.title}
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 font-medium">
                  <Badge className="bg-accent text-accent-foreground border-none">
                    {item.condition}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  {item.location}
                </div>
              </div>
            </div>

            <Card className="rounded-3xl border bg-white shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 border-b flex items-center justify-between bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden border-2 border-white">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold">{item.ownerName}</p>
                      <p className="text-xs text-muted-foreground">Verified Neighbor</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-xl font-bold text-primary hover:bg-primary/5">
                    View Profile
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-headline font-bold">Item Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex-1 h-16 rounded-2xl bg-black text-white hover:bg-black/90 text-xl font-bold gap-2 shadow-lg transition-transform active:scale-[0.98]">
                    <RefreshCw className="h-6 w-6" />
                    Propose a Swap
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl rounded-[2.5rem]">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-headline font-bold">What will you offer?</DialogTitle>
                    <DialogDescription className="text-base">
                      Select one or more items from your collection to exchange for the <strong>{item.title}</strong>.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-6 space-y-4">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Your Listed Items</p>
                    <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2">
                      {MY_ITEMS.map(myItem => (
                        <div 
                          key={myItem.id}
                          className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                            selectedOfferItems.includes(myItem.id) 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/30'
                          }`}
                          onClick={() => toggleItemSelection(myItem.id)}
                        >
                          <Checkbox 
                            checked={selectedOfferItems.includes(myItem.id)}
                            onCheckedChange={() => toggleItemSelection(myItem.id)}
                            className="h-6 w-6 rounded-md"
                          />
                          <div className="relative h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 border shadow-sm">
                            <Image src={myItem.imageUrl} alt={myItem.title} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-lg truncate">{myItem.title}</p>
                            <p className="text-xs text-muted-foreground font-medium">{myItem.category} • {myItem.condition}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link href="/list-item" className="block">
                      <Button variant="outline" className="w-full border-dashed rounded-2xl py-10 hover:bg-primary/5 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-lg font-bold">+ List a new item</span>
                          <span className="text-xs">Don't see what you want to trade? Add it now!</span>
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

              <Button variant="outline" className="h-16 px-8 rounded-2xl border-2 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all shadow-sm group">
                <Heart className="h-6 w-6 group-hover:fill-current" />
                <span className="sr-only">Favorite</span>
              </Button>
            </div>

            <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold">
                <ShieldCheck className="h-5 w-5" />
                Swap Safe Exchange
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Remember to meet in a public, well-lit place for your exchange. Safety first!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

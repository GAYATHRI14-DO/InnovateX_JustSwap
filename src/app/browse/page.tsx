
"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ItemCard } from '@/components/items/ItemCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, Loader2 } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function BrowsePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [condition, setCondition] = useState('all');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  const firestore = useFirestore();
  const itemsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'items');
  }, [firestore]);

  const { data: items, isLoading } = useCollection(itemsQuery);

  const filteredItems = (items || []).filter(item => {
    // Hide current user's items from their own browse feed
    if (user && item.ownerId === user.uid) return false;

    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || item.category === category;
    const matchesCondition = condition === 'all' || item.condition === condition;
    return matchesSearch && matchesCategory && matchesCondition;
  });

  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-headline font-bold">Browse Listings</h1>
            <p className="text-muted-foreground">Discover unique items for trade from your local community.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search items, keywords..." 
                  className="pl-10 h-12 rounded-xl" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Sporting Goods">Sporting Goods</SelectItem>
                  <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Books">Books</SelectItem>
                </SelectContent>
              </Select>

              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Condition</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Like New">Like New</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin" />
              <p>Loading the marketplace...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <ItemCard key={item.id} item={{
                  ...item,
                  imageUrl: item.imageUrls?.[0] || `https://picsum.photos/seed/${item.id}/600/400`,
                  ownerName: 'Community Member',
                  createdAt: item.listedDate
                }} />
              ))}
            </div>
          )}

          {!isLoading && filteredItems.length === 0 && (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
              <div className="max-w-xs mx-auto space-y-4">
                <div className="bg-muted h-16 w-16 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">No items found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query. Note that your own listings are managed in your dashboard.</p>
                <Button 
                  onClick={() => {setSearchQuery(''); setCategory('all'); setCondition('all');}}
                  variant="outline" 
                  className="rounded-xl"
                >
                  Clear all filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

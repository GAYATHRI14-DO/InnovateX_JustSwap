
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, User, Bell, RefreshCw } from 'lucide-react';
import { SwapLogo } from './SwapLogo';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/browse');
    }
  };

  // Real-time listener for incoming swap proposals (Notifications)
  const incomingProposalsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'swapProposals'),
      where('targetItemOwnerId', '==', user.uid),
      where('status', '==', 'Pending')
    );
  }, [firestore, user]);

  const { data: notifications, isLoading } = useCollection(incomingProposalsQuery);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between gap-4">
        
        {/* Left Section: Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-primary text-white p-2 rounded-xl group-hover:bg-primary/90 transition-colors shadow-sm">
            <SwapLogo className="h-6 w-6" />
          </div>
          <span className="text-2xl font-headline font-bold tracking-tight text-foreground hidden sm:block">JustSwap</span>
        </Link>

        {/* Center Section: Nav Links and Search Toggle */}
        <div className="flex-1 flex justify-center items-center gap-8 max-w-2xl">
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium shrink-0">
            <Link href="/" className="transition-colors hover:text-primary">Home</Link>
            <Link href="/about" className="transition-colors hover:text-primary">About</Link>
            <Link href="/how-it-works" className="transition-colors hover:text-primary">Guide</Link>
          </div>

          <form onSubmit={handleSearch} className="relative w-full max-w-[200px] hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Search..." 
              className="pl-9 h-9 rounded-xl bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          
          <Link href="/browse" className="lg:hidden">
            <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/5 rounded-full">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/list-item" className="hidden sm:block">
            <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/5 rounded-xl">
              <PlusCircle className="h-4 w-4" />
              List Item
            </Button>
          </Link>

          {/* Notifications Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/5 rounded-full relative">
                <Bell className="h-5 w-5" />
                {notifications && notifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 border-2 border-white text-[10px] text-white rounded-full">
                    {notifications.length}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 rounded-2xl overflow-hidden shadow-2xl border-primary/10" align="end">
              <div className="p-4 bg-primary text-white">
                <h4 className="font-headline font-bold">Notifications</h4>
                <p className="text-xs text-white/70">
                  {notifications?.length || 0} pending swap proposals
                </p>
              </div>
              <ScrollArea className="h-80">
                {isLoading ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">Checking for updates...</div>
                ) : notifications && notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.map((notif) => (
                      <Link 
                        key={notif.id} 
                        href={`/proposals/${notif.id}`} 
                        className="block p-4 hover:bg-primary/5 transition-colors"
                      >
                        <div className="flex gap-3">
                          <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                            <RefreshCw className="h-5 w-5 text-accent-foreground" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-tight">
                              New Swap Proposal!
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {notif.message || "Someone wants to trade with you."}
                            </p>
                            <p className="text-[10px] text-primary/60 font-medium">
                              {notif.proposalDate ? new Date(notif.proposalDate).toLocaleDateString() : 'Pending'}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center space-y-2">
                    <Bell className="h-8 w-8 text-muted-foreground mx-auto opacity-20" />
                    <p className="text-sm text-muted-foreground">No new notifications</p>
                  </div>
                )}
              </ScrollArea>
              <div className="p-2 border-t bg-muted/30 text-center">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="w-full text-xs font-bold text-primary">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </PopoverContent>
          </Popover>

          <Link href="/dashboard">
            <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/5 rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>
        </div>

      </div>
    </nav>
  );
}

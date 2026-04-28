
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, User, Bell, UserPlus, Loader2 } from 'lucide-react';
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
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/browse');
    }
  };

  // Notifications query
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
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur px-4 py-3">
      <div className="container mx-auto flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-primary text-white p-2 rounded-xl">
            <SwapLogo className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold hidden sm:block">JustSwap</span>
        </Link>

        {/* Center */}
        <div className="flex-1 flex justify-center items-center gap-8 max-w-2xl">
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/how-it-works">Guide</Link>
          </div>

          <form onSubmit={handleSearch} className="relative w-full max-w-[200px] hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Search..." 
              className="pl-9 h-9 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <Link href="/browse" className="lg:hidden">
            <Button size="icon" variant="ghost">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          <Link href="/list-item" className="hidden sm:block">
            <Button variant="outline" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              List Item
            </Button>
          </Link>

          {/* Notifications */}
          {user && (
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" variant="ghost" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications && notifications.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-[10px] text-white">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-80 p-0">
                <div className="p-4 bg-primary text-white">
                  <h4>Notifications</h4>
                  <p className="text-xs">
                    {notifications?.length || 0} pending
                  </p>
                </div>

                <ScrollArea className="h-80">
                  {isLoading ? (
                    <div className="p-6 text-center">Loading...</div>
                  ) : notifications?.length ? (
                    notifications.map((notif) => (
                      <Link key={notif.id} href={`/proposals/${notif.id}`} className="block p-4">
                        <p className="text-sm font-medium">New Swap Proposal</p>
                        <p className="text-xs">{notif.message}</p>
                      </Link>
                    ))
                  ) : (
                    <div className="p-6 text-center">No notifications</div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>
          )}

          {/* USER SECTION */}
          {isUserLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              {user ? (
                <Link href="/dashboard">
                  <Button variant="ghost" size="icon" title="Account">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              ) : null}
              <Link href="/signup">
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

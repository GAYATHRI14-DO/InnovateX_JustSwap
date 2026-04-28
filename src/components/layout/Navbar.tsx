
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, User } from 'lucide-react';
import { SwapLogo } from './SwapLogo';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/browse');
    }
  };

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
            <Link href="/how-it-works" className="transition-colors hover:text-primary">How it Works</Link>
            <Link href="/" className="transition-colors hover:text-primary">Home</Link>
            <Link href="/about" className="transition-colors hover:text-primary">About</Link>
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
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/list-item" className="hidden sm:block">
            <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/5 rounded-xl">
              <PlusCircle className="h-4 w-4" />
              List Item
            </Button>
          </Link>

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

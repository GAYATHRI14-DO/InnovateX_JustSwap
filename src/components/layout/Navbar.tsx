
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, PlusCircle, User } from 'lucide-react';
import { SwapLogo } from './SwapLogo';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between gap-4">
        
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-white p-2 rounded-xl group-hover:bg-primary/90 transition-colors shadow-sm">
            <SwapLogo className="h-6 w-6" />
          </div>
          <span className="text-2xl font-headline font-bold tracking-tight text-foreground">JustSwap</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/browse" className="transition-colors hover:text-primary">Browse</Link>
          <Link href="/how-it-works" className="transition-colors hover:text-primary">How it Works</Link>
          <Link href="/about" className="transition-colors hover:text-primary">About</Link>
        </div>

        <div className="flex items-center gap-2">
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

          <Link href="/browse">
            <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/5 rounded-full">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>
        </div>

      </div>
    </nav>
  );
}


"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, PlusCircle, User } from 'lucide-react';

function SwapLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2.5 14C2.5 9 7 6 11 11C11 11 8 18 2.5 14Z" />
      <path d="M21.5 10C21.5 15 17 18 13 13C13 13 16 6 21.5 10Z" />
    </svg>
  );
}

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary text-white p-1 rounded-lg">
            <SwapLogo className="h-7 w-7" />
          </div>
          <span className="text-2xl font-headline font-bold tracking-tight text-primary">Swap</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/browse" className="transition-colors hover:text-primary">Browse</Link>
          <Link href="/how-it-works" className="transition-colors hover:text-primary">How it Works</Link>
          <Link href="/about" className="transition-colors hover:text-primary">About</Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/list-item" className="hidden sm:block">
            <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/5">
              <PlusCircle className="h-4 w-4" />
              List Item
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/5">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>
          <Link href="/browse">
            <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/5">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

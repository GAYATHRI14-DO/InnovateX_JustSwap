"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useAuth,
  useUser,
  initiateGoogleSignIn,
  initiateAnonymousSignIn,
} from "@/firebase";
import { Button } from "@/components/ui/button";
import { SwapLogo } from "@/components/layout/SwapLogo";
import { Loader2, ShieldCheck, Users, ArrowRight, Leaf } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [authStatus, setAuthStatus] = useState<string | null>(null);

  const loginHeroImage = PlaceHolderImages.find(img => img.id === 'barter-hero');

  useEffect(() => {
    // If user is already authenticated, move them into the app
    if (!isUserLoading && user) {
      router.push("/explore");
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsProcessing(true);
      setAuthStatus("Connecting to Google...");
      await initiateGoogleSignIn(auth);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      setAuthStatus(null);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setIsProcessing(true);
      setAuthStatus("Setting up Guest access...");
      await initiateAnonymousSignIn(auth);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      setAuthStatus(null);
    }
  };

  if (isUserLoading || (user && !isProcessing)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-sm font-medium animate-pulse text-primary">Checking your credentials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Column: Brand & Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           {loginHeroImage && (
             <Image 
               src={loginHeroImage.imageUrl} 
               alt="Community Trading" 
               fill 
               className="object-cover"
               priority
             />
           )}
           <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/60 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full max-w-lg space-y-12 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-accent text-accent-foreground p-2.5 rounded-2xl shadow-lg">
              <SwapLogo className="h-8 w-8" />
            </div>
            <span className="text-3xl font-bold font-headline tracking-tighter">SwapIt</span>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-7xl font-headline font-bold leading-[0.95] tracking-tighter">
              The Smarter Way <br />
              <span className="text-accent">to Exchange.</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed font-medium">
              Join a growing community of neighbors bartering items sustainably. Save money, reduce waste, and connect locally.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 pt-10 border-t border-white/20">
            <div className="flex gap-5 items-start">
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
                <ShieldCheck className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-xl font-headline">Verified Exchange</h3>
                <p className="text-white/60 leading-relaxed text-sm">Every user is verified to ensure safe and trustworthy local swaps.</p>
              </div>
            </div>
            <div className="flex gap-5 items-start">
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
                <Leaf className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-xl font-headline">Eco-Friendly Living</h3>
                <p className="text-white/60 leading-relaxed text-sm">Extend the life of products and lower your carbon footprint with every trade.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Actions */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-24 bg-white/50 backdrop-blur-sm">
        <div className="w-full max-w-sm space-y-12">
          {isProcessing ? (
            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="relative h-28 w-28 mx-auto">
                <div className="absolute inset-0 border-4 border-primary/10 rounded-[2rem]"></div>
                <div className="absolute inset-0 border-4 border-primary rounded-[2rem] border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <SwapLogo className="h-10 w-10 text-primary" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-headline font-bold tracking-tight">Hang tight!</h2>
                <p className="text-muted-foreground font-medium">{authStatus || "Securing your session..."}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="lg:hidden flex flex-col items-center gap-4 mb-12">
                <div className="bg-primary text-white p-4 rounded-[2rem] shadow-xl">
                  <SwapLogo className="h-10 w-10" />
                </div>
                <h2 className="text-4xl font-headline font-bold tracking-tighter text-primary">SwapIt</h2>
              </div>

              <div className="space-y-4 text-center lg:text-left">
                <h1 className="text-5xl font-headline font-bold tracking-tighter leading-tight">Welcome Back</h1>
                <p className="text-muted-foreground text-xl">Sign in to start bartering with your local community.</p>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleGoogleSignIn} 
                  className="w-full h-16 text-lg font-bold rounded-[1.75rem] bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-4 shadow-xl transition-all active:scale-[0.98]"
                >
                  <img src="https://developers.google.com/identity/images/g-logo.png" className="w-6 h-6 bg-white rounded-full p-1" alt="Google" />
                  Continue with Google
                </Button>

                <Button 
                  onClick={handleGuestSignIn} 
                  variant="outline"
                  className="w-full h-16 text-lg font-bold rounded-[1.75rem] border-2 border-primary/20 text-primary hover:bg-primary/5 transition-all active:scale-[0.98]"
                >
                  Continue as Guest
                </Button>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground font-medium">
                  New to SwapIt?{" "}
                  <Link href="/signup" className="text-primary font-bold hover:underline underline-offset-4">
                    Create an Account
                  </Link>
                </p>
              </div>

              <div className="pt-16 border-t border-primary/10 text-center">
                <div className="flex items-center justify-center gap-2 text-[10px] text-primary/40 uppercase tracking-[0.25em] font-bold">
                  <Leaf className="h-3 w-3" />
                  Sustainable Bartering
                  <Leaf className="h-3 w-3" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
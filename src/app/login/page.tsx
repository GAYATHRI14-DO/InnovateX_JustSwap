
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
import { Loader2, ShieldCheck, Leaf } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [authStatus, setAuthStatus] = useState<string | null>(null);

  const loginHeroImage = PlaceHolderImages.find(img => img.id === 'barter-hero');

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push("/");
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
        <p className="text-sm font-medium animate-pulse text-primary">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
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
            <div className="bg-white text-black p-2.5 rounded-2xl shadow-lg">
              <SwapLogo className="h-8 w-8" />
            </div>
            <span className="text-3xl font-bold font-headline tracking-tighter">justSwap</span>
          </div>
          <div className="space-y-6">
            <h1 className="text-7xl font-headline font-bold leading-[0.95] tracking-tighter">
              The Smarter Way <br />
              <span className="text-accent text-white/90">to Exchange.</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed font-medium">
              Join a growing community of neighbors bartering items sustainably. Save money, reduce waste, and connect locally.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-sm space-y-12">
          {isProcessing ? (
            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
              <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
              <h2 className="text-3xl font-headline font-bold tracking-tight">{authStatus}</h2>
            </div>
          ) : (
            <>
              <div className="space-y-4 text-center lg:text-left">
                <h1 className="text-5xl font-headline font-bold tracking-tighter leading-tight">Welcome Back</h1>
                <p className="text-muted-foreground text-xl">Sign in to start bartering with your local community.</p>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleGoogleSignIn} 
                  className="w-full h-16 text-lg font-bold rounded-2xl bg-black text-white hover:bg-black/90 flex items-center justify-center gap-4 shadow-xl"
                >
                  <img src="https://developers.google.com/identity/images/g-logo.png" className="w-6 h-6 bg-white rounded-full p-1" alt="Google" />
                  Continue with Google
                </Button>
                <Button 
                  onClick={handleGuestSignIn} 
                  variant="outline"
                  className="w-full h-16 text-lg font-bold rounded-2xl border-2 border-black/10 text-black hover:bg-black/5"
                >
                  Continue as Guest
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

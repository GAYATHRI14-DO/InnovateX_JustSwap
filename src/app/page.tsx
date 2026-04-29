
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
import { Loader2, ShieldCheck, Users, ArrowRight } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function HomePage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [authStatus, setAuthStatus] = useState<string | null>(null);

  const heroImage = PlaceHolderImages.find(img => img.id === 'starry-night');

  useEffect(() => {
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
        <p className="text-sm font-medium animate-pulse">Initializing justSwap...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side: Visual/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 opacity-60">
           {heroImage && (
             <Image 
               src={heroImage.imageUrl} 
               alt="Branding Background" 
               fill 
               className="object-cover"
               priority
             />
           )}
           <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 w-full max-w-lg space-y-12 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white text-black p-2 rounded-xl">
              <SwapLogo className="h-8 w-8" />
            </div>
            <span className="text-3xl font-bold font-headline tracking-tight">justSwap</span>
          </div>
          
          <h1 className="text-7xl font-script leading-[1.1] text-white">
            Exchange your things, <br />
            <span className="text-white/70 italic">Connect your community.</span>
          </h1>

          <div className="space-y-8 pt-8 border-t border-white/10">
            <div className="flex gap-4 items-start">
              <div className="bg-white/10 p-2 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Secure & Private</h3>
                <p className="text-white/60 leading-relaxed">Your data is safe, and every exchange is verified for community trust.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-white/10 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Community Driven</h3>
                <p className="text-white/60 leading-relaxed">Join thousands of neighbors who are already redefining ownership.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-sm space-y-10">
          {isProcessing ? (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="relative h-24 w-24 mx-auto">
                <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <SwapLogo className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-headline font-bold">Authenticating</h2>
                <p className="text-muted-foreground">{authStatus || "Please wait..."}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="lg:hidden flex flex-col items-center gap-4 mb-12">
                <div className="bg-black text-white p-3 rounded-2xl">
                  <SwapLogo className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter">justSwap</h2>
              </div>

              <div className="space-y-3 text-center lg:text-left">
                <h1 className="text-4xl font-headline font-bold tracking-tight">Welcome Back</h1>
                <p className="text-muted-foreground text-lg">Sign in to start swapping items with your neighbors.</p>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleGoogleSignIn} 
                  className="w-full h-14 text-lg font-bold rounded-2xl bg-black text-white hover:bg-black/90 flex items-center justify-center gap-3 shadow-lg transition-transform active:scale-[0.98]"
                >
                  <img src="https://developers.google.com/identity/images/g-logo.png" className="w-5 h-5" alt="Google" />
                  Continue with Google
                </Button>

                <Button 
                  onClick={handleGuestSignIn} 
                  variant="outline"
                  className="w-full h-14 text-lg font-bold rounded-2xl border-2 hover:bg-black/5 transition-all"
                >
                  Continue as Guest
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  New to the platform?{" "}
                  <Link href="/signup" className="text-black font-bold hover:underline">
                    Create an Account
                  </Link>
                </p>
              </div>

              <div className="pt-12 border-t text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                  Sustainable Bartering • Community First
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useAuth,
  initiateGoogleSignIn,
  initiateAnonymousSignIn,
} from "@/firebase";
import { Button } from "@/components/ui/button";
import { SwapLogo } from "@/components/layout/SwapLogo";
import { Loader2, ShieldCheck, Users } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const heroImage = PlaceHolderImages.find(img => img.id === 'item-camera');

  const handleGoogleSignIn = async () => {
    try {
      setIsLoggingIn(true);
      await initiateGoogleSignIn(auth);
      router.push("/explore");
    } catch (error) {
      console.error(error);
      setIsLoggingIn(false);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setIsLoggingIn(true);
      await initiateAnonymousSignIn(auth);
      router.push("/explore");
    } catch (error) {
      console.error(error);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side: Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           {heroImage && (
             <Image 
               src={heroImage.imageUrl} 
               alt="Branding" 
               fill 
               className="object-cover grayscale"
               priority
             />
           )}
        </div>
        <div className="relative z-10 max-w-lg space-y-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white text-black p-2 rounded-xl">
              <SwapLogo className="h-8 w-8" />
            </div>
            <span className="text-3xl font-bold font-headline">justSwap</span>
          </div>
          <h1 className="text-6xl font-script font-bold leading-tight">
            Exchange your things, <br />
            <span className="text-white/60">Connect your community.</span>
          </h1>
          <div className="grid grid-cols-1 gap-6 pt-8">
            <div className="flex gap-4">
              <ShieldCheck className="h-6 w-6 shrink-0" />
              <div>
                <h3 className="font-bold text-lg">Secure & Private</h3>
                <p className="text-white/60">Your data is safe, and exchanges are verified.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Users className="h-6 w-6 shrink-0" />
              <div>
                <h3 className="font-bold text-lg">Community Driven</h3>
                <p className="text-white/60">Join thousands of neighbors already swapping.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden flex flex-col items-center gap-4 mb-8">
            <div className="bg-black text-white p-3 rounded-2xl">
              <SwapLogo className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold">justSwap</h2>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-headline font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to start swapping items with your neighbors.</p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleGoogleSignIn} 
              disabled={isLoggingIn}
              className="w-full h-14 text-lg font-bold rounded-2xl bg-black text-white hover:bg-black/90 flex items-center justify-center gap-3"
            >
              {isLoggingIn ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <img src="https://developers.google.com/identity/images/g-logo.png" className="w-5 h-5" alt="Google" />
                  Continue with Google
                </>
              )}
            </Button>

            <Button 
              onClick={handleGuestSignIn} 
              disabled={isLoggingIn}
              variant="outline"
              className="w-full h-14 text-lg font-bold rounded-2xl border-2 hover:bg-black/5"
            >
              Continue as Guest
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              New to the platform?{" "}
              <Link href="/login" className="text-black font-bold hover:underline">
                Create an Account
              </Link>
            </p>
          </div>

          <div className="pt-8 border-t">
            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-medium">
              Sustainable Bartering • Community First
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

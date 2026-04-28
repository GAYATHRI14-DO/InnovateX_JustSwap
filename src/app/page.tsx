"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useUser, initiateGoogleSignIn, initiateAnonymousSignIn } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SwapLogo } from "@/components/layout/SwapLogo";
import { Loader2, Globe, Users, ArrowRight } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LandingAuthPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const heroImage = PlaceHolderImages.find(img => img.id === 'sustainable-living');

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push("/explore");
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = () => {
    setIsLoggingIn(true);
    initiateGoogleSignIn(auth);
  };

  const handleGuestSignIn = () => {
    setIsLoggingIn(true);
    initiateAnonymousSignIn(auth);
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-black/10">
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 gap-12 max-w-7xl mx-auto w-full">
        
        {/* Left Side: Illustration & Value Prop */}
        <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left duration-700">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-3 rounded-2xl shadow-lg rotate-3">
              <SwapLogo className="h-8 w-8" />
            </div>
            <span className="text-4xl font-headline font-bold text-foreground">justSwap</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-headline font-bold leading-tight text-foreground">
              Exchange Smart. <br />
              <span className="text-muted-foreground italic">Live Sustainable.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              Join your local community in reducing waste and saving money. Swap items you no longer need for things you want, sustainably.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="flex items-start gap-3">
              <div className="bg-black/5 p-2 rounded-xl text-foreground">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold">Eco-Friendly</h3>
                <p className="text-sm text-muted-foreground">Reduce landfill waste through local item circulation.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-black/5 p-2 rounded-xl text-foreground">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold">Community-First</h3>
                <p className="text-sm text-muted-foreground">Build trust and connections with your actual neighbors.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right duration-700 delay-200">
          <Card className="rounded-[3rem] border-2 border-black/5 shadow-2xl overflow-hidden bg-white">
            <CardContent className="p-10 text-center space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-headline font-bold">Welcome</h2>
                <p className="text-muted-foreground">Let's get you swapping.</p>
              </div>

              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-inner border bg-muted group">
                {heroImage && (
                  <Image 
                    src={heroImage.imageUrl} 
                    alt={heroImage.description} 
                    fill 
                    className="object-cover grayscale transition-transform duration-500 group-hover:scale-110" 
                    data-ai-hint={heroImage.imageHint}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              <div className="space-y-4 pt-4">
                <Button 
                  onClick={handleGoogleSignIn}
                  disabled={isLoggingIn}
                  className="w-full h-16 rounded-2xl bg-white border-2 border-black/10 text-foreground font-bold text-lg hover:bg-black/5 hover:border-black/20 shadow-sm transition-all flex items-center justify-center gap-3"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleGuestSignIn}
                    disabled={isLoggingIn}
                    className="text-sm font-bold text-black hover:text-black/70 transition-colors"
                  >
                    Continue as Guest
                  </button>
                  <p className="text-[10px] text-muted-foreground px-4">
                    By continuing, you agree to our <Link href="#" className="underline hover:text-foreground">Terms</Link> & <Link href="#" className="underline hover:text-foreground">Privacy Policy</Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="p-8 text-center border-t border-black/5">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          Made for the planet. © {new Date().getFullYear()} justSwap
        </p>
      </footer>
    </div>
  );
}
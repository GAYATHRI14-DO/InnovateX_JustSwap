
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
import { Card, CardContent } from "@/components/ui/card";
import { SwapLogo } from "@/components/layout/SwapLogo";
import { Loader2, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function SignupPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [authStatus, setAuthStatus] = useState<string | null>(null);

  const heroImage = PlaceHolderImages.find((img) => img.id === "item-camera");

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push("/explore");
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsProcessing(true);
      setAuthStatus("Creating your account...");
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
      setAuthStatus("Preparing preview mode...");
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
        <p className="text-sm font-medium animate-pulse">Initializing account...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 max-w-7xl mx-auto w-full">
        <div className="w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          {/* LEFT SIDE */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-black text-white p-3 rounded-2xl">
                <SwapLogo className="h-8 w-8" />
              </div>
              <span className="text-4xl font-bold">justSwap</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Exchange Smart. <br />
              <span className="italic text-muted-foreground">
                Live Sustainable.
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Join our community-driven platform to exchange items with neighbors.
              No money required — just smart, eco-friendly swapping.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-bold">Verified Trust</h3>
                  <p className="text-sm text-muted-foreground">
                    Safe and secure peer-to-peer exchanges.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-bold">Local Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Find and swap items within your own area.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full max-w-md">
            <Card className="rounded-[3rem] shadow-2xl bg-white border-2 overflow-hidden">
              <CardContent className="p-10 text-center space-y-8">
                {isProcessing ? (
                  <div className="py-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">Welcome aboard</h2>
                      <p className="text-muted-foreground">{authStatus}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-headline font-bold">Get Started</h2>
                      <p className="text-muted-foreground">
                        Create your account to start bartering.
                      </p>
                    </div>

                    <div className="relative w-48 h-48 mx-auto rounded-3xl overflow-hidden shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                      {heroImage && (
                        <Image
                          src={heroImage.imageUrl}
                          alt={heroImage.description}
                          fill
                          className="object-cover grayscale hover:grayscale-0 transition-all"
                        />
                      )}
                    </div>

                    <div className="space-y-4">
                      <Button
                        onClick={handleGoogleSignIn}
                        className="w-full h-14 text-lg font-bold flex items-center justify-center gap-3 rounded-2xl transition-all active:scale-[0.98]"
                      >
                        <img
                          src="https://developers.google.com/identity/images/g-logo.png"
                          className="w-5 h-5"
                          alt="Google"
                        />
                        Sign up with Google
                      </Button>

                      <button
                        onClick={handleGuestSignIn}
                        className="text-sm font-bold text-muted-foreground hover:text-black flex items-center justify-center gap-1 mx-auto group"
                      >
                        Just browsing? Continue as Guest
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>

                    <div className="pt-4 space-y-4">
                      <p className="text-xs text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-bold text-black underline underline-offset-4">Sign in</Link>
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        By signing up, you agree to our{" "}
                        <Link href="#" className="hover:text-black underline">Terms</Link> &{" "}
                        <Link href="#" className="hover:text-black underline">Privacy Policy</Link>
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center text-xs text-muted-foreground font-medium uppercase tracking-widest">
        © {new Date().getFullYear()} justSwap • Built for Sustainability
      </footer>
    </div>
  );
}

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
import { Card, CardContent } from "@/components/ui/card";
import { SwapLogo } from "@/components/layout/SwapLogo";
import { Loader2, Users, ShieldCheck } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function SignupPage() {
  const auth = useAuth();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const heroImage = PlaceHolderImages.find(
    (img) => img.id === "item-camera"
  );

  // ✅ Google login
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

  // ✅ Guest login
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

            <p className="text-lg text-muted-foreground max-w-lg">
              A community-driven platform to exchange items with neighbors.
              No money — just smart swapping.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex gap-3">
                <ShieldCheck className="h-5 w-5" />
                <div>
                  <h3 className="font-bold">Verified Trust</h3>
                  <p className="text-sm text-muted-foreground">
                    Safe and secure exchanges.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Users className="h-5 w-5" />
                <div>
                  <h3 className="font-bold">Local Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Swap within your area.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full max-w-md">
            <Card className="rounded-3xl shadow-xl bg-white">
              <CardContent className="p-8 text-center space-y-6">

                <div>
                  <h2 className="text-2xl font-bold">Start Swapping</h2>
                  <p className="text-muted-foreground">
                    Sign in to continue
                  </p>
                </div>

                {/* IMAGE */}
                <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden">
                  {heroImage && (
                    <Image
                      src={heroImage.imageUrl}
                      alt={heroImage.description}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* BUTTONS */}
                <div className="space-y-4">

                  <Button
                    onClick={handleGoogleSignIn}
                    disabled={isLoggingIn}
                    className="w-full h-14 text-lg flex items-center justify-center gap-3"
                  >
                    {isLoggingIn ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      <>
                        <img
                          src="https://developers.google.com/identity/images/g-logo.png"
                          className="w-5 h-5"
                        />
                        Continue with Google
                      </>
                    )}
                  </Button>

                  <button
                    onClick={handleGuestSignIn}
                    disabled={isLoggingIn}
                    className="text-sm font-semibold hover:underline"
                  >
                    Continue as Guest
                  </button>

                  <p className="text-xs text-muted-foreground">
                    By continuing, you agree to{" "}
                    <Link href="#" className="underline">Terms</Link> &{" "}
                    <Link href="#" className="underline">Privacy</Link>
                  </p>

                </div>

              </CardContent>
            </Card>
          </div>

        </div>

      </main>

      <footer className="p-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} justSwap
      </footer>
    </div>
  );
}

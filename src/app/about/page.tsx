"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Heart, Leaf, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const missionImage = PlaceHolderImages.find(img => img.id === 'community-collaboration');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-white border-b">
          <div className="container mx-auto px-4 text-center space-y-6">
            <h1 className="text-5xl lg:text-7xl font-script font-bold text-primary">Our Story</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              JustSwap began with a simple idea: that our communities are full of untapped value, and that bartering can be a powerful tool for sustainability and connection.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-muted">
                {missionImage && (
                  <Image 
                    src={missionImage.imageUrl} 
                    alt={missionImage.description} 
                    fill 
                    className="object-cover"
                    data-ai-hint={missionImage.imageHint}
                  />
                )}
              </div>
              <div className="space-y-8">
                <h2 className="text-4xl font-headline font-bold">Redefining Ownership</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  In a world of constant consumption, JustSwap offers a different path. We believe that many of the things we need are already sitting in our neighbors' homes, waiting for a new purpose. 
                </p>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0">
                      <Leaf className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Sustainability First</h4>
                      <p className="text-muted-foreground">Reducing waste by extending the lifecycle of products through community exchange.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Stronger Communities</h4>
                      <p className="text-muted-foreground">Facilitating direct interactions that build trust and social ties between neighbors.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="py-24 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-headline font-bold">What We Stand For</h2>
              <p className="text-white/80 max-w-xl mx-auto">Our core principles guide every decision we make and every feature we build.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 rounded-[2rem] bg-white/10 border border-white/20 space-y-4">
                <Heart className="h-8 w-8" />
                <h3 className="text-2xl font-bold">Empathy</h3>
                <p className="text-white/80">We build tools that foster understanding and kindness in every transaction.</p>
              </div>
              <div className="p-8 rounded-[2rem] bg-white/10 border border-white/20 space-y-4">
                <ShieldCheck className="h-8 w-8" />
                <h3 className="text-2xl font-bold">Safety</h3>
                <p className="text-white/80">Your security is our top priority, with verified profiles and safe exchange guidelines.</p>
              </div>
              <div className="p-8 rounded-[2rem] bg-white/10 border border-white/20 space-y-4">
                <Leaf className="h-8 w-8" />
                <h3 className="text-2xl font-bold">Eco-Conscious</h3>
                <p className="text-white/80">Every swap is a small victory for the planet, reducing carbon footprints one item at a time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Style Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-4xl font-headline font-bold text-center mb-12">Why JustSwap?</h2>
            <div className="space-y-8">
              <div className="p-8 rounded-3xl border hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2">Is it really free?</h3>
                <p className="text-muted-foreground">Yes. JustSwap is a bartering platform. We don't handle payments because we believe in the value of the items themselves. You exchange what you have for what you want.</p>
              </div>
              <div className="p-8 rounded-3xl border hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2">How do I meet people?</h3>
                <p className="text-muted-foreground">We encourage users to meet in public, well-lit "Swap Zones"—like local coffee shops or community centers. Our messaging system keeps your personal details private until you're ready to meet.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-primary/5">
          <div className="container mx-auto px-4 text-center space-y-8">
            <h2 className="text-4xl font-headline font-bold">Join the Movement</h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Start trading, start connecting, and start living more sustainably today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/browse">
                <Button size="lg" className="h-14 px-10 rounded-2xl font-bold text-lg bg-primary hover:bg-primary/90">
                  Browse Items
                </Button>
              </Link>
              <Link href="/list-item">
                <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl font-bold text-lg border-primary/20 hover:bg-primary/5">
                  List an Item
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} JustSwap. All rights reserved.
        </div>
      </footer>
    </div>
  );
}


"use client";

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CURRENT_USER } from '@/lib/mock-data';
import { Camera, ChevronLeft, Save, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function EditProfilePage() {
  const [name, setName] = useState(CURRENT_USER.name);
  const [email, setEmail] = useState(CURRENT_USER.email);
  const [bio, setBio] = useState('Passionate about sustainability and community building through bartering.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-headline font-bold">Edit Profile</h1>
            <p className="text-muted-foreground">Manage your public presence and account settings.</p>
          </div>

          <Card className="rounded-3xl border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b pb-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                    <AvatarImage src={CURRENT_USER.avatar} />
                    <AvatarFallback>SS</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <CardTitle className="text-xl">{name}</CardTitle>
                  <p className="text-sm text-muted-foreground">Profile Picture</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-xl"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="min-h-[120px] rounded-xl"
                    placeholder="Tell us about yourself..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Brief description for your profile. This helps others get to know you during swaps.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 h-12 rounded-xl font-bold gap-2"
                    disabled={isSubmitting}
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                  <Link href="/dashboard" className="flex-1">
                    <Button variant="outline" type="button" className="w-full h-12 rounded-xl font-bold gap-2">
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

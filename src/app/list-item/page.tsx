
"use client";

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { AIHelper } from '@/components/items/AIHelper';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function ListItemPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Item Listed!",
        description: "Your item is now live and visible to the community.",
      });
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-headline font-bold">List an Item</h1>
              <p className="text-muted-foreground">Share what you have and let the community know what you need in return.</p>
            </div>

            <Card className="rounded-2xl border-2 shadow-sm">
              <CardContent className="p-8">
                <form onSubmit={handleListingSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Item Title</Label>
                    <Input 
                      id="title" 
                      placeholder="e.g. 2019 MacBook Pro" 
                      className="h-12 rounded-xl"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger id="category" className="h-12 rounded-xl">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Sporting Goods">Sporting Goods</SelectItem>
                          <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                          <SelectItem value="Fashion">Fashion</SelectItem>
                          <SelectItem value="Books">Books</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Select value={condition} onValueChange={setCondition} required>
                        <SelectTrigger id="condition" className="h-12 rounded-xl">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Like New">Like New</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Tell us more about the item..." 
                      className="min-h-[150px] rounded-xl"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Photos</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Add Photo</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Listing Item..." : "Publish Listing"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="sticky top-24">
              <AIHelper 
                title={title} 
                category={category} 
                onDescriptionGenerated={(desc) => setDescription(desc)} 
              />
              
              <div className="mt-8 p-6 bg-white rounded-2xl border shadow-sm space-y-4">
                <h3 className="font-headline font-bold">Listing Tips</h3>
                <ul className="text-sm space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    Be honest about the condition to build trust.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    Upload clear photos from multiple angles.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    Mention what kind of items you are looking for.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

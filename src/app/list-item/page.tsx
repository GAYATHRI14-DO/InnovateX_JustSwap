
"use client";

import { useState, useRef } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import { Camera, ChevronLeft, X, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useFirestore } from '@/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function ListItemPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();

  const demoUserId = 'demo-user-123';

  const handleListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    setIsSubmitting(true);

    const globalItemRef = doc(collection(db, 'items'));
    const itemId = globalItemRef.id;
    const userItemRef = doc(db, 'users', demoUserId, 'items', itemId);

    const itemData = {
      id: itemId,
      ownerId: demoUserId,
      title,
      description,
      condition,
      category,
      imageUrls: images,
      listedDate: new Date().toISOString(),
      status: 'available',
      location: location || 'Local Area',
      viewCount: 0,
    };

    try {
      setDoc(globalItemRef, itemData).catch((err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: globalItemRef.path,
          operation: 'create',
          requestResourceData: itemData,
        }));
      });

      setDoc(userItemRef, itemData).catch((err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userItemRef.path,
          operation: 'create',
          requestResourceData: itemData,
        }));
      });

      toast({
        title: "Item Listed!",
        description: "Your item is now live and visible to the community.",
      });

      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (error) {
      console.error("Error saving listing:", error);
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
                      placeholder="e.g. Vintage Camera" 
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
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="location" 
                        placeholder="e.g. Downtown" 
                        className="h-12 rounded-xl pl-10"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
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
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      multiple 
                      onChange={handleFileChange} 
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {images.map((src, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border bg-muted">
                          <Image src={src} alt={`Preview ${index}`} fill className="object-cover grayscale" />
                          <button 
                            type="button" 
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {images.length < 8 && (
                        <div 
                          onClick={triggerFileInput}
                          className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <Camera className="h-8 w-8 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">Add Photo</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-bold rounded-2xl bg-black text-white hover:bg-black/90"
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
              <div className="p-6 bg-white rounded-2xl border shadow-sm space-y-4">
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
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

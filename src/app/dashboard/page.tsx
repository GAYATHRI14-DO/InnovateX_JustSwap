
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MY_ITEMS, CURRENT_USER, ITEMS } from '@/lib/mock-data';
import { ItemCard } from '@/components/items/ItemCard';
import { 
  Package, 
  RefreshCw, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Profile Card */}
          <div className="lg:w-1/4 space-y-6">
            <Card className="rounded-3xl border shadow-sm overflow-hidden">
              <CardContent className="p-6 text-center space-y-4">
                <Avatar className="h-24 w-24 mx-auto border-4 border-white shadow-lg">
                  <AvatarImage src={CURRENT_USER.avatar} />
                  <AvatarFallback>SS</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-headline font-bold">{CURRENT_USER.name}</h2>
                  <p className="text-sm text-muted-foreground">{CURRENT_USER.email}</p>
                </div>
                <div className="flex justify-center gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary font-bold">Verified Member</Badge>
                </div>
                <div className="pt-4 space-y-2">
                  <Link href="/profile/edit" className="block w-full">
                    <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
                      <Settings className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start gap-2 rounded-xl text-destructive hover:bg-destructive/5 hover:text-destructive">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-headline">Swap Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Successful Swaps</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active Listings</span>
                  <span className="font-bold">{MY_ITEMS.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reputation Score</span>
                  <span className="font-bold text-primary">4.9/5.0</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <div className="lg:w-3/4">
            <Tabs defaultValue="proposals" className="space-y-8">
              <TabsList className="bg-white border p-1 rounded-2xl w-full md:w-auto h-auto grid grid-cols-2 md:inline-flex">
                <TabsTrigger value="proposals" className="rounded-xl py-3 px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
                  Swap Proposals
                </TabsTrigger>
                <TabsTrigger value="listings" className="rounded-xl py-3 px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
                  My Listings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="proposals" className="space-y-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 gap-4">
                  <h3 className="text-xl font-headline font-bold flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-primary" />
                    Incoming Proposals
                  </h3>
                  
                  {/* Mock Incoming Proposal */}
                  <Card className="rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="relative h-20 w-20 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
                            <Image src={ITEMS[0].imageUrl} alt="Item" fill className="object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">For your listing:</p>
                            <h4 className="font-headline font-bold text-lg">{MY_ITEMS[0].title}</h4>
                          </div>
                        </div>

                        <RefreshCw className="h-8 w-8 text-muted-foreground rotate-90" />

                        <div className="flex items-center gap-4 flex-1">
                          <div className="relative h-20 w-20 rounded-xl overflow-hidden shadow-inner flex-shrink-0 border-2 border-primary/20">
                            <Image src={ITEMS[2].imageUrl} alt="Offer" fill className="object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Offer from <strong>Charlie</strong>:</p>
                            <h4 className="font-headline font-bold text-lg">{ITEMS[2].title}</h4>
                          </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                          <Button className="bg-primary rounded-xl flex-1 md:flex-none">Accept</Button>
                          <Button variant="outline" className="rounded-xl flex-1 md:flex-none">Decline</Button>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Received 3 hours ago
                        </div>
                        <Link href="/proposals/1" className="text-primary font-bold hover:underline">View Conversation</Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4 pt-6">
                  <h3 className="text-xl font-headline font-bold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Sent Proposals
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="rounded-2xl border bg-white p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={ITEMS[1].imageUrl} alt="Target" fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground truncate">Offer for <strong>Bob's {ITEMS[1].title}</strong></p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none px-2 py-0 h-5">Pending</Badge>
                            <span className="text-xs text-muted-foreground">2 days ago</span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Card>
                    <Card className="rounded-2xl border bg-white p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={ITEMS[4].imageUrl} alt="Target" fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground truncate">Offer for <strong>Diana's {ITEMS[4].title}</strong></p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none px-2 py-0 h-5">Declined</Badge>
                            <span className="text-xs text-muted-foreground">1 week ago</span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="listings" className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-headline font-bold flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    My Items ({MY_ITEMS.length})
                  </h3>
                  <Link href="/list-item">
                    <Button variant="outline" className="rounded-xl border-primary text-primary hover:bg-primary/5">
                      + Add New Listing
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                  {MY_ITEMS.map(item => (
                    <div key={item.id} className="relative">
                      <ItemCard item={item} />
                      <div className="absolute top-4 left-4">
                         <Badge className="bg-white/90 text-primary border-none shadow-sm">My Item</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

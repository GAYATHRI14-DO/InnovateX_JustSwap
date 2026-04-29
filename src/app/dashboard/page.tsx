
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ItemCard } from '@/components/items/ItemCard';
import { 
  Package, 
  RefreshCw, 
  Settings, 
  ChevronRight, 
  Clock, 
  Loader2,
  Inbox
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase, useCollection, updateDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  // For a purely public demo, we'll use a hardcoded demo user ID
  const demoUserId = 'demo-user-123';

  const userDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'users', demoUserId);
  }, [firestore]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);

  // My Listings
  const myListingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users', demoUserId, 'items');
  }, [firestore]);
  const { data: myListings, isLoading: isListingsLoading } = useCollection(myListingsQuery);

  // Incoming Proposals
  const incomingProposalsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'swapProposals');
  }, [firestore]);
  const { data: incomingProposals, isLoading: isIncomingLoading } = useCollection(incomingProposalsQuery);

  const handleUpdateStatus = (proposalId: string, newStatus: 'Accepted' | 'Declined') => {
    if (!firestore) return;
    const ref = doc(firestore, 'swapProposals', proposalId);
    updateDocumentNonBlocking(ref, { 
      status: newStatus,
      responseDate: new Date().toISOString()
    });
    toast({
      title: `Proposal ${newStatus}`,
      description: `You have ${newStatus.toLowerCase()} the swap proposal.`,
    });
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = profile?.firstName ? `${profile.firstName} ${profile.lastName}` : "Community Member";
  const userEmail = "community@justswap.io";
  const userAvatar = `https://picsum.photos/seed/demo-user/200/200`;

  const pendingIncoming = incomingProposals?.filter(p => p.status === 'Pending') || [];

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
                  <AvatarImage src={userAvatar} />
                  <AvatarFallback>{displayName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-headline font-bold">{displayName}</h2>
                  <p className="text-sm text-muted-foreground">{userEmail}</p>
                </div>
                <div className="pt-4 space-y-2">
                  <Link href="/profile/edit" className="block w-full">
                    <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
                      <Settings className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </Link>
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
                  <span className="font-bold">{incomingProposals?.filter(p => p.status === 'Accepted').length || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active Listings</span>
                  <span className="font-bold">{myListings?.length || 0}</span>
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
                    Community Proposals
                  </h3>
                  
                  {isIncomingLoading ? (
                    <div className="p-12 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
                  ) : pendingIncoming.length > 0 ? (
                    pendingIncoming.map((proposal) => (
                      <Card key={proposal.id} className="rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-muted-foreground">Swap request</p>
                              <h4 className="font-headline font-bold text-lg">{proposal.message || "Wants to trade"}</h4>
                              <p className="text-xs text-muted-foreground">Offered {proposal.offeredItemIds?.length || 0} item(s)</p>
                            </div>

                            <div className="flex gap-2 w-full md:w-auto">
                              <Button 
                                onClick={() => handleUpdateStatus(proposal.id, 'Accepted')}
                                className="bg-primary rounded-xl flex-1 md:flex-none text-white"
                              >
                                Accept
                              </Button>
                              <Button 
                                onClick={() => handleUpdateStatus(proposal.id, 'Declined')}
                                variant="outline" 
                                className="rounded-xl flex-1 md:flex-none"
                              >
                                Decline
                              </Button>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Received {new Date(proposal.proposalDate).toLocaleDateString()}
                            </div>
                            <Link href={`/proposals/${proposal.id}`} className="text-primary font-bold hover:underline">View Details</Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="p-12 text-center bg-muted/30 rounded-2xl border-2 border-dashed">
                      <Inbox className="h-8 w-8 mx-auto text-muted-foreground mb-2 opacity-50" />
                      <p className="text-muted-foreground">No pending proposals at the moment.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="listings" className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-headline font-bold flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Listed Items ({myListings?.length || 0})
                  </h3>
                  <Link href="/list-item">
                    <Button variant="outline" className="rounded-xl border-primary text-primary hover:bg-primary/5">
                      + Add New Listing
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                  {isListingsLoading ? (
                     <div className="col-span-full py-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
                  ) : myListings && myListings.length > 0 ? (
                    myListings.map(item => (
                      <div key={item.id} className="relative">
                        <ItemCard item={{
                          ...item,
                          imageUrl: item.imageUrls?.[0] || `https://picsum.photos/seed/${item.id}/600/400`,
                          ownerName: displayName,
                          createdAt: item.listedDate
                        }} />
                        <div className="absolute top-4 left-4">
                           <Badge className="bg-white/90 text-primary border-none shadow-sm">My Item</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center bg-muted/30 rounded-3xl border-2 border-dashed">
                      <p className="text-muted-foreground">No items have been listed yet.</p>
                      <Link href="/list-item" className="mt-4 inline-block">
                        <Button variant="outline">List Your First Item</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

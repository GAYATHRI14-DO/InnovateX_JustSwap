
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
  LogOut, 
  ChevronRight, 
  Clock, 
  Loader2,
  Inbox
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection, updateDocumentNonBlocking } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);

  // My Listings
  const myListingsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'items');
  }, [firestore, user]);
  const { data: myListings, isLoading: isListingsLoading } = useCollection(myListingsQuery);

  // Incoming Proposals
  const incomingProposalsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'swapProposals'),
      where('targetItemOwnerId', '==', user.uid)
    );
  }, [firestore, user]);
  const { data: incomingProposals, isLoading: isIncomingLoading } = useCollection(incomingProposalsQuery);

  // Sent Proposals
  const sentProposalsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'swapProposals'),
      where('proposerId', '==', user.uid)
    );
  }, [firestore, user]);
  const { data: sentProposals, isLoading: isSentLoading } = useCollection(sentProposalsQuery);

  const handleSignOut = () => {
    signOut(auth);
  };

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

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30 text-center space-y-4">
        <h2 className="text-2xl font-headline font-bold">Please Sign In</h2>
        <p className="text-muted-foreground">You need to be logged in to access your dashboard.</p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  const displayName = profile?.firstName ? `${profile.firstName} ${profile.lastName}` : (user?.displayName || 'User');
  const userEmail = user?.email || 'No email';
  const userAvatar = user?.photoURL || `https://picsum.photos/seed/${user?.uid}/200/200`;

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
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 rounded-xl text-destructive hover:bg-destructive/5 hover:text-destructive"
                    onClick={handleSignOut}
                  >
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
                    Incoming Proposals
                  </h3>
                  
                  {isIncomingLoading ? (
                    <div className="p-12 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
                  ) : pendingIncoming.length > 0 ? (
                    pendingIncoming.map((proposal) => (
                      <Card key={proposal.id} className="rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-muted-foreground">New proposal received</p>
                              <h4 className="font-headline font-bold text-lg">{proposal.message || "Wants to trade with you"}</h4>
                              <p className="text-xs text-muted-foreground">Offered {proposal.offeredItemIds.length} item(s)</p>
                            </div>

                            <div className="flex gap-2 w-full md:w-auto">
                              <Button 
                                onClick={() => handleUpdateStatus(proposal.id, 'Accepted')}
                                className="bg-primary rounded-xl flex-1 md:flex-none"
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
                      <p className="text-muted-foreground">No pending incoming proposals.</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-6">
                  <h3 className="text-xl font-headline font-bold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Sent Proposals
                  </h3>
                  
                  {isSentLoading ? (
                    <div className="p-12 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
                  ) : sentProposals && sentProposals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sentProposals.map((proposal) => (
                        <Link key={proposal.id} href={`/proposals/${proposal.id}`}>
                          <Card className="rounded-2xl border bg-white p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground truncate">Proposal for your items</p>
                                <div className="flex items-center gap-2">
                                  <Badge className={`${
                                    proposal.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                    proposal.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                                    'bg-red-100 text-red-700'
                                  } border-none px-2 py-0 h-5`}>
                                    {proposal.status}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">{new Date(proposal.proposalDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-muted/30 rounded-2xl border-2 border-dashed">
                      <p className="text-muted-foreground">You haven't sent any proposals yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="listings" className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-headline font-bold flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    My Items ({myListings?.length || 0})
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
                      <p className="text-muted-foreground">You haven't listed any items yet.</p>
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

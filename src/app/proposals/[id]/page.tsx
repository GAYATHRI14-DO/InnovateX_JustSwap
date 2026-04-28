
"use client";

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChevronLeft, 
  MapPin, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowRight,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function ProposalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  // Fetch Proposal
  const proposalRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'swapProposals', id);
  }, [firestore, id]);

  const { data: proposal, isLoading: isProposalLoading } = useDoc(proposalRef);

  // Fetch Target Item (Item the user owns or wants)
  const targetItemRef = useMemoFirebase(() => {
    if (!firestore || !proposal) return null;
    return doc(firestore, 'users', proposal.targetItemOwnerId, 'items', proposal.targetItemId);
  }, [firestore, proposal]);

  const { data: targetItem, isLoading: isTargetLoading } = useDoc(targetItemRef);

  // Fetch Proposer's items (to find the offered items)
  const proposerItemsQuery = useMemoFirebase(() => {
    if (!firestore || !proposal) return null;
    return collection(firestore, 'users', proposal.proposerId, 'items');
  }, [firestore, proposal]);

  const { data: allProposerItems, isLoading: isProposerItemsLoading } = useCollection(proposerItemsQuery);

  const offeredItems = allProposerItems?.filter(item => proposal?.offeredItemIds.includes(item.id)) || [];

  const handleUpdateStatus = async (newStatus: 'Accepted' | 'Declined') => {
    if (!proposalRef) return;
    
    try {
      await updateDoc(proposalRef, {
        status: newStatus,
        responseDate: new Date().toISOString()
      });
      
      toast({
        title: `Proposal ${newStatus}`,
        description: `You have ${newStatus.toLowerCase()} the swap proposal.`,
      });
      
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not update the proposal status. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isProposalLoading || isTargetLoading || isProposerItemsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!proposal || !targetItem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Proposal not found</h1>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isIncoming = user?.uid === proposal.targetItemOwnerId;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                {isIncoming ? "Incoming Swap Request" : "Outgoing Swap Request"}
              </Badge>
              <h1 className="text-4xl font-headline font-bold">Swap Proposal Details</h1>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Clock className="h-4 w-4" />
                Proposed on {new Date(proposal.proposalDate).toLocaleDateString()}
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={`px-4 py-1.5 text-sm font-bold border-none rounded-full ${
                proposal.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                proposal.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {proposal.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Column 1: Item Being Requested */}
            <div className="space-y-6">
              <h3 className="text-xl font-headline font-bold flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-primary" />
                {isIncoming ? "Your Item" : "Item You Want"}
              </h3>
              <Card className="rounded-3xl border overflow-hidden shadow-sm">
                <div className="relative aspect-[16/9] w-full">
                  <Image 
                    src={targetItem.imageUrls?.[0] || 'https://picsum.photos/seed/target/800/450'} 
                    alt={targetItem.title} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h4 className="text-2xl font-headline font-bold">{targetItem.title}</h4>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      {targetItem.location || "Location not specified"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none">
                      {targetItem.condition}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {targetItem.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Column 2: Offered Items */}
            <div className="space-y-6">
              <h3 className="text-xl font-headline font-bold flex items-center gap-2 text-primary">
                <RefreshCw className="h-5 w-5" />
                {isIncoming ? "Items Offered to You" : "Your Offered Items"}
              </h3>
              
              <div className="space-y-4">
                {offeredItems.map((item) => (
                  <Card key={item.id} className="rounded-2xl border overflow-hidden shadow-sm group">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative aspect-video sm:w-40 sm:h-auto shrink-0">
                        <Image 
                          src={item.imageUrls?.[0] || 'https://picsum.photos/seed/offer/400/300'} 
                          alt={item.title} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <CardContent className="p-4 flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-headline font-bold group-hover:text-primary transition-colors">{item.title}</h4>
                          <Badge className="bg-accent text-accent-foreground text-[10px] uppercase font-bold tracking-wider">
                            {item.condition}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {item.location || "Local Exchange"}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 italic">
                          "{item.description}"
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                ))}
                
                {offeredItems.length === 0 && (
                  <div className="p-12 text-center bg-muted/30 rounded-3xl border-2 border-dashed">
                    <p className="text-muted-foreground">No item details available.</p>
                  </div>
                )}
              </div>

              {proposal.message && (
                <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-2">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-primary">Proposer's Message</h4>
                  <p className="text-muted-foreground italic">"{proposal.message}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          {isIncoming && proposal.status === 'Pending' && (
            <div className="mt-12 p-8 bg-white border-2 border-primary/20 rounded-[3rem] shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-headline font-bold">What's your decision?</h3>
                <p className="text-muted-foreground max-w-md">
                  By accepting, you agree to exchange your <strong>{targetItem.title}</strong> for the items listed above.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Button 
                  onClick={() => handleUpdateStatus('Accepted')}
                  className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 font-bold text-lg gap-2"
                >
                  <CheckCircle2 className="h-6 w-6" />
                  Accept Swap
                </Button>
                <Button 
                  onClick={() => handleUpdateStatus('Declined')}
                  variant="outline" 
                  className="h-14 px-10 rounded-2xl border-2 text-destructive border-destructive/20 hover:bg-destructive/5 font-bold text-lg gap-2"
                >
                  <XCircle className="h-6 w-6" />
                  Decline
                </Button>
              </div>
            </div>
          )}

          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/20 space-y-3 mt-8">
            <div className="flex items-center gap-2 text-primary font-bold">
              <ShieldCheck className="h-5 w-5" />
              Swap Safe Guarantee
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We recommend meeting in a public, well-lit place for the exchange. {isIncoming ? "The other user's" : "Your"} location information is shared to facilitate the meeting.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, initiateEmailSignUp } from "@/firebase";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Use Firebase Auth for actual session management
      initiateEmailSignUp(auth, email, password);
      toast({
        title: "Welcome aboard!",
        description: "Your account is being created.",
      });
      // The Navbar will automatically react to the auth state change
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "An error occurred during registration.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-[2.5rem] border-2 shadow-2xl overflow-hidden">
          <CardHeader className="text-center space-y-4 pt-10">
            <div className="mx-auto bg-black text-white p-4 rounded-3xl w-fit shadow-lg">
              <UserPlus className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-3xl font-headline font-bold">Join JustSwap</CardTitle>
              <p className="text-muted-foreground">Start trading sustainably today.</p>
            </div>
          </CardHeader>
          <CardContent className="pb-12 px-8">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 rounded-2xl border-2 focus:border-black"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 rounded-2xl border-2 focus:border-black"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-2xl font-bold bg-black text-white text-lg hover:bg-black/90 shadow-xl transition-all"
              >
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Create Account"}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account? <Link href="/login" className="text-black font-bold hover:underline">Log In</Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

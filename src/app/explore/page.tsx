
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ExplorePageRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to root which now contains the explore/landing content
    router.replace('/');
  }, [router]);

  return null;
}

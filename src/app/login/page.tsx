
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect all /login traffic to the main landing/login root
    router.replace("/");
  }, [router]);

  return null;
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Supabase client automatically picks up the hash fragment
    // from the magic link URL and exchanges it for a session
    // BUG FIX: store subscription and unsubscribe on cleanup to prevent memory leak
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.replace("/dashboard");
      }
    });

    // Fallback: if already signed in or if something went wrong
    const timeout = setTimeout(() => {
      router.replace("/dashboard");
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-temple-gold/20 border-t-temple-gold" />
        <p className="text-gray-500 font-accent text-lg">
          Signing you in...
        </p>
      </div>
    </div>
  );
}

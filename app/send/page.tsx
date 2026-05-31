// app/send/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SendGbxPage from "@/components/dashboard/SendGbxPage";

export default function SendPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/send");
    }
    if (!loading && user && user.isAdmin) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Laddar...
      </div>
    );
  if (!user || user.isAdmin) return null;

  return <SendGbxPage />;
}

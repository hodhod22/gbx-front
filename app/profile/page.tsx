// app/profile/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProfilePage from "@/components/dashboard/ProfilePage";

export default function ProfileRoute() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
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

  return <ProfilePage />;
}

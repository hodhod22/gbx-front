// components/AuthenticatedLayout.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import Header from "./Header";
import SidebarMenu from "@/components/SidebarMenu";
import MobileBottomNav from "./MobileBottomNav";
import { useState } from "react";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");

  // Publika sidor (ingen meny alls)
  const publicPaths = ["/", "/login", "/register", "/gbx"];
  if (publicPaths.includes(pathname)) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <>{children}</>;
  }

  // Admin använder sin egen layout (ingen header/bottenmeny)
  if (user.isAdmin) {
    return <>{children}</>;
  }

  // Vanlig användare – layout med header, sidomeny, bottenmeny (endast mobil)
  return (
    <>
      {/* Header (vanligtvis fixed, men placeras i flödet) */}
      <Header onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Sidomeny (overlay) */}
      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelect={setCurrentView}
        currentView={currentView}
      />

      {/* Hela sidans innehåll – använder min-h-dvh för dynamisk höjd på mobiler */}
      <div className="flex flex-col min-h-dvh">
        {/* Huvudinnehåll – tar all ledig plats och blir scrollbart */}
        <main className="flex-1 overflow-y-auto pt-16">{children}</main>

        {/* Bottenmeny – visas endast på mobiler (max bredd 767px) */}
        <div className="block md:hidden">
          <MobileBottomNav />
        </div>
      </div>
    </>
  );
}

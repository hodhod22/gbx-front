// components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiHome, FiUser } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [showBottomNav, setShowBottomNav] = useState(false); // ej använd, vi visar alltid

  // Visa inte denna header på publika sidor
  const publicPaths = ["/", "/login", "/register", "/gbx"];
  if (publicPaths.includes(pathname)) return null;

  if (!user) return null;

  return (
    <>
      {/* Vanlig header med hamburgermeny */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            href="/dashboard"
            className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            GBX
          </Link>
          <button
            onClick={() => onMenuClick?.()}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Menu"
          >
            <FiMenu size={24} />
          </button>
        </div>
      </header>

      {/* Mobil bottenmeny - visas bara på små skärmar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden">
        <div className="flex justify-around items-center py-2">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${
              pathname === "/dashboard"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <FiHome size={24} />
            <span className="text-xs">Hem</span>
          </Link>
          <Link
            href="/profile"
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${
              pathname === "/profile"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <FiUser size={24} />
            <span className="text-xs">Profil</span>
          </Link>
        </div>
      </div>

      {/* Lägg till padding-bottom på main-content så innehållet inte göms bakom bottenmenyn */}
      <style jsx global>{`
        @media (max-width: 768px) {
          main {
            padding-bottom: 70px;
          }
        }
      `}</style>
    </>
  );
}

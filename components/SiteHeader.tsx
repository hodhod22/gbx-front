// components/SiteHeader.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";

export default function SiteHeader() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Stäng meny när man klickar på länk
  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push("/");
  };

  // Om vi är på dashboard-sidan, använd en annan stil (hamburger meny) eller behåll samma?
  // Dashboard har sin egen header med hamburgermeny, så vi kanske vill dölja denna header på dashboard?
  // För att undvika dubbla headers: kolla om pathname startar med "/dashboard".
  if (pathname?.startsWith("/dashboard")) {
    return null; // Dashboard har egen header (med hamburgermeny)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logotyp */}
        <Link
          href="/"
          className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          GBX
        </Link>

        {/* Desktop meny */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-700 dark:text-gray-300">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 transition"
              >
                <FiLogOut size={16} />
                {t("nav.signOut")}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
              >
                {t("nav.signIn")}
              </Link>
              <Link
                href="/register"
                className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {t("nav.signUp")}
              </Link>
            </>
          )}
        </div>

        {/* Mobil meny knapp */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobil meny (dropdown) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-2">
          <div className="container mx-auto px-4 flex flex-col gap-2">
            {user ? (
              <>
                <div className="px-3 py-2 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded"
                >
                  <FiLogOut size={16} /> {t("nav.signOut")}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  {t("nav.signIn")}
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-2 text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  {t("nav.signUp")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

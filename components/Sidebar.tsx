// components/Header.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import SidebarMenu from "./SidebarMenu"; // Lägg till denna rad

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="z-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            href="/dashboard"
            className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            GBX
          </Link>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            <FiMenu size={24} />
          </button>
        </div>
      </header>
      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="h-14" />
    </div>
  );
}

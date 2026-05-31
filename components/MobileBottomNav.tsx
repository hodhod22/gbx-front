// components/MobileBottomNav.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { FiHome, FiDollarSign, FiSend, FiUser } from "react-icons/fi";
import {useState,useEffect} from 'react'

export default function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useTranslation();



  if (!user || user.isAdmin) return null;

  const navItems = [
    { id: "home", label: t("nav.home"), icon: FiHome, path: "/dashboard" },
    { id: "buy", label: t("user.buyGbx"), icon: FiDollarSign, path: "/buy" },
    { id: "send", label: t("user.sendGbx"), icon: FiSend, path: "/send" },
    { id: "profile", label: t("nav.profile"), icon: FiUser, path: "/profile" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 48,
        backgroundColor: "white",
        borderTop: "1px solid #e5e7eb",
        boxShadow: "0 -8px 25px rgba(0,0,0,0.12), 0 -2px 5px rgba(0,0,0,0.05)",
        padding: "5px 0 110px 0",     
        paddingBottom: "clamp(90px, 10vh, 100px)",
       
      }}
      className="dark:bg-gray-900 dark:border-gray-700"
    >
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => router.push(item.path)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            className="px-3 py-1 rounded-lg transition"
          >
            <item.icon
              size={22}
              style={{ color: isActive(item.path) ? "#2563eb" : "#6b7280" }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: isActive(item.path) ? "#2563eb" : "#6b7280" }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

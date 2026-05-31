// components/SidebarMenu.tsx
"use client";
import { FiArrowUp } from "react-icons/fi"; // Lägg till ikon
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import LanguageSelector from "./LanguageSelector";
import {
  FiX,
  FiSun,
  FiMoon,
  FiLogOut,
  FiDollarSign,
  FiSend,
  FiRepeat,
  FiUser,
  FiSettings,
} from "react-icons/fi";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (view: string) => void; // valfri
  currentView?: string; // valfri
}

export default function SidebarMenu({
  isOpen,
  onClose,
  onSelect,
  currentView,
}: SidebarMenuProps) {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const router = useRouter();

  if (!isOpen) return null;

  const activeView = currentView || "";

  const menuItems = [
    {
      id: "withdraw",
      label: t("nav.withdraw"),
      icon: FiArrowUp,
      path: "/dashboard/withdraw",
    },
    { id: "buy", label: t("sidebar.buy"), icon: FiDollarSign, path: "/buy" },
    { id: "send", label: t("sidebar.send"), icon: FiSend, path: "/send" },
    {
      id: "balances",
      label: t("sidebar.balances"),
      icon: FiDollarSign,
      path: "/balances",
    },
    {
      id: "transactions",
      label: t("sidebar.transactions"),
      icon: FiRepeat,
      path: "/transactions",
    },
    {
      id: "profile",
      label: t("sidebar.profile"),
      icon: FiUser,
      path: "/profile",
    },
    {
      id: "settings",
      label: t("sidebar.settings"),
      icon: FiSettings,
      path: "/settings",
    },
  ];

  const handleNavigation = (path: string, id: string) => {
    if (onSelect) onSelect(id);
    onClose();
    router.push(path);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div
        className="fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-2 p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path, item.id)}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                activeView === item.id
                  ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
            <span className="text-sm font-medium">{t("sidebar.theme")}</span>
          </button>

          {/* Language Selector */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
            <div className="px-2 py-1 text-xs text-gray-400 uppercase tracking-wider">
              Språk
            </div>
            <LanguageSelector />
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 mt-4"
          >
            <FiLogOut size={20} />
            <span className="text-sm font-medium">{t("sidebar.logout")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

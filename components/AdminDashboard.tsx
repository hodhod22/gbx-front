// frontend/components/AdminDashboard.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  FiUsers,
  FiMessageSquare,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiSettings,
  FiShield,
  FiGlobe,
  FiRepeat,
  FiBarChart2,
} from "react-icons/fi";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", name: t("admin.overview"), icon: FiTrendingUp },
    { id: "transfers", name: t("admin.transfers"), icon: FiRepeat },
    { id: "currencies", name: t("admin.currencies"), icon: FiDollarSign },
    { id: "banks", name: t("admin.banks"), icon: FiGlobe },
    { id: "users", name: t("admin.users"), icon: FiUsers },
    { id: "messages", name: t("admin.messages"), icon: FiMessageSquare },
  ];

  const stats = [
    {
      label: t("admin.totalUsers"),
      value: "1,234",
      icon: FiUsers,
      color: "bg-blue-500",
    },
    {
      label: t("admin.todayTransfers"),
      value: "342",
      icon: FiRepeat,
      color: "bg-green-500",
    },
    {
      label: t("admin.totalVolume"),
      value: "$1.2M",
      icon: FiDollarSign,
      color: "bg-purple-500",
    },
    {
      label: t("admin.connectedBanks"),
      value: "8",
      icon: FiGlobe,
      color: "bg-orange-500",
    },
    {
      label: t("admin.currencies"),
      value: "12",
      icon: FiBarChart2,
      color: "bg-teal-500",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="+5+ from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">{t("admin.dashboard")}</h1>
          <p className="mt-2 opacity-90">
            {t("admin.welcomeBack")} {user?.name || "Admin"}!
          </p>
          <p className="text-sm opacity-75 mt-1">{t("admin.manageGlobal")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-all hover:shadow-lg hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.color} shadow-md`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors border border-gray-200 dark:border-gray-700">
          {activeTab === "banks" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("admin.connectedBanks")}
                </h2>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition shadow-md">
                  + {t("admin.newIntegration")}
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      BKM Express ({t("turkey")})
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("admin.status")}: {t("admin.active")}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full text-xs">
                    {t("admin.connected")}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Pix ({t("brazil")})
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("admin.status")}: {t("admin.active")}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full text-xs">
                    {t("admin.connected")}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Alipay ({t("china")})
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("admin.status")}: {t("admin.inProgress")}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-full text-xs">
                    {t("admin.pending")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "banks" && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <FiSettings className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t("admin.contentComingSoon")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

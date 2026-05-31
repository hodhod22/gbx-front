// components/SettingsPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import {
  FiUser,
  FiLock,
  FiLink,
  FiGlobe,
  FiCheckCircle,
  FiAlertCircle,
  FiSave,
  FiRefreshCw,
} from "react-icons/fi";

type Tab = "profile" | "security" | "bank" | "language";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [updating, setUpdating] = useState(false);

  // E-poständring
  const [emailChangeMode, setEmailChangeMode] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailChangeLoading, setEmailChangeLoading] = useState(false);

  // Bankstatus
  const [refreshing, setRefreshing] = useState(false);

  const getToken = () => localStorage.getItem("token");

  // Hämta användardata och stripe_account_id
  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      if (!token) return;

      try {
        // Hämta profil
        const userRes = await fetch(`${backendUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setProfileForm({
            name: userData.name || user?.name || "",
            email: userData.email || user?.email || "",
          });
          if (userData.stripe_account_id) {
            setStripeAccountId(userData.stripe_account_id);
          }
        } else {
          setProfileForm({
            name: user?.name || "",
            email: user?.email || "",
          });
        }

        // Hämta stripe_account_id separat om inte i /me
        if (!stripeAccountId) {
          const accountRes = await fetch(
            `${backendUrl}/api/gbx/stripe-account`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (accountRes.ok) {
            const data = await accountRes.json();
            setStripeAccountId(data.stripe_account_id);
          }
        }

        // Hämta onboarding-status
        const onboardRes = await fetch(
          `${backendUrl}/api/gbx/check-stripe-status`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const onboardData = await onboardRes.json();
        setIsOnboarded(onboardData.isOnboarded || false);
      } catch (err) {
        console.error("Error fetching settings data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Uppdatera bankstatus manuellt
  const handleRefreshStatus = async () => {
    setRefreshing(true);
    const token = getToken();
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
    try {
      const res = await fetch(`${backendUrl}/api/gbx/refresh-stripe-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setIsOnboarded(data.isOnboarded);
      setMessage({ type: "success", text: t("settings.statusUpdated") });
    } catch (err) {
      setMessage({ type: "error", text: t("settings.statusUpdateFailed") });
    } finally {
      setRefreshing(false);
    }
  };

  const handleConnectBank = async () => {
    const token = getToken();
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
    try {
      const res = await fetch(`${backendUrl}/api/gbx/onboarding-link`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: t("settings.connectBankFailed") });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage(null);
    const token = getToken();
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

    try {
      const res = await fetch(`${backendUrl}/api/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: profileForm.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setMessage({ type: "success", text: t("settings.profileUpdated") });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || t("settings.profileUpdateFailed"),
      });
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: t("settings.passwordsDoNotMatch") });
      return;
    }
    setUpdating(true);
    setMessage(null);
    const token = getToken();
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

    console.log("Sending password change request...");
    console.log("Token exists?", !!token);

    try {
      const res = await fetch(`${backendUrl}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) throw new Error(data.error || "Password change failed");
      setMessage({ type: "success", text: t("settings.passwordChanged") });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      console.error("Password change error:", err);
      setMessage({
        type: "error",
        text: err.message || t("settings.passwordChangeFailed"),
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleEmailChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailChangeLoading(true);
    setMessage(null);
    const token = getToken();
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

    try {
      const res = await fetch(`${backendUrl}/api/auth/request-email-change`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newEmail }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to request email change");
      setMessage({
        type: "success",
        text: t("settings.emailVerificationSent"),
      });
      setEmailChangeMode(false);
      setNewEmail("");
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setEmailChangeLoading(false);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    setMessage({ type: "success", text: t("settings.languageChanged") });
  };

  const tabs: { id: Tab; label: string; icon: React.JSX.Element }[] = [
    { id: "profile", label: t("settings.profile"), icon: <FiUser /> },
    { id: "security", label: t("settings.security"), icon: <FiLock /> },
    { id: "bank", label: t("settings.bankAccount"), icon: <FiLink /> },
    { id: "language", label: t("settings.language"), icon: <FiGlobe /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t("settings.title")}
        </h1>

        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {message && (
          <div
            className={`mb-6 p-3 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          {activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("settings.profileInfo")}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("auth.fullName")}
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("auth.email")}
                  </label>
                  {!emailChangeMode ? (
                    <div className="flex items-center justify-between">
                      <p className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex-1">
                        {profileForm.email}
                      </p>
                      <button
                        type="button"
                        onClick={() => setEmailChangeMode(true)}
                        className="ml-2 text-sm text-blue-600 hover:underline"
                      >
                        {t("settings.changeEmail")}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder={t("settings.newEmail")}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700"
                        required
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={handleEmailChangeRequest}
                          disabled={emailChangeLoading}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
                        >
                          {emailChangeLoading
                            ? t("common.sending")
                            : t("settings.sendVerification")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEmailChangeMode(false)}
                          className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm"
                        >
                          {t("common.cancel")}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {t("settings.emailChangeHint")}
                      </p>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  {updating ? (
                    <FiRefreshCw className="animate-spin" />
                  ) : (
                    <FiSave />
                  )}
                  {t("settings.saveChanges")}
                </button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <form onSubmit={handlePasswordChange}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("settings.changePassword")}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("settings.currentPassword")}
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("settings.newPassword")}
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("settings.confirmNewPassword")}
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  {updating ? (
                    <FiRefreshCw className="animate-spin" />
                  ) : (
                    <FiSave />
                  )}
                  {t("settings.updatePassword")}
                </button>
              </div>
            </form>
          )}

          {activeTab === "bank" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("settings.bankAccount")}
              </h2>
              <div className="flex flex-col gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isOnboarded ? (
                      <FiCheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <FiAlertCircle className="w-6 h-6 text-yellow-600" />
                    )}
                    <div>
                      <p className="font-medium">
                        {isOnboarded
                          ? t("settings.bankConnected")
                          : t("settings.bankNotConnected")}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t("settings.bankDescription")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  {!isOnboarded && (
                    <button
                      onClick={handleConnectBank}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      {t("settings.connectBank")}
                    </button>
                  )}
                  {stripeAccountId && (
                    <button
                      onClick={handleRefreshStatus}
                      disabled={refreshing}
                      className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      {refreshing
                        ? t("common.updating")
                        : t("settings.checkStatus")}
                    </button>
                  )}
                </div>
                {!stripeAccountId && (
                  <p className="text-xs text-amber-600">
                    {t("settings.noStripeAccount")}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "language" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("settings.language")}
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => changeLanguage("sv")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    i18n.language === "sv"
                      ? "bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="font-medium">Svenska</span>
                  <span className="text-sm text-gray-500 ml-2">(Swedish)</span>
                </button>
                <button
                  onClick={() => changeLanguage("en")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    i18n.language === "en"
                      ? "bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="font-medium">English</span>
                  <span className="text-sm text-gray-500 ml-2">(English)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

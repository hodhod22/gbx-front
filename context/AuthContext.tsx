// context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import i18n from "../lib/i18n";

interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  language?: string;
  gbxId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    redirectTo?: string,
  ) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    language?: string,
  ) => Promise<void>;
  logout: () => void;
  updateUserLanguage: (lang: string) => void;
}

// Använd samma miljövariabel som i login-sidan
const BACKEND_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}`;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const savedLanguage = localStorage.getItem("language");

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        const lang = parsedUser.language || savedLanguage || "en";
        i18n.changeLanguage(lang);
        localStorage.setItem("language", lang);
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

 const updateUserLanguage = async (lang: string) => {
   i18n.changeLanguage(lang);
   localStorage.setItem("language", lang);

   if (user) {
     const token = localStorage.getItem("token");
     if (!token) return;

     try {
       const backendUrl =
         process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
       const res = await fetch(`${backendUrl}/api/auth/update-language`, {
         method: "PUT",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({ language: lang }),
       });

       if (res.ok) {
         const updatedUser = { ...user, language: lang };
         localStorage.setItem("user", JSON.stringify(updatedUser));
         setUser(updatedUser);
       } else {
         console.error("Failed to update language on server");
       }
     } catch (err) {
       console.error("Error updating language:", err);
     }
   }
 };

  const login = async (
    email: string,
    password: string,
    redirectTo?: string,
  ) => {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    if (data.token) {
      const userData = { ...data.user, language: i18n.language };
      document.cookie = `token=${data.token}; path=/; max-age=604800`;
      localStorage.setItem("token", data.token);
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("language", i18n.language);
      setUser(userData);

      if (redirectTo) {
        router.push(redirectTo);
        localStorage.removeItem("redirectAfterLogin");
        localStorage.removeItem("action");
      } else if (userData.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    language?: string,
  ) => {
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    if (data.token) {
      const userData = { ...data.user, language: language || i18n.language };
      localStorage.setItem("token", data.token);
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("language", userData.language);
      i18n.changeLanguage(userData.language);
      setUser(userData);

      if (userData.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("redirectAfterLogin");
    localStorage.removeItem("action");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUserLanguage }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

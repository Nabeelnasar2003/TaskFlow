"use client";

import { useState, useEffect } from "react";
import { User } from "@/types";

const AUTH_KEY = "taskflow_user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) setUser(JSON.parse(stored) as User);
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    // Mock auth — any non-empty credentials work
    if (!email.trim() || !password.trim()) return false;
    const name = email.split("@")[0].replace(/[._]/g, " ");
    const capitalised = name.replace(/\b\w/g, (c) => c.toUpperCase());
    const userData: User = { email, name: capitalised };
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    setUser(userData);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return { user, isLoading, login, logout };
}

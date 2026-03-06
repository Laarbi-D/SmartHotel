"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface Guest {
  name: string;
  roomNumber: string;
}

interface AuthContextType {
  guest: Guest | null;
  login: (name: string, roomNumber: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("barcelo-guest");
    if (stored) {
      setGuest(JSON.parse(stored));
    }
    setIsHydrated(true);
  }, []);

  const login = (name: string, roomNumber: string) => {
    const guestData = { name, roomNumber };
    setGuest(guestData);
    sessionStorage.setItem("barcelo-guest", JSON.stringify(guestData));
  };

  const logout = () => {
    setGuest(null);
    sessionStorage.removeItem("barcelo-guest");
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        guest,
        login,
        logout,
        isAuthenticated: guest !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import AuthPanel, { AuthMode } from "@/components/auth/AuthPanel";

interface AuthModalContextValue {
  openAuth: (mode: AuthMode) => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  const openAuth = (nextMode: AuthMode) => {
    setMode(nextMode);
    setIsOpen(true);
  };

  return (
    <AuthModalContext.Provider value={{ openAuth }}>
      {children}
      <AuthPanel
        isOpen={isOpen}
        mode={mode}
        onModeChange={setMode}
        onClose={() => setIsOpen(false)}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within an AuthModalProvider");
  return ctx;
}

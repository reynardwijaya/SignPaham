"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthResult {
  error?: string;
  needsEmailConfirmation?: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (input: RegisterInput) => Promise<AuthResult>;
  logout: () => void;
  resetPasswordDirect: (email: string, newPassword: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Email atau kata sandi salah.",
  "User already registered": "Email sudah terdaftar. Coba masuk saja.",
  "Email not confirmed": "Email belum dikonfirmasi. Cek inbox kamu untuk link konfirmasi.",
  "Password should be at least 6 characters.": "Kata sandi minimal 6 karakter.",
};

function translateError(message: string): string {
  return ERROR_MESSAGES[message] ?? message;
}

function toAuthUser(session: Session | null): AuthUser | null {
  if (!session?.user) return null;
  const meta = session.user.user_metadata as {
    first_name?: string;
    last_name?: string;
  };
  return {
    id: session.user.id,
    email: session.user.email ?? "",
    firstName: meta?.first_name ?? "",
    lastName: meta?.last_name ?? "",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(toAuthUser(data.session));
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toAuthUser(session));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const register = useCallback(async (input: RegisterInput): Promise<AuthResult> => {
    const email = input.email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email,
      password: input.password,
      options: {
        data: {
          first_name: input.firstName.trim(),
          last_name: input.lastName.trim(),
        },
      },
    });

    if (error) {
      return { error: translateError(error.message) };
    }
    // With email confirmation enabled (Supabase default), signUp succeeds
    // but returns no session until the user clicks the confirmation link.
    if (!data.session) {
      return { needsEmailConfirmation: true };
    }
    return {};
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) {
      return { error: translateError(error.message) };
    }
    return {};
  }, []);

  const logout = useCallback(() => {
    supabase.auth.signOut();
  }, []);

  // Deliberately skips ownership verification (no email link / OTP) — see
  // src/app/api/reset-password-direct/route.ts for the accepted trade-off.
  const resetPasswordDirect = useCallback(
    async (email: string, newPassword: string): Promise<AuthResult> => {
      const res = await fetch("/api/reset-password-direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const body = await res.json();
      if (!res.ok) {
        return { error: body.error ?? "Gagal mengubah kata sandi." };
      }
      return {};
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, resetPasswordDirect }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

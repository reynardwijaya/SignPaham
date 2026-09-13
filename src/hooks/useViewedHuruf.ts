"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY = "signpaham_viewed_huruf";

function readLocal(): Set<string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function writeLocal(viewed: Set<string>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...viewed]));
  } catch {
    // ignore write failures (private mode, quota, etc.)
  }
}

export function useViewedHuruf() {
  const { user } = useAuth();
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoaded(false);
      if (user) {
        const { data, error } = await supabase
          .from("huruf_progress")
          .select("huruf")
          .eq("user_id", user.id);
        if (!cancelled) {
          setViewed(!error && data ? new Set(data.map((row) => row.huruf)) : new Set());
          setLoaded(true);
        }
      } else {
        if (!cancelled) {
          setViewed(readLocal());
          setLoaded(true);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const markViewed = useCallback(
    (huruf: string) => {
      setViewed((prev) => {
        if (prev.has(huruf)) return prev;
        const next = new Set(prev);
        next.add(huruf);

        if (user) {
          supabase
            .from("huruf_progress")
            .upsert({ user_id: user.id, huruf }, { onConflict: "user_id,huruf" })
            .then(({ error }) => {
              if (error) console.error("Gagal menyimpan progress huruf:", error.message);
            });
        } else {
          writeLocal(next);
        }

        return next;
      });
    },
    [user]
  );

  return { viewed, markViewed, loaded };
}

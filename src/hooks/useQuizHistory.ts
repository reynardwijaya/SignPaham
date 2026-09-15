"use client";

import { useCallback, useEffect, useState } from "react";
import { Kesulitan } from "@/data/kosakata";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export interface HistoryEntry {
  id: string;
  word: string;
  kesulitan: Kesulitan;
  kecepatan: "lambat" | "cepat";
  correct: boolean;
  userAnswer: string;
  timestamp: number;
}

const STORAGE_KEY = "signpaham_quiz_history";
const MAX_ENTRIES = 100;

function readLocal(): HistoryEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocal(entries: HistoryEntry[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore write failures
  }
}

interface QuizHistoryRow {
  id: string;
  word: string;
  kesulitan: Kesulitan;
  kecepatan: "lambat" | "cepat";
  correct: boolean;
  user_answer: string;
  created_at: string;
}

function fromRow(row: QuizHistoryRow): HistoryEntry {
  return {
    id: row.id,
    word: row.word,
    kesulitan: row.kesulitan,
    kecepatan: row.kecepatan,
    correct: row.correct,
    userAnswer: row.user_answer,
    timestamp: new Date(row.created_at).getTime(),
  };
}

export function useQuizHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoaded(false);
      if (user) {
        const { data, error } = await supabase
          .from("quiz_history")
          .select("id, word, kesulitan, kecepatan, correct, user_answer, created_at")
          .order("created_at", { ascending: false })
          .limit(MAX_ENTRIES);
        if (!cancelled) {
          setHistory(!error && data ? data.map(fromRow) : []);
          setLoaded(true);
        }
      } else {
        if (!cancelled) {
          setHistory(readLocal());
          setLoaded(true);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const addEntry = useCallback(
    async (entry: Omit<HistoryEntry, "id" | "timestamp">) => {
      if (user) {
        const { data, error } = await supabase
          .from("quiz_history")
          .insert({
            user_id: user.id,
            word: entry.word,
            kesulitan: entry.kesulitan,
            kecepatan: entry.kecepatan,
            correct: entry.correct,
            user_answer: entry.userAnswer,
          })
          .select("id, word, kesulitan, kecepatan, correct, user_answer, created_at")
          .single();
        if (!error && data) {
          setHistory((prev) => [fromRow(data), ...prev].slice(0, MAX_ENTRIES));
        }
        return;
      }

      setHistory((prev) => {
        const next = [
          {
            ...entry,
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            timestamp: Date.now(),
          },
          ...prev,
        ].slice(0, MAX_ENTRIES);
        writeLocal(next);
        return next;
      });
    },
    [user]
  );

  return { history, addEntry, loaded };
}

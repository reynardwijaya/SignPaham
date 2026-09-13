"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Snail, Rabbit, History, Trash2, ArrowLeft } from "lucide-react";
import { HistoryEntry } from "@/hooks/useQuizHistory";

interface HistoryModalProps {
  isOpen: boolean;
  history: HistoryEntry[];
  onClose: () => void;
  onClear: () => void;
}

const kesulitanStyle: Record<string, { bg: string; text: string; label: string }> = {
  mudah: { bg: "bg-marigold/15", text: "text-marigold", label: "Mudah" },
  sedang: { bg: "bg-espresso/10", text: "text-espresso", label: "Sedang" },
  sulit: { bg: "bg-maroon/10", text: "text-maroon", label: "Sulit" },
};

function relativeTime(timestamp: number) {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 10) return "Baru saja";
  if (diffSec < 60) return `${diffSec} detik lalu`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} hari lalu`;
  return new Date(timestamp).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function HistoryModal({ isOpen, history, onClose, onClear }: HistoryModalProps) {
  const correctCount = history.filter((h) => h.correct).length;
  const scorePct =
    history.length > 0 ? Math.round((correctCount / history.length) * 100) : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-espresso/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-surface rounded-[2rem] shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 sm:px-7 pt-6 sm:pt-7 pb-4 border-b border-espresso/[0.06] flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-espresso flex items-center justify-center flex-shrink-0">
                  <History className="w-4 h-4 text-cream-soft" />
                </span>
                <div>
                  <h2 className="font-display font-bold text-lg sm:text-xl text-espresso leading-tight">
                    Riwayat Latihan
                  </h2>
                  {history.length > 0 && (
                    <p className="text-xs text-text-muted">
                      {correctCount}/{history.length} jawaban benar
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {history.length > 0 && (
                  <span className="px-3 py-1.5 rounded-full bg-success/10 text-success text-sm font-bold">
                    {scorePct}%
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-espresso/5 hover:bg-espresso/10 transition-colors flex-shrink-0"
                  aria-label="Tutup"
                >
                  <X size={16} className="text-espresso" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-7 py-4">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <span className="w-14 h-14 rounded-full bg-espresso/5 flex items-center justify-center mb-4">
                    <History className="w-6 h-6 text-espresso/40" />
                  </span>
                  <p className="font-display font-semibold text-espresso mb-1">
                    Belum ada riwayat
                  </p>
                  <p className="text-sm text-text-muted max-w-[220px]">
                    Riwayat latihanmu akan muncul di sini setelah menjawab soal.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {history.map((entry, idx) => {
                    const style = kesulitanStyle[entry.kesulitan];
                    return (
                      <motion.li
                        key={entry.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
                        className="flex items-center gap-3 rounded-2xl border border-espresso/[0.06] bg-cream-soft/40 px-4 py-3"
                      >
                        <span
                          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                            entry.correct ? "bg-success/15 text-success" : "bg-error/15 text-error"
                          }`}
                        >
                          {entry.correct ? <Check size={16} /> : <X size={16} />}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-semibold text-sm text-espresso truncate">
                              {entry.word}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${style.bg} ${style.text}`}
                            >
                              {style.label}
                            </span>
                          </div>
                          {!entry.correct && (
                            <p className="text-xs text-text-muted truncate">
                              Jawabanmu: {entry.userAnswer || "-"}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          {entry.kecepatan === "lambat" ? (
                            <Snail size={14} className="text-espresso/40" />
                          ) : (
                            <Rabbit size={14} className="text-espresso/40" />
                          )}
                          <span className="text-[11px] text-espresso/40 whitespace-nowrap">
                            {relativeTime(entry.timestamp)}
                          </span>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-6 sm:px-7 py-5 border-t border-espresso/[0.06] flex-shrink-0">
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-cream-soft hover:opacity-90 transition-opacity duration-200"
              >
                {history.length === 0 ? (
                  "Mulai Latihan"
                ) : (
                  <>
                    <ArrowLeft size={15} />
                    Kembali
                  </>
                )}
              </motion.button>

              {history.length > 0 && (
                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClear}
                  aria-label="Hapus riwayat"
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full border border-error/20 text-error hover:bg-error/5 transition-colors duration-200"
                >
                  <Trash2 size={15} />
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

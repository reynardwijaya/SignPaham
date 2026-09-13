"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AlfabetGrid from "@/components/alfabet/AlfabetGrid";
import HurufModal from "@/components/alfabet/HurufModal";
import CelebrationModal from "@/components/alfabet/CelebrationModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { alfabetData } from "@/data/alfabet";
import { useViewedHuruf } from "@/hooks/useViewedHuruf";
import { useToast } from "@/contexts/ToastContext";

export default function AlfabetPage() {
  const [selectedHuruf, setSelectedHuruf] = useState<string | null>(null);
  const { viewed, markViewed, resetProgress, loaded } = useViewedHuruf();
  const { showToast } = useToast();
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const hasInitialized = useRef(false);
  const prevSize = useRef(0);

  const handleResetProgress = async () => {
    const result = await resetProgress();
    setResetConfirmOpen(false);
    if (result.error) {
      showToast("Gagal mereset progres. Coba lagi.", "error");
      return;
    }
    showToast("Progres belajar berhasil direset.", "success");
  };

  const handleSelect = (huruf: string) => {
    setSelectedHuruf(huruf);
    markViewed(huruf);
  };

  const progressPct = Math.round((viewed.size / alfabetData.length) * 100);

  // Only celebrate on a genuine transition to 100% reached while on this
  // page — not when the saved progress already happens to be complete on load.
  useEffect(() => {
    if (!loaded) return;
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      prevSize.current = viewed.size;
      return;
    }
    if (prevSize.current < alfabetData.length && viewed.size === alfabetData.length) {
      setCelebrationOpen(true);
    }
    prevSize.current = viewed.size;
  }, [viewed.size, loaded]);

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar />

      <main className="flex-1 pt-20 pb-12 sm:pt-28 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-espresso mb-2 sm:mb-3">
              Daftar Huruf BISINDO
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-text-muted">
              Klik setiap huruf untuk melihat cara membentuknya dan mendapatkan penjelasan
              lengkap tentang isyarat huruf tersebut.
            </p>
          </motion.div>

          {/* Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-10 bg-surface rounded-2xl p-5 shadow-sm border border-espresso/[0.06] flex items-center gap-5"
          >
            <div className="flex-1">
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-display font-semibold text-sm sm:text-base text-espresso">
                  Progres Belajar
                </span>
                <span className="text-sm text-espresso/60">
                  {viewed.size}/{alfabetData.length} huruf
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-espresso/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-marigold to-maroon"
                />
              </div>
            </div>

            {viewed.size > 0 && (
              <button
                onClick={() => setResetConfirmOpen(true)}
                aria-label="Reset progres"
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-espresso/15 text-espresso/60 hover:text-error hover:border-error/30 hover:bg-error/5 transition-colors duration-200"
              >
                <RotateCcw size={15} />
              </button>
            )}
          </motion.div>

          <AlfabetGrid onHurufSelect={handleSelect} viewed={viewed} />
        </div>
      </main>

      <HurufModal
        huruf={selectedHuruf}
        onClose={() => setSelectedHuruf(null)}
        onNavigate={handleSelect}
      />

      <CelebrationModal
        isOpen={celebrationOpen}
        onClose={() => setCelebrationOpen(false)}
      />

      <ConfirmModal
        isOpen={resetConfirmOpen}
        title="Reset progres belajar?"
        description="Semua tanda huruf yang sudah dipelajari akan dihapus dan tidak bisa dikembalikan."
        confirmLabel="Ya, Reset"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={handleResetProgress}
        onCancel={() => setResetConfirmOpen(false)}
      />

      <Footer />
    </div>
  );
}

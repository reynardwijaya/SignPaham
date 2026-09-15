"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import KesulitanSelector from "@/components/latihan/KesulitanSelector";
import KecepatanSelector from "@/components/latihan/KecepatanSelector";
import QuizPlayer from "@/components/latihan/QuizPlayer";
import { Button } from "@/components/ui/Button";
import { Kesulitan } from "@/data/kosakata";
import { Lightbulb, History as HistoryIcon } from "lucide-react";
import { useQuizHistory } from "@/hooks/useQuizHistory";
import HistoryModal from "@/components/latihan/HistoryModal";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { UserPlus } from "lucide-react";

export default function LatihanPage() {
  const { user } = useAuth();
  const { openAuth } = useAuthModal();
  const [mode, setMode] = useState<"setup" | "playing">("setup");
  const [kesulitan, setKesulitan] = useState<Kesulitan | null>(null);
  const [kecepatan, setKecepatan] = useState<"lambat" | "cepat">("lambat");
  const [historyOpen, setHistoryOpen] = useState(false);
  const { history, addEntry } = useQuizHistory();

  const handleStart = () => {
    if (kesulitan) {
      setMode("playing");
    }
  };

  const handleBack = () => {
    setMode("setup");
    setKesulitan(null);
    setKecepatan("lambat");
  };

  if (mode === "playing" && kesulitan) {
    return (
      <QuizPlayer
        kesulitan={kesulitan}
        kecepatan={kecepatan}
        onBack={handleBack}
        onRecordHistory={addEntry}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar />

      <main className="flex-1 pt-20 pb-5 sm:pt-24 sm:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative">
          {/* Mascot welcoming the learner — fades in, then bobs gently forever */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="hidden lg:block absolute -right-60 xl:-right-72 top-24 pointer-events-none select-none"
          >
            <motion.img
              src="/mascot.png"
              alt=""
              aria-hidden="true"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="h-80 xl:h-96 w-auto object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 flex items-start justify-between gap-4"
          >
            <div>
              <h1 className="font-display font-semibold text-2xl sm:text-3xl text-espresso mb-1.5">
                Alfabet BISINDO
              </h1>
              <p className="text-sm sm:text-base text-text-muted">
                Tebak kata melalui bahasa isyarat Indonesia. Pilih tingkat kesulitan dan
                kecepatan tampilan yang sesuai untuk mu.
              </p>
            </div>

            {user && (
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setHistoryOpen(true)}
                className="flex items-center gap-1.5 rounded-full border border-espresso/15 bg-surface px-4 py-2 text-sm font-medium text-espresso hover:border-espresso/30 hover:bg-espresso/[0.03] transition-colors duration-200 flex-shrink-0"
              >
                <HistoryIcon size={15} />
                <span className="hidden sm:inline">Riwayat</span>
              </motion.button>
            )}
          </motion.div>

          {/* Save-progress CTA — guests only */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-espresso to-[#2a1810] px-5 py-4 sm:px-6 sm:py-5 shadow-sm"
            >
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-marigold/20 blur-2xl pointer-events-none" />
              <div className="relative flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-marigold/20 flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-4 h-4 text-marigold" />
                  </span>
                  <div>
                    <p className="font-display font-semibold text-sm sm:text-base text-cream-soft">
                      Pantau Perkembangan Belajarmu
                    </p>
                    <p className="text-xs sm:text-sm text-cream-soft/60">
                      Buat akun gratis untuk menyimpan skor dan riwayat latihan secara permanen.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => openAuth("register")}
                  className="px-5 py-2 rounded-full bg-marigold text-espresso text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-all duration-150 flex-shrink-0 whitespace-nowrap"
                >
                  Daftar Sekarang
                </button>
              </div>
            </motion.div>
          )}

          {/* Setup State */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-surface rounded-2xl p-5 sm:p-6 shadow-sm border border-espresso/[0.06]"
          >
            <KesulitanSelector
              selected={kesulitan}
              onSelect={setKesulitan}
            />

            <KecepatanSelector
              selected={kecepatan}
              onSelect={setKecepatan}
            />

            <Button
              variant="primary"
              size="lg"
              onClick={handleStart}
              disabled={!kesulitan}
              className="w-full"
            >
              Mulai Latihan
            </Button>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4 bg-cream-soft rounded-2xl p-4 sm:p-5"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-7 h-7 rounded-full bg-marigold flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-espresso" strokeWidth={2.25} />
              </span>
              <h3 className="font-display font-semibold text-sm sm:text-base text-espresso">
                Tips Bermain
              </h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs sm:text-sm text-text-muted">
              {[
                { num: 1, text: "Perhatikan setiap isyarat huruf dengan seksama", bg: "bg-espresso" },
                { num: 2, text: 'Belum siap? Gunakan kecepatan "Lambat"', bg: "bg-marigold" },
                { num: 3, text: 'Mulai dari tingkat "Mudah" jika baru pertama kali', bg: "bg-maroon" },
                { num: 4, text: "Ketik jawaban lalu tekan Enter atau tombol Jawab", bg: "bg-espresso" },
              ].map((tip) => (
                <li key={tip.num} className="flex items-center gap-2.5">
                  <span
                    className={`w-5 h-5 rounded-full ${tip.bg} text-cream-soft text-[10px] font-bold flex items-center justify-center flex-shrink-0`}
                  >
                    {tip.num}
                  </span>
                  <span>{tip.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </main>

      <HistoryModal
        isOpen={historyOpen}
        history={history}
        onClose={() => setHistoryOpen(false)}
      />

      <Footer />
    </div>
  );
}

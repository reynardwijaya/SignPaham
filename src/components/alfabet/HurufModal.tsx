"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { alfabetData } from "@/data/alfabet";

interface HurufModalProps {
  huruf: string | null;
  onClose: () => void;
  onNavigate: (huruf: string) => void;
}

const gradients = [
  "from-[#5a3b26] to-[#2a1810]",
  "from-[#f0a55f] to-[#cf7d33]",
  "from-[#8a2b28] to-[#4a0f0d]",
];

export default function HurufModal({ huruf, onClose, onNavigate }: HurufModalProps) {
  const currentIdx = huruf ? alfabetData.findIndex((h) => h.huruf === huruf) : -1;
  const lastIdx = useRef(currentIdx);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (currentIdx !== -1 && currentIdx !== lastIdx.current) {
      setDirection(currentIdx > lastIdx.current ? 1 : -1);
      lastIdx.current = currentIdx;
    }
  }, [currentIdx]);

  const currentData = currentIdx >= 0 ? alfabetData[currentIdx] : null;
  const prevHuruf = currentIdx > 0 ? alfabetData[currentIdx - 1].huruf : null;
  const nextHuruf =
    currentIdx >= 0 && currentIdx < alfabetData.length - 1
      ? alfabetData[currentIdx + 1].huruf
      : null;

  const goPrev = () => prevHuruf && onNavigate(prevHuruf);
  const goNext = () => nextHuruf && onNavigate(nextHuruf);

  useEffect(() => {
    if (!huruf) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [huruf, prevHuruf, nextHuruf]);

  if (!huruf || !currentData) return null;

  const gradient = gradients[currentIdx % gradients.length];

  return (
    <AnimatePresence>
      {huruf && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-espresso/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-surface rounded-[2rem] shadow-2xl max-w-sm w-full p-6 sm:p-7 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-espresso/5 hover:bg-espresso/10 transition-colors"
              aria-label="Tutup modal"
            >
              <X size={16} className="text-espresso" />
            </button>

            {/* Floating side navigation */}
            {prevHuruf && (
              <motion.button
                type="button"
                onClick={goPrev}
                whileHover={{ scale: 1.08, x: -2 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Huruf sebelumnya"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-surface shadow-md border border-espresso/[0.06] text-espresso hover:bg-cream-soft transition-colors"
              >
                <ChevronLeft size={18} />
              </motion.button>
            )}
            {nextHuruf && (
              <motion.button
                type="button"
                onClick={goNext}
                whileHover={{ scale: 1.08, x: 2 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Huruf berikutnya"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-surface shadow-md border border-espresso/[0.06] text-espresso hover:bg-cream-soft transition-colors"
              >
                <ChevronRight size={18} />
              </motion.button>
            )}

            {/* Content */}
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentData.huruf}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="text-center"
                >
                  {/* Gradient tile */}
                  <div
                    className={`relative mx-auto mb-4 w-44 h-44 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-br ${gradient} shadow-lg flex items-center justify-center overflow-hidden`}
                  >
                    <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
                    <span className="font-display font-bold text-7xl text-cream-soft">
                      {currentData.huruf}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-espresso/50 mb-3 tracking-wide">
                    Huruf {currentIdx + 1} dari {alfabetData.length}
                  </p>

                  {/* Description */}
                  <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                    {currentData.deskripsi}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-1 mt-5">
              {alfabetData.map((h) => (
                <span
                  key={h.huruf}
                  className={`h-1 rounded-full transition-all duration-200 ${
                    h.huruf === currentData.huruf
                      ? "w-4 bg-espresso"
                      : "w-1 bg-espresso/15"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

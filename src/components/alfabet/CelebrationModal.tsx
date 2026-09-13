"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONFETTI_COLORS = ["#E1934B", "#611715", "#3A2414", "#4C7A4C", "#FBEEDD"];

export default function CelebrationModal({ isOpen, onClose }: CelebrationModalProps) {
  const confetti = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.8 + Math.random() * 1,
        size: 6 + Math.random() * 6,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rotate: Math.random() * 360,
      })),
    []
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] bg-espresso/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden"
        >
          {/* Confetti */}
          {confetti.map((c) => (
            <motion.span
              key={c.id}
              initial={{ y: -40, x: `${c.x}vw`, opacity: 1, rotate: 0 }}
              animate={{ y: "110vh", rotate: c.rotate }}
              transition={{ duration: c.duration, delay: c.delay, ease: "easeIn" }}
              className="absolute top-0 rounded-sm pointer-events-none"
              style={{
                width: c.size,
                height: c.size,
                backgroundColor: c.color,
              }}
            />
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-surface rounded-[2rem] shadow-2xl max-w-xs w-full p-7 text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-espresso/5 hover:bg-espresso/10 transition-colors"
              aria-label="Tutup"
            >
              <X size={16} className="text-espresso" />
            </button>

            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.15 }}
              className="inline-flex w-16 h-16 rounded-full bg-marigold/15 items-center justify-center mb-5"
            >
              <Trophy className="w-7 h-7 text-marigold" />
            </motion.span>

            <h3 className="font-display font-bold text-xl text-espresso mb-2 tracking-tight">
              Semua Huruf Sudah Dipelajari!
            </h3>
            <p className="text-sm text-text-muted mb-6">
              Kamu sudah membuka seluruh 26 huruf BISINDO. Saatnya uji kemampuanmu di Latihan!
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-espresso text-cream-soft font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Mantap!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

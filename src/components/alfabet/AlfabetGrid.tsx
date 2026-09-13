"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { alfabetData } from "@/data/alfabet";

interface AlfabetGridProps {
  onHurufSelect: (huruf: string) => void;
  viewed: Set<string>;
}

const gradients = [
  "from-[#5a3b26] to-[#2a1810]",
  "from-[#f0a55f] to-[#cf7d33]",
  "from-[#8a2b28] to-[#4a0f0d]",
];

export default function AlfabetGrid({ onHurufSelect, viewed }: AlfabetGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4"
    >
      {alfabetData.map((huruf, idx) => {
        const isViewed = viewed.has(huruf.huruf);
        return (
          <motion.button
            key={huruf.huruf}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.03 }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.92, rotate: -2 }}
            onClick={() => onHurufSelect(huruf.huruf)}
            className={`relative aspect-square rounded-2xl flex items-center justify-center font-display font-bold text-2xl sm:text-3xl text-cream-soft bg-gradient-to-br shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden ${gradients[idx % gradients.length]}`}
          >
            {/* Glossy highlight */}
            <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />

            {huruf.huruf}

            {isViewed && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-success flex items-center justify-center shadow-sm"
              >
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

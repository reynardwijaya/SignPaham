"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Kesulitan } from "@/data/kosakata";

interface KesulitanSelectorProps {
  selected: Kesulitan | null;
  onSelect: (kesulitan: Kesulitan) => void;
}

const kesulitanOptions: Array<{
  value: Kesulitan;
  label: string;
  deskripsi: string;
  tintBg: string;
  tintBorder: string;
  solidBg: string;
  solidText: string;
}> = [
  {
    value: "mudah",
    label: "Mudah",
    deskripsi: "3-4 huruf",
    tintBg: "bg-marigold/[0.12]",
    tintBorder: "border-marigold/30",
    solidBg: "bg-marigold",
    solidText: "text-espresso",
  },
  {
    value: "sedang",
    label: "Sedang",
    deskripsi: "5-6 huruf",
    tintBg: "bg-espresso/[0.08]",
    tintBorder: "border-espresso/25",
    solidBg: "bg-espresso",
    solidText: "text-cream-soft",
  },
  {
    value: "sulit",
    label: "Sulit",
    deskripsi: "7+ huruf",
    tintBg: "bg-maroon/[0.1]",
    tintBorder: "border-maroon/30",
    solidBg: "bg-maroon",
    solidText: "text-cream-soft",
  },
];

export default function KesulitanSelector({
  selected,
  onSelect,
}: KesulitanSelectorProps) {
  return (
    <div className="mb-5">
      <h3 className="font-display font-semibold text-base sm:text-lg text-espresso mb-3">
        Pilih Tingkat Kesulitan
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {kesulitanOptions.map((option) => {
          const isSelected = selected === option.value;
          return (
            <motion.button
              key={option.value}
              type="button"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(option.value)}
              className={`relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-colors duration-200 border-2 shadow-sm ${
                isSelected
                  ? `${option.solidBg} border-transparent shadow-md`
                  : `${option.tintBg} ${option.tintBorder} hover:shadow-md`
              }`}
            >
              <span className="flex-1">
                <span
                  className={`block font-display font-semibold text-sm sm:text-base ${
                    isSelected ? option.solidText : "text-espresso"
                  }`}
                >
                  {option.label}
                </span>
                <span
                  className={`block text-xs sm:text-sm ${
                    isSelected ? `${option.solidText} opacity-80` : "text-espresso/60"
                  }`}
                >
                  {option.deskripsi}
                </span>
              </span>
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="w-5 h-5 rounded-full bg-surface flex items-center justify-center flex-shrink-0"
                >
                  <Check className="w-3 h-3 text-espresso" strokeWidth={3} />
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

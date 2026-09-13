"use client";

import { motion } from "framer-motion";
import { Snail, Rabbit, Check } from "lucide-react";

interface KecepatanSelectorProps {
  selected: "lambat" | "cepat";
  onSelect: (kecepatan: "lambat" | "cepat") => void;
}

const options = [
  { value: "lambat" as const, label: "Lambat", icon: Snail },
  { value: "cepat" as const, label: "Cepat", icon: Rabbit },
];

export default function KecepatanSelector({
  selected,
  onSelect,
}: KecepatanSelectorProps) {
  return (
    <div className="mb-5">
      <h3 className="font-display font-semibold text-base sm:text-lg text-espresso mb-3">
        Pilih Kecepatan Tampilan
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {options.map(({ value, label, icon: Icon }) => {
          const isSelected = selected === value;
          return (
            <motion.button
              key={value}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(value)}
              className={`relative flex items-center justify-center gap-2.5 rounded-2xl px-4 py-3.5 transition-all duration-200 border ${
                isSelected
                  ? "border-espresso bg-espresso/[0.04] shadow-sm"
                  : "border-espresso/10 bg-surface hover:border-espresso/25"
              }`}
            >
              <Icon size={20} className="text-espresso" />
              <span className="font-display font-semibold text-sm sm:text-base text-espresso">
                {label}
              </span>
              {isSelected && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-espresso flex items-center justify-center">
                  <Check className="w-3 h-3 text-cream-soft" strokeWidth={3} />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

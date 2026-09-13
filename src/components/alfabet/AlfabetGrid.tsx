"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { alfabetData } from "@/data/alfabet";

interface AlfabetGridProps {
  onHurufSelect: (huruf: string) => void;
  viewed: Set<string>;
}

const accents = ["bg-espresso", "bg-marigold", "bg-maroon"];
const accentText = ["text-cream-soft", "text-espresso", "text-cream-soft"];

export default function AlfabetGrid({ onHurufSelect, viewed }: AlfabetGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4"
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
            whileHover={{ scale: 1.06, y: -4 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => onHurufSelect(huruf.huruf)}
            className="relative aspect-[3/4] rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden bg-espresso/10"
          >
            {/* Photo — container ratio matches the source (3:4) so nothing crops */}
            <Image
              src={huruf.gambar}
              alt={`Isyarat huruf ${huruf.huruf}`}
              fill
              sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 14vw"
              className="object-cover"
            />

            {/* Bottom gradient for legible letter label */}
            <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

            <span
              className={`absolute bottom-1.5 left-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-display font-bold text-sm sm:text-base ${accents[idx % accents.length]} ${accentText[idx % accents.length]}`}
            >
              {huruf.huruf}
            </span>

            {isViewed && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-success flex items-center justify-center shadow-sm"
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

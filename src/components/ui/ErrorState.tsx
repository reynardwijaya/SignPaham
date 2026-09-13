"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ServerCrash, Construction, WifiOff, SearchX, RotateCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ErrorVariant = "server" | "maintenance" | "offline" | "notFound";

interface ErrorStateProps {
  variant: ErrorVariant;
  onRetry?: () => void;
  detail?: string;
}

const variantConfig: Record<
  ErrorVariant,
  { icon: LucideIcon; accent: string; badgeBg: string; title: string; description: string }
> = {
  server: {
    icon: ServerCrash,
    accent: "text-maroon",
    badgeBg: "bg-maroon/10",
    title: "Terjadi Kesalahan",
    description:
      "Sepertinya ada yang tidak beres di server kami. Tim SignPaham sedang menanganinya, coba lagi sebentar lagi ya.",
  },
  maintenance: {
    icon: Construction,
    accent: "text-marigold",
    badgeBg: "bg-marigold/15",
    title: "Sedang Dalam Pengembangan",
    description:
      "Fitur ini masih kami siapkan supaya pengalaman belajarmu makin seru. Balik lagi nanti, ya!",
  },
  offline: {
    icon: WifiOff,
    accent: "text-espresso",
    badgeBg: "bg-espresso/10",
    title: "Tidak Ada Koneksi Internet",
    description:
      "Periksa koneksi internetmu dan coba lagi. Materi BISINDO menunggu setelah kamu kembali online.",
  },
  notFound: {
    icon: SearchX,
    accent: "text-espresso",
    badgeBg: "bg-espresso/10",
    title: "Halaman Tidak Ditemukan",
    description:
      "Halaman yang kamu cari sepertinya tidak ada atau sudah dipindahkan.",
  },
};

export default function ErrorState({ variant, onRetry, detail }: ErrorStateProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        <motion.span
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          className={`inline-flex w-20 h-20 rounded-full items-center justify-center mb-6 ${config.badgeBg}`}
        >
          <Icon className={`w-9 h-9 ${config.accent}`} strokeWidth={1.75} />
        </motion.span>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-espresso mb-3 tracking-tight">
          {config.title}
        </h1>
        <p className="text-sm sm:text-base text-text-muted leading-relaxed mb-2">
          {config.description}
        </p>
        {detail && (
          <p className="text-xs text-espresso/40 font-mono mb-2 break-all">{detail}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-espresso text-cream-soft font-semibold text-sm hover:opacity-90 active:scale-[0.97] transition-all duration-150"
            >
              <RotateCw size={15} />
              Coba Lagi
            </button>
          )}
          <Link href="/">
            <button className="w-full sm:w-auto px-6 py-3 rounded-full bg-espresso/[0.06] text-espresso font-semibold text-sm hover:bg-espresso/[0.1] active:scale-[0.97] transition-all duration-150">
              Kembali ke Beranda
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

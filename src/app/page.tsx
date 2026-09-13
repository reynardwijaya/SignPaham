"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Hand, Sparkles, TrendingUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const features = [
    {
      title: "Alfabet BISINDO",
      description: "Pelajari 26 huruf dengan foto asli tangan pembuat.",
      icon: Hand,
      accent: "espresso",
    },
    {
      title: "Latihan Interaktif",
      description: "Tebak kata melalui rangkaian isyarat dengan berbagai tingkat.",
      icon: Sparkles,
      accent: "marigold",
    },
    {
      title: "Progress Tracking",
      description:
        "Lacak perkembangan belajarmu dan dapatkan skor untuk setiap latihan.",
      icon: TrendingUp,
      accent: "maroon",
    },
  ];

  const accentClasses: Record<string, { bg: string; text: string }> = {
    espresso: { bg: "bg-espresso", text: "text-cream-soft" },
    marigold: { bg: "bg-marigold", text: "text-espresso" },
    maroon: { bg: "bg-maroon", text: "text-cream-soft" },
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-cream">
        <main className="flex-1">
          {/* Hero Section with Background Photo + Wash Overlay */}
          <section
            className="relative w-full pt-20 flex items-end justify-center px-6 sm:px-10 lg:px-16 overflow-hidden"
            style={{ minHeight: "100vh" }}
          >
            {/* Background photo — isolated layer so the slight blur never touches the text */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url(/hero-bg.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(3px)",
                transform: "scale(1.05)",
              }}
            ></div>

            {/* Gradient scrim: photo reads clearly up top, text sits on solid ground at the bottom */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(58,36,20,0.05) 0%, rgba(58,36,20,0.05) 40%, rgba(35,22,12,0.55) 75%, rgba(24,15,8,0.8) 100%)",
              }}
            ></div>

            {/* Content - full-width, no boxed panel, editorial hero layout */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 w-full max-w-4xl mx-auto text-center pb-16 sm:pb-20 lg:pb-24"
            >
              {/* Main Title */}
              <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-cream-soft mb-5 leading-[1.05] tracking-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
                Belajar Bahasa
                <br />
                Isyarat Indonesia
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-semibold text-marigold mt-2">
                  (BISINDO)
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg lg:text-xl text-cream-soft/85 mb-10 font-normal max-w-xl mx-auto">
                2.500.000+ tunarungu di Indonesia. Mereka juga ingin didengar!
              </p>

              {/* CTA Buttons - bigger, more confident */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/latihan">
                  <button className="px-8 py-3.5 text-base font-semibold rounded-full bg-cream-soft text-espresso hover:opacity-90 active:scale-[0.97] transition-all duration-150 shadow-lg">
                    Mulai Latihan
                  </button>
                </Link>

                <Link href="/alfabet">
                  <button className="px-8 py-3.5 text-base font-semibold rounded-full bg-white/10 text-cream-soft border border-white/30 backdrop-blur-sm hover:bg-white/20 active:scale-[0.97] transition-all duration-150">
                    Pelajari Alfabet
                  </button>
                </Link>
              </div>
            </motion.div>
          </section>

          {/* Features Section */}
          <section className="relative pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 px-4 sm:px-6 lg:px-8 bg-cream overflow-hidden">
            {/* Decorative winding road tucked in the corner, cut edge hidden under the hero above */}
            <div className="absolute z-0 -right-4 -top-8 sm:-top-12 lg:-top-16 pointer-events-none">
              <img
                src="/road-path.png"
                alt=""
                aria-hidden="true"
                className="w-[32rem] sm:w-[42rem] lg:w-[52rem] object-contain opacity-90"
              />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
              >
                <span className="inline-block px-3 py-1 mb-3 rounded-full bg-marigold/15 text-marigold text-xs font-semibold tracking-wide uppercase">
                  Fitur Utama
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-espresso tracking-tight">
                  Kenapa <span className="text-marigold">SignPaham</span>?
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  const accent = accentClasses[feature.accent];
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="w-full h-52 sm:h-56 p-7 flex flex-col items-center justify-center text-center bg-surface rounded-3xl border border-espresso/[0.06] shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${accent.bg}`}
                      >
                        <Icon className={`w-6 h-6 ${accent.text}`} strokeWidth={2} />
                      </div>
                      <h3 className="font-display font-semibold text-lg sm:text-xl mb-2.5 text-espresso">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-espresso/70 leading-relaxed font-normal">
                        {feature.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative mt-10 sm:mt-12 lg:mt-14 rounded-[2rem] px-8 py-8 sm:px-12 sm:py-10 shadow-xl overflow-hidden bg-gradient-to-br from-maroon to-[#3a0d0b]"
              >
                {/* Decorative glow blobs */}
                <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-marigold/20 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 right-10 w-64 h-64 rounded-full bg-cream-soft/10 blur-3xl pointer-events-none" />

                <div className="relative flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-14 max-w-2xl lg:max-w-none mx-auto">
                  <div className="text-center lg:text-left">
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-cream-soft mb-2 tracking-tight">
                      Siap belajar bahasa isyarat?
                    </h3>
                    <p className="text-sm sm:text-base text-cream-soft/70 mb-6 max-w-md mx-auto lg:mx-0">
                      Mulai perjalananmu memahami BISINDO hari ini, gratis dan bisa dipelajari kapan saja.
                    </p>
                    <Link href="/latihan">
                      <button className="px-8 py-3 text-base font-semibold rounded-full bg-marigold text-espresso hover:opacity-90 active:scale-[0.97] transition-all duration-150 shadow-lg">
                        Mulai Latihan Sekarang
                      </button>
                    </Link>
                  </div>

                  {/* Mascot */}
                  <img
                    src="/mascot.png"
                    alt=""
                    aria-hidden="true"
                    className="hidden lg:block h-44 xl:h-52 w-auto object-contain flex-shrink-0 -mb-8"
                  />
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import AuthPanel, { AuthMode } from "@/components/auth/AuthPanel";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const requestLogout = () => {
    setMobileMenuOpen(false);
    setLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setLogoutConfirmOpen(false);
    showToast("Berhasil keluar. Sampai jumpa lagi!", "success");
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/alfabet", label: "Alfabet" },
    { href: "/latihan", label: "Latihan" },
  ];

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 w-full h-14 md:h-16 backdrop-blur-xl border-b border-white/10" style={{ backgroundColor: "rgba(58, 36, 20, 0.72)" }}>
        <div className="mx-auto max-w-6xl h-full px-5 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.08, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="/logo.png"
                alt="SignPaham"
                width={462}
                height={202}
                className="h-7 md:h-8 w-auto object-contain"
                priority
              />
            </motion.div>
          </Link>

          {/* Navigation Links — desktop/tablet only */}
          <div className="hidden md:flex items-center gap-6 lg:gap-9">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-sm tracking-wide transition-colors duration-200 ${
                  isActive(link.href)
                    ? "text-white"
                    : "text-white/60 hover:text-white/90"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Area — desktop/tablet only */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {user ? (
              <>
                <div className="flex items-center gap-2 bg-white/10 rounded-full pl-1.5 pr-3.5 py-1.5">
                  <span className="w-6 h-6 rounded-full bg-marigold flex items-center justify-center flex-shrink-0">
                    <span className="font-display font-bold text-[11px] text-espresso">
                      {user.firstName.charAt(0).toUpperCase()}
                    </span>
                  </span>
                  <span className="font-body text-sm text-white whitespace-nowrap">
                    Hi, <span className="font-semibold">{user.firstName}</span>
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={requestLogout}
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-error/90 transition-colors duration-200"
                >
                  <LogOut size={13} className="text-white/80 group-hover:text-white transition-colors" />
                  <span className="font-body text-[13px] text-white/80 group-hover:text-white transition-colors">
                    Keluar
                  </span>
                </motion.button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openAuth("login")}
                  className="font-body text-sm text-white/80 hover:text-white transition-colors"
                >
                  Masuk
                </button>
                <button
                  onClick={() => openAuth("register")}
                  className="px-4 py-1.5 rounded-full bg-marigold text-espresso text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-all duration-150"
                >
                  Daftar
                </button>
              </>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white/10 flex-shrink-0"
            aria-label="Buka menu"
          >
            {mobileMenuOpen ? (
              <X size={18} className="text-white" />
            ) : (
              <Menu size={18} className="text-white" />
            )}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-white/10"
              style={{ backgroundColor: "rgba(58, 36, 20, 0.95)" }}
            >
              <div className="px-5 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-2.5 font-body text-base ${
                      isActive(link.href) ? "text-white font-semibold" : "text-white/70"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="border-t border-white/10 mt-2 pt-4">
                  {user ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-marigold flex items-center justify-center flex-shrink-0">
                          <span className="font-display font-bold text-xs text-espresso">
                            {user.firstName.charAt(0).toUpperCase()}
                          </span>
                        </span>
                        <span className="font-body text-sm text-white">
                          Hi, <span className="font-semibold">{user.firstName}</span>
                        </span>
                      </div>
                      <button
                        onClick={requestLogout}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-sm"
                      >
                        <LogOut size={13} />
                        Keluar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openAuth("login")}
                        className="flex-1 py-2.5 rounded-full border border-white/20 text-white text-sm font-medium"
                      >
                        Masuk
                      </button>
                      <button
                        onClick={() => openAuth("register")}
                        className="flex-1 py-2.5 rounded-full bg-marigold text-espresso text-sm font-semibold"
                      >
                        Daftar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthPanel
        isOpen={authOpen}
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={() => setAuthOpen(false)}
      />

      <ConfirmModal
        isOpen={logoutConfirmOpen}
        title="Keluar dari akun?"
        description="Kamu bisa masuk lagi kapan saja untuk lanjutkan progres belajarmu."
        confirmLabel="Ya, Keluar"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={confirmLogout}
        onCancel={() => setLogoutConfirmOpen(false)}
      />
    </>
  );
}

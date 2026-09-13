"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, MailCheck, KeyRound, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export type AuthMode = "login" | "register" | "forgot";

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  labelRight?: React.ReactNode;
}

function PasswordField({ label, value, onChange, placeholder, labelRight }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-semibold text-espresso/70">{label}</label>
        {labelRight}
      </div>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          required
          minLength={6}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 pr-11 rounded-xl border-2 border-espresso/10 focus:border-espresso outline-none font-body text-sm transition-colors"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/40 hover:text-espresso transition-colors"
          aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          tabIndex={-1}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

interface AuthPanelProps {
  isOpen: boolean;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
}

export default function AuthPanel({ isOpen, mode, onModeChange, onClose }: AuthPanelProps) {
  const { login, register, resetPasswordDirect } = useAuth();
  const { showToast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  // Reset form state whenever the panel opens or the mode is switched
  useEffect(() => {
    if (isOpen) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setError("");
      setIsSubmitting(false);
      setConfirmationSent(false);
      setResetDone(false);
    }
  }, [isOpen, mode]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = (): string | null => {
    if (mode === "register") {
      if (!firstName.trim()) return "Nama depan wajib diisi.";
      if (!lastName.trim()) return "Nama belakang wajib diisi.";
    }
    if (!email.trim()) return "Email wajib diisi.";
    if (!EMAIL_REGEX.test(email.trim())) return "Format email tidak valid.";

    if (mode === "forgot") {
      if (!newPassword) return "Kata sandi baru wajib diisi.";
      if (newPassword.length < 6) return "Kata sandi minimal 6 karakter.";
      if (newPassword !== confirmNewPassword) return "Konfirmasi kata sandi tidak cocok.";
    } else {
      if (!password) return "Kata sandi wajib diisi.";
      if (mode === "register" && password.length < 6) return "Kata sandi minimal 6 karakter.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    if (mode === "forgot") {
      const result = await resetPasswordDirect(email, newPassword);
      setIsSubmitting(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      setResetDone(true);
      return;
    }

    const result =
      mode === "register"
        ? await register({ firstName, lastName, email, password })
        : await login(email, password);

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.needsEmailConfirmation) {
      setConfirmationSent(true);
      return;
    }
    showToast(
      mode === "register" ? "Akun berhasil dibuat! Selamat belajar." : "Berhasil masuk!",
      "success"
    );
    onClose();
  };

  const titles: Record<AuthMode, string> = {
    login: "Selamat datang kembali",
    register: "Buat akun baru",
    forgot: "Lupa Kata Sandi",
  };

  const subtitles: Record<AuthMode, string> = {
    login: "Masuk untuk lanjutkan progres belajarmu.",
    register: "Gratis, cuma butuh beberapa detik untuk mulai.",
    forgot: "Masukkan email yang terdaftar dan kata sandi barumu.",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-espresso/60 backdrop-blur-sm"
          />

          {/* Sliding panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 z-[61] h-full w-full max-w-md bg-surface rounded-l-[2rem] shadow-2xl flex flex-col overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 pt-6 sm:pt-8">
              <span className="font-display font-bold text-xl text-espresso">
                SignPaham
              </span>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-espresso/5 hover:bg-espresso/10 transition-colors"
                aria-label="Tutup"
              >
                <X size={17} className="text-espresso" />
              </button>
            </div>

            <div className="px-6 sm:px-8 pb-8 pt-6 flex-1 flex flex-col">
              {confirmationSent || resetDone ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center py-10"
                >
                  <span className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-5">
                    {resetDone ? (
                      <CheckCircle2 className="w-7 h-7 text-success" />
                    ) : (
                      <MailCheck className="w-7 h-7 text-success" />
                    )}
                  </span>
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-espresso mb-2 tracking-tight">
                    {resetDone ? "Kata Sandi Diperbarui" : "Cek email kamu"}
                  </h2>
                  <p className="text-sm text-text-muted max-w-[280px] mb-7">
                    {resetDone ? (
                      <>
                        Kata sandi untuk <strong>{email}</strong> berhasil diubah. Silakan
                        masuk pakai kata sandi barumu.
                      </>
                    ) : (
                      <>
                        Kami sudah kirim link konfirmasi ke <strong>{email}</strong>. Klik
                        link tersebut untuk mengaktifkan akunmu.
                      </>
                    )}
                  </p>
                  <button
                    onClick={() => onModeChange("login")}
                    className="px-6 py-2.5 rounded-full bg-espresso text-cream-soft font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Kembali ke Masuk
                  </button>
                </motion.div>
              ) : (
                <>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-espresso mb-1.5 tracking-tight">
                    {titles[mode]}
                  </h2>
                  <p className="text-sm text-text-muted mb-7">{subtitles[mode]}</p>

                  <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                    {mode === "register" && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-espresso/70 mb-1.5">
                            Nama Depan
                          </label>
                          <input
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Reynard"
                            className="w-full px-4 py-2.5 rounded-xl border-2 border-espresso/10 focus:border-espresso outline-none font-body text-sm transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-espresso/70 mb-1.5">
                            Nama Belakang
                          </label>
                          <input
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Wijaya"
                            className="w-full px-4 py-2.5 rounded-xl border-2 border-espresso/10 focus:border-espresso outline-none font-body text-sm transition-colors"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-espresso/70 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@gmail.com"
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-espresso/10 focus:border-espresso outline-none font-body text-sm transition-colors"
                      />
                    </div>

                    {mode === "forgot" ? (
                      <>
                        <PasswordField
                          label="Kata Sandi Baru"
                          value={newPassword}
                          onChange={setNewPassword}
                          placeholder="Minimal 6 karakter"
                        />
                        <PasswordField
                          label="Konfirmasi Kata Sandi"
                          value={confirmNewPassword}
                          onChange={setConfirmNewPassword}
                          placeholder="Ulangi kata sandi baru"
                        />
                      </>
                    ) : (
                      <PasswordField
                        label="Kata Sandi"
                        value={password}
                        onChange={setPassword}
                        placeholder="Minimal 6 karakter"
                        labelRight={
                          mode === "login" ? (
                            <button
                              type="button"
                              onClick={() => onModeChange("forgot")}
                              className="text-xs font-semibold text-espresso/60 hover:text-marigold transition-colors"
                            >
                              Lupa kata sandi?
                            </button>
                          ) : undefined
                        }
                      />
                    )}

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs font-medium text-error bg-error/10 rounded-lg px-3 py-2"
                      >
                        {error}
                      </motion.p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-2 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-espresso text-cream-soft font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : mode === "forgot" ? (
                        <KeyRound size={15} />
                      ) : null}
                      {mode === "login" ? "Masuk" : mode === "register" ? "Daftar" : "Ubah Kata Sandi"}
                    </button>
                  </form>

                  <p className="text-center text-sm text-text-muted mt-6">
                    {mode === "login" && (
                      <>
                        Belum punya akun?{" "}
                        <button
                          onClick={() => onModeChange("register")}
                          className="font-semibold text-espresso hover:text-marigold transition-colors"
                        >
                          Daftar
                        </button>
                      </>
                    )}
                    {mode === "register" && (
                      <>
                        Sudah punya akun?{" "}
                        <button
                          onClick={() => onModeChange("login")}
                          className="font-semibold text-espresso hover:text-marigold transition-colors"
                        >
                          Masuk
                        </button>
                      </>
                    )}
                    {mode === "forgot" && (
                      <>
                        Ingat kata sandimu?{" "}
                        <button
                          onClick={() => onModeChange("login")}
                          className="font-semibold text-espresso hover:text-marigold transition-colors"
                        >
                          Masuk
                        </button>
                      </>
                    )}
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

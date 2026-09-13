"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, LogOut, RotateCcw } from "lucide-react";
import HurufImage from "@/components/ui/HurufImage";
import { Button } from "@/components/ui/Button";
import { useQuizEngine } from "@/hooks/useQuizEngine";
import { Kesulitan } from "@/data/kosakata";
import { HistoryEntry } from "@/hooks/useQuizHistory";

interface QuizPlayerProps {
  kesulitan: Kesulitan;
  kecepatan: "lambat" | "cepat";
  onBack: () => void;
  onRecordHistory: (entry: Omit<HistoryEntry, "id" | "timestamp">) => void;
}

export default function QuizPlayer({
  kesulitan,
  kecepatan,
  onBack,
  onRecordHistory,
}: QuizPlayerProps) {
  const quiz = useQuizEngine(kesulitan, kecepatan);
  const [userInput, setUserInput] = useState("");

  // Start quiz when component mounts
  if (quiz.mode === "setup" && quiz.word === "") {
    quiz.startQuiz();
  }

  const handleSubmit = () => {
    if (userInput.trim()) {
      onRecordHistory({
        word: quiz.word,
        kesulitan,
        kecepatan,
        correct: userInput.trim().toUpperCase() === quiz.word.toUpperCase(),
        userAnswer: userInput.trim(),
      });
      quiz.submitJawaban(userInput);
      setUserInput("");
    }
  };

  const handleNext = () => {
    quiz.ulangi();
    setUserInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && quiz.feedback === "none") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-cream py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display font-semibold text-xl sm:text-2xl text-espresso">
              Alfabet BISINDO
            </h1>
            <p className="text-sm text-text-muted">
              Tebak kata melalui bahasa isyarat Indonesia
            </p>
          </div>
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-full border border-espresso/15 bg-surface px-4 py-2 text-sm font-medium text-espresso hover:border-espresso/30 hover:bg-espresso/[0.03] transition-colors duration-200"
          >
            <LogOut size={15} />
            Keluar
          </motion.button>
        </div>

        {/* Score */}
        {(() => {
          const pct =
            quiz.totalAttempts > 0
              ? Math.round((quiz.score / quiz.totalAttempts) * 100)
              : 0;
          const ringColor =
            quiz.totalAttempts === 0
              ? "#7A6552"
              : pct >= 70
              ? "#4C7A4C"
              : pct >= 40
              ? "#E1934B"
              : "#B4453F";
          const r = 24;
          const circumference = 2 * Math.PI * r;
          const offset = circumference - (pct / 100) * circumference;

          return (
            <div className="bg-surface rounded-2xl p-5 mb-8 shadow-sm border border-espresso/[0.06] flex items-center gap-5">
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r={r}
                    fill="none"
                    stroke="currentColor"
                    className="text-espresso/10"
                    strokeWidth="7"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r={r}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display font-bold text-sm text-espresso">
                    {pct}%
                  </span>
                </div>
              </div>
              <div>
                <p className="font-display font-semibold text-base sm:text-lg text-espresso">
                  Skor {quiz.score}/{quiz.totalAttempts}
                </p>
                <p className="text-xs sm:text-sm text-espresso/60">
                  {quiz.totalAttempts === 0
                    ? "Ayo mulai jawab kata pertamamu!"
                    : pct >= 70
                    ? "Mantap, terus lanjutkan!"
                    : pct >= 40
                    ? "Sudah cukup baik, semangat!"
                    : "Ayo coba lagi, kamu pasti bisa!"}
                </p>
              </div>
            </div>
          );
        })()}

        {/* Quiz Display Area */}
        {quiz.mode === "playing" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-2xl p-8 shadow-lg mb-8"
          >
            {/* Displaying Huruf */}
            <AnimatePresence mode="wait">
              {quiz.isDisplaying && quiz.currentHurufData ? (
                <motion.div
                  key={quiz.currentHurufIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="text-center mb-8"
                >
                  <p className="text-text-muted mb-4 font-display font-semibold">
                    Huruf {quiz.currentHurufIndex + 1} dari {quiz.hurufList.length}
                  </p>
                  <div className="flex justify-center">
                    <HurufImage
                      huruf={quiz.currentHurufData.huruf}
                      src={quiz.currentHurufData.gambar}
                      alt={`Isyarat huruf ${quiz.currentHurufData.huruf}`}
                      size="lg"
                      priority
                    />
                  </div>
                </motion.div>
              ) : !quiz.isDisplaying && quiz.currentHurufIndex >= quiz.hurufList.length ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <p className="text-text-muted mb-6 font-display font-semibold">
                    Semua huruf sudah ditampilkan
                  </p>

                  {/* Feedback */}
                  <div className="mb-8">
                    {quiz.feedback === "correct" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-3 bg-success/10 text-success px-6 py-3 rounded-pill font-bold"
                      >
                        <Check size={24} />
                        Benar!
                      </motion.div>
                    )}
                    {quiz.feedback === "incorrect" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-3 bg-error/10 text-error px-6 py-3 rounded-pill font-bold"
                      >
                        <X size={24} />
                        Salah
                      </motion.div>
                    )}
                  </div>

                  {/* Answer Display */}
                  {quiz.feedback !== "none" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8"
                    >
                      <p className="text-sm text-text-muted mb-2">Jawabanmu:</p>
                      <p className="font-display font-bold text-2xl text-espresso mb-4">
                        {quiz.userAnswer}
                      </p>
                      <p className="text-sm text-text-muted mb-2">Jawaban yang benar:</p>
                      <p className="font-display font-bold text-2xl text-success">
                        {quiz.word}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Input Area */}
            {!quiz.isDisplaying && quiz.currentHurufIndex >= quiz.hurufList.length && quiz.feedback === "none" && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <motion.button
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={quiz.replayDisplay}
                    className="flex items-center gap-1.5 rounded-full border border-espresso/15 bg-surface px-4 py-2 text-sm font-medium text-espresso hover:border-espresso/30 hover:bg-espresso/[0.03] transition-colors duration-200"
                  >
                    <RotateCcw size={14} />
                    Ulangi Tampilan
                  </motion.button>
                </div>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik jawabanmu di sini..."
                  className="w-full px-4 py-3 border-2 border-text-muted/20 rounded-lg font-body text-lg focus:outline-none focus:border-espresso"
                  autoFocus
                />
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  className="w-full"
                >
                  Jawab
                </Button>
              </div>
            )}

            {/* Next Button */}
            {quiz.feedback !== "none" && (
              <Button
                variant="secondary"
                size="lg"
                onClick={handleNext}
                className="w-full"
              >
                Kata Berikutnya
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

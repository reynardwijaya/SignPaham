"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "default";
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = "Ya",
  cancelLabel = "Batal",
  onConfirm,
  onCancel,
  variant = "default",
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 z-[70] bg-espresso/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 6 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface rounded-[1.75rem] shadow-2xl max-w-xs w-full p-6 text-center"
          >
            <span
              className={`inline-flex w-12 h-12 rounded-full items-center justify-center mb-4 ${
                variant === "danger" ? "bg-error/10" : "bg-espresso/10"
              }`}
            >
              <AlertTriangle
                className={`w-5 h-5 ${variant === "danger" ? "text-error" : "text-espresso"}`}
              />
            </span>
            <h3 className="font-display font-bold text-lg text-espresso mb-1.5">{title}</h3>
            <p className="text-sm text-text-muted mb-6">{description}</p>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-full bg-espresso/[0.06] text-espresso text-sm font-semibold hover:bg-espresso/[0.1] transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-2.5 rounded-full text-sm font-semibold text-cream-soft transition-opacity hover:opacity-90 ${
                  variant === "danger" ? "bg-error" : "bg-espresso"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

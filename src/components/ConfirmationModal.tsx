import React from "react";
import { Loader2, AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDangerous = false,
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/20 dark:bg-black/50 backdrop-blur-sm" onClick={isLoading ? undefined : onClose} />
      <div className="relative bg-white dark:bg-[#0A0A0A] rounded-xl w-full max-w-sm shadow-2xl border border-divider flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
          <div className="flex items-center gap-2">
            {isDangerous && <AlertTriangle className="w-5 h-5 text-danger" />}
            <h3 className="text-[18px] font-bold text-foreground">{title}</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 hover:bg-default-100 rounded-full transition-colors text-default-400 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-sm text-default-500 font-medium leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-divider flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 h-9 bg-default-100 hover:bg-default-200 text-foreground font-bold rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 h-9 font-bold rounded-lg transition-colors text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
              isDangerous
                ? "bg-danger text-white shadow-danger/20"
                : "bg-primary text-white shadow-primary/20"
            }`}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

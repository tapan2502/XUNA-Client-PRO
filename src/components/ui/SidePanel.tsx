"use client";

import React, { useEffect } from "react";
import { domAnimation, LazyMotion, m, AnimatePresence } from "framer-motion";
import { X, ChevronLeft } from "lucide-react";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string | React.ReactNode;
  headerContent?: React.ReactNode; // Content to render below title in sticky header
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string; // Additional classes for the panel container
  isDismissable?: boolean; // If true, clicking outside closes it
  showBack?: boolean; // Show back button
  onBack?: () => void;
}

const variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: "100%", opacity: 0 },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function SidePanel({
  isOpen,
  onClose,
  title,
  subtitle,
  headerContent,
  children,
  footer,
  size = "xl",
  className = "",
  isDismissable = true,
  showBack,
  onBack,
}: SidePanelProps) {
  
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && isDismissable) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, isDismissable, onClose]);

  const getMaxWidth = () => {
    switch (size) {
      case "sm": return "max-w-md";
      case "md": return "max-w-lg";
      case "lg": return "max-w-2xl";
      case "xl": return "max-w-4xl";
      case "2xl": return "max-w-6xl";
      case "full": return "max-w-full";
      default: return "max-w-2xl";
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
             {/* Overlay - Darker and more blur for focus */}
            <m.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={isDismissable ? onClose : undefined}
            />

            {/* Panel */}
            <m.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className={`relative h-full w-full ${getMaxWidth()} bg-white dark:bg-black shadow-[0_0_50px_rgba(0,0,0,0.25)] flex flex-col border-l border-white/10 ${className}`}
            >
              {/* Header - Minimalist, no heavy borders */}
              <div className="flex-none px-8 py-6 bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-20 flex flex-col gap-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        {showBack && (
                            <button 
                                onClick={onBack}
                                className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h2>
                        {subtitle && <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{subtitle}</div>}
                    </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
                    >
                    <X size={24} />
                    </button>
                </div>
                {headerContent}
              </div>

              {/* Content - Spacious and clean */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 scrollbar-hide">
                {children}
            </div>

              {/* Footer - Floating effect */}
              {footer && (
                <div className="flex-none px-8 py-6 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-900/50">
                  {footer}
                </div>
              )}
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}

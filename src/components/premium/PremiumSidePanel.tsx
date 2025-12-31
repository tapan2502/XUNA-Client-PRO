"use client";

import React, { useEffect } from "react";
import { domAnimation, LazyMotion, m, AnimatePresence } from "framer-motion";
import { X, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string | React.ReactNode;
  headerContent?: React.ReactNode; 
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";
  className?: string; 
  isDismissable?: boolean; 
  showBack?: boolean; 
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

export function PremiumSidePanel({
  isOpen,
  onClose,
  title,
  subtitle,
  headerContent,
  children,
  footer,
  size = "lg",
  className = "",
  isDismissable = true,
  showBack,
  onBack,
}: PremiumSidePanelProps) {
  
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
      case "sm": return "max-w-md"; // 448px
      case "md": return "max-w-2xl"; // 672px
      case "lg": return "max-w-2xl"; // 672px
      case "xl": return "max-w-2xl"; // 672px
      case "full": return "max-w-full";
      default: return "max-w-2xl"; 
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
             {/* Overlay - Darker and more blur for focus */}
            <m.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={isDismissable ? onClose : undefined}
            />

            {/* Panel */}
            <m.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                "relative h-full w-full bg-white dark:bg-[#0A0A0A] shadow-2xl flex flex-col border-l border-divider",
                getMaxWidth(),
                className
              )}
            >
              {/* Header */}
              <div className="flex-none px-6 py-4 bg-white/60 dark:bg-[#0A0A0A]/60 backdrop-blur-2xl sticky top-0 z-30 w-full border-b border-divider shadow-sm">
                <div className="flex items-start justify-between max-w-4xl mx-auto w-full">
                    <div className="flex items-center gap-4">
                        {showBack && (
                            <button 
                                onClick={onBack}
                                className="p-2 -ml-2 rounded-full hover:bg-default-100 transition-colors text-default-500 hover:text-foreground"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}
                    <div className="space-y-0.5">
                        <h2 className="text-[18px] font-bold tracking-tight text-foreground capitalize">{title}</h2>
                        {subtitle && <div className="text-[12px] text-default-500 font-medium">{subtitle}</div>}
                    </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
                    >
                    <X size={20} />
                    </button>
                </div>
                {headerContent && <div className="mt-6 max-w-4xl mx-auto w-full">{headerContent}</div>}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                 {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="flex-none px-6 py-4 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border-t border-divider">
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

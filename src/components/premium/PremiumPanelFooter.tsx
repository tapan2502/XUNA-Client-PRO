import { cn } from "@/lib/utils";
import React from "react";

interface PremiumPanelFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function PremiumPanelFooter({ children, className }: PremiumPanelFooterProps) {
  return (
    <div className={cn("flex items-center justify-end gap-3 w-full", className)}>
      {children}
    </div>
  );
}

import { cn } from "@/lib/utils";
import React from "react";

interface PremiumPanelContentProps {
  children: React.ReactNode;
  className?: string;
}

export function PremiumPanelContent({ children, className }: PremiumPanelContentProps) {
  return (
    <div className={cn("flex flex-col gap-6 max-w-4xl mx-auto w-full p-6 pb-20", className)}>
      {children}
    </div>
  );
}

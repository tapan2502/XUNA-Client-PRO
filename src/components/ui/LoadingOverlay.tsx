import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export const LoadingOverlay: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm transition-all duration-300"
    >
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm font-medium text-default-500 animate-pulse">
          Syncing workspace data...
        </p>
      </div>
    </div>
  );
};

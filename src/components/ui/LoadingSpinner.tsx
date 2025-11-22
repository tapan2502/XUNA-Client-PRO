import React from 'react';

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

// User requested "small spinner only", so we map all sizes to the small config
// but slightly tuned for better visibility
const config = { dot: 12, gap: 8 };

const dots = [
  { color: '#ff6b6b', glow: 'rgba(255,107,107,0.5)', delay: '0s' },
  { color: '#feca57', glow: 'rgba(254,202,87,0.5)', delay: '0.15s' },
  { color: '#48dbfb', glow: 'rgba(72,219,251,0.5)', delay: '0.3s' }
];

export function LoadingSpinner({ 
  size = "md", // Prop kept for compatibility but ignored for sizing
  text = "", 
  className = "",
  fullScreen = false 
}: LoadingSpinnerProps) {
  
  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="flex items-center p-4" style={{ gap: config.gap }}>
        {dots.map((dot, i) => (
          <div
            key={i}
            className="rounded-full transform-gpu"
            style={{
              width: config.dot,
              height: config.dot,
              background: `radial-gradient(circle at 30% 30%, ${dot.color}, ${dot.color}dd)`,
              // Refined shadow for better "finishing" - softer glow, cleaner inset
              boxShadow: `
                0 0 ${config.dot * 1.5}px ${dot.glow}, 
                inset 0 -${config.dot/3}px ${config.dot/1.5}px rgba(0,0,0,0.15), 
                inset 0 ${config.dot/3}px ${config.dot/1.5}px rgba(255,255,255,0.4)
              `,
              animation: `bounce 0.6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate`,
              animationDelay: dot.delay
            }}
          />
        ))}
      </div>

      {text && (
        <p 
          className="text-xs font-semibold tracking-widest uppercase text-muted-foreground/80"
          style={{
            animation: 'fade 2s ease-in-out infinite'
          }}
        >
          {text}
        </p>
      )}

      <style>{`
        @keyframes bounce {
          0% {
            transform: translateY(0) scale(1);
            filter: brightness(1);
          }
          100% {
            transform: translateY(-12px) scale(0.9);
            filter: brightness(1.1);
          }
        }
        @keyframes fade {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
        {content}
      </div>
    );
  }

  return content;
}
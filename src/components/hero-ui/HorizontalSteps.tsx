import React from "react"
import { Check } from "lucide-react"
import { cn } from "@heroui/react"

interface Step {
  title: string
}

interface HorizontalStepsProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (step: number) => void
}

export default function HorizontalSteps({ steps, currentStep, onStepClick }: HorizontalStepsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep

          return (
            <React.Fragment key={index}>
              {/* Step Circle */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => onStepClick?.(index)}
                  disabled={isUpcoming}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    isUpcoming && "bg-default-200 text-default-500 cursor-not-allowed",
                    !isUpcoming && "cursor-pointer hover:scale-110"
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                </button>
                <span
                  className={cn(
                    "text-xs font-medium text-center max-w-[100px]",
                    isCurrent && "text-foreground font-semibold",
                    !isCurrent && "text-default-500"
                  )}
                >
                  {step.title}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 rounded-full bg-default-200 relative overflow-hidden">
                  <div
                    className={cn(
                      "absolute inset-0 transition-all duration-300",
                      index < currentStep ? "bg-primary w-full" : "bg-transparent w-0"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

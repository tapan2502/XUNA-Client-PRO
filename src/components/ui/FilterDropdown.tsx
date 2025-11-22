"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FilterDropdownProps {
  label?: string
  value: string
  options: { label: string; value: string }[]
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  icon?: React.ReactNode
  className?: string
}

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  onClear,
  placeholder = "Select...",
  icon,
  className = "",
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200
          ${isOpen 
            ? "border-primary ring-1 ring-primary bg-card text-foreground" 
            : "border-border bg-card hover:bg-accent/50 text-foreground hover:border-primary/50"
          }
          ${value ? "text-foreground" : "text-muted-foreground"}
          min-w-[160px]
        `}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {value && onClear && (
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                onClear()
              }}
              className="p-0.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </div>
          )}
          <ChevronDown
            size={14}
            className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-2 w-full min-w-[200px] bg-white dark:bg-[#0f172a] rounded-xl border border-border shadow-xl overflow-hidden"
            style={{ left: 0 }}
          >
            <div className="max-h-[240px] overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 text-sm transition-colors
                    ${value === option.value
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }
                  `}
                >
                  <span className="truncate">{option.label}</span>
                  {value === option.value && <Check size={14} />}
                </button>
              ))}
              {options.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                  No options available
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

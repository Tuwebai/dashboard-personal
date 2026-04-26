import { motion } from 'framer-motion';
import { cn } from '../lib/cn';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
}

export function Switch({ 
  checked, 
  onChange, 
  label, 
  description, 
  ariaLabel,
  className,
  disabled = false 
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? label}
      disabled={disabled}
      className={cn(
        "flex items-center justify-between gap-4 group cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={() => !disabled && onChange(!checked)}
    >
      {(label || description) && (
        <div className="flex flex-col gap-0.5 select-none">
          {label && (
            <span className="text-sm font-bold text-white tracking-tight group-hover:text-white transition-colors">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-white/30 font-medium">
              {description}
            </span>
          )}
        </div>
      )}
      
      <div 
        className={cn(
          "relative h-6 w-12 rounded-full transition-all duration-300 ring-2 ring-transparent",
          checked ? "nexus-switch-track-on" : "bg-white/5",
          "hover:ring-white/5"
        )}
      >
        <motion.div
          className={cn(
            "absolute top-1 left-1 w-4 h-4 rounded-full shadow-lg",
            checked ? "nexus-switch-thumb-on" : "bg-white/20"
          )}
          initial={false}
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  );
}

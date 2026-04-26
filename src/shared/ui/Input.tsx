import { forwardRef } from 'react';
import { cn } from '../lib/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  className,
  ...props
}, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-white/70">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'nexus-field-accent w-full bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white/90 placeholder:text-white/20',
            'focus:outline-none',
            'transition-all duration-300',
            'h-[var(--field-height)] px-4',
            leftIcon && 'pl-11',
            rightIcon && 'pr-11',
            error && 'border-red-500/40 focus:border-red-500/40 focus:ring-red-500/10',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  className,
  ...props
}, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-white/70">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'nexus-field-accent w-full bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white/90 placeholder:text-white/20',
          'focus:outline-none',
          'transition-all duration-300 resize-none p-4',
          error && 'border-red-500/40 focus:border-red-500/40 focus:ring-red-500/10',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  options,
  className,
  ...props
}, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-white/70">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          'nexus-field-accent w-full bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white/90',
          'focus:outline-none transition-all duration-300 h-[var(--field-height)] px-4 cursor-pointer',
          error && 'border-red-500/40 focus:border-red-500/40 focus:ring-red-500/10',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-bg-tertiary">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';

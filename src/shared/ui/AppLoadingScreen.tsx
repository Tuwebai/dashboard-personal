import { motion } from 'framer-motion';
import { cn } from '../lib/cn';
import { BrandMark } from './BrandLogo';

interface AppLoadingScreenProps {
  fullscreen?: boolean;
}

export function AppLoadingScreen({ fullscreen = true }: AppLoadingScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'relative isolate flex flex-col overflow-hidden bg-[#08080c] text-white',
        fullscreen ? 'min-h-screen' : 'h-full min-h-[calc(100vh-160px)] rounded-3xl border border-white/5',
      )}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at center, rgb(var(--color-accent-rgb) / 0.18), transparent 38%)' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at bottom, color-mix(in srgb, var(--color-brand-secondary) 36%, transparent), transparent 28%)' }}
      />

      <div className="relative flex flex-1 items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0.72, scale: 0.94 }}
          animate={{ opacity: [0.72, 1, 0.72], scale: [0.94, 1, 0.94] }}
          transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/6 bg-white/[0.02]"
          style={{ boxShadow: '0 0 80px rgb(var(--color-accent-rgb) / 0.24)' }}
        >
          <BrandMark className="h-16 w-16" />
        </motion.div>
      </div>

      <div className="relative pb-10 text-center">
        <p className="text-[0.62rem] font-medium uppercase tracking-[0.38em] text-white/30">from</p>
        <p
          className="mt-2 bg-clip-text text-sm font-semibold tracking-[0.22em] text-transparent"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--brand-primary-start), var(--brand-primary-end))' }}
        >
          JuanchiiTsx
        </p>
      </div>

      <span className="sr-only">Cargando aplicación</span>
    </div>
  );
}

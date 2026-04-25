import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../lib/cn';
import { useI18n } from '../i18n/useI18n';
import { useModalEscape } from '../hooks/useModalEscape';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, size = 'md', className }: ModalProps) {
  const { t } = useI18n();
  const overlayRef = useRef<HTMLDivElement>(null);
  useModalEscape(isOpen, onClose);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-4xl',
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-1000 overflow-y-auto">
          {/* Overlay */}
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Centering Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              className={cn(
                'relative w-full bg-bg-card border border-border rounded-xl shadow-2xl overflow-hidden',

                sizeClasses[size],
                className
              )}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {title && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-all duration-200"
                    aria-label={t('common.close')}
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
              {!title && (
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-all duration-200 z-20"
                  aria-label={t('common.close')}
                >
                  <X size={20} />
                </button>
              )}
              <div className="px-6 py-5">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
}

export function SlideOver({ isOpen, onClose, title, children, width = 'w-96' }: SlideOverProps) {
  useModalEscape(isOpen, onClose);

  const slideOverContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-1000 flex justify-end">
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={cn(
              'relative bg-bg-card border-l border-border h-full flex flex-col overflow-hidden shadow-2xl',
              width
            )}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              {title && <h2 className="text-base font-semibold text-white">{title}</h2>}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/8 text-white/50 hover:text-white transition-all ml-auto"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(slideOverContent, document.body);
}

import React, { useEffect } from 'react';
import clsx from 'clsx';
import { XMarkIcon } from '@heroicons/react/24/outline';

const sizes = {
  xs: 'sm:max-w-xs',
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
};

export function Dialog({ size = 'lg', className, children, open, onClose, showCloseButton = true, ...props }) {
  // Manejar el scroll del body
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && open) {
        onClose(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0" style={{ zIndex: 9980 }}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-zinc-950/25 transition-opacity duration-200"
        onClick={() => onClose(false)}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div 
        className="fixed inset-0 overflow-y-auto" 
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex min-h-full items-end justify-center p-0 text-center sm:items-center sm:p-4">
          <div
            className={clsx(
              className,
              sizes[size],
              // Móviles: modal desde abajo
              'relative w-full max-h-[95vh] bg-white shadow-xl ring-1 ring-zinc-950/10',
              // Bordes redondeados
              'rounded-t-3xl sm:rounded-2xl',
              // Desktop: tamaño máximo
              'sm:max-h-[90vh] sm:w-full sm:max-w-lg',
              // Layout flex para scroll interno
              'flex flex-col overflow-hidden',
              // Transición
              'transform transition-all duration-200 ease-out'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cerrar - visible en móviles, opcional en desktop */}
            {showCloseButton && (
              <button
                onClick={() => onClose(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white/90 transition-all duration-200 sm:bg-transparent sm:shadow-none sm:hover:bg-gray-100"
                aria-label="Cerrar modal"
              >
                <XMarkIcon className="h-5 w-5 text-gray-600 hover:text-gray-800" />
              </button>
            )}

            {/* Contenido con scroll */}
            <div 
              className="flex-1 overflow-y-auto" 
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DialogTitle({ className, children, ...props }) {
  return (
    <h2
      {...props}
      className={clsx(
        className, 
        'text-lg/6 font-semibold text-balance text-zinc-950 sm:text-base/6'
      )}
    >
      {children}
    </h2>
  );
}

export function DialogDescription({ className, children, ...props }) {
  return (
    <p 
      {...props} 
      className={clsx(className, 'mt-2 text-pretty text-sm text-zinc-600')}
    >
      {children}
    </p>
  );
}

export function DialogBody({ className, children, ...props }) {
  return (
    <div {...props} className={clsx(className, 'mt-6')}>
      {children}
    </div>
  );
}

export function DialogActions({ className, children, ...props }) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'mt-8 flex flex-col-reverse items-center justify-end gap-3 *:w-full sm:flex-row sm:*:w-auto'
      )}
    >
      {children}
    </div>
  );
}
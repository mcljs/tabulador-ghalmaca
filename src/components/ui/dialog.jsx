import * as Headless from '@headlessui/react'
import clsx from 'clsx'

import { Text } from './text'

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
}

export function Dialog({ size = 'lg', className, children, ...props }) {
  return (
    <Headless.Dialog {...props}>
      <Headless.DialogBackdrop
        transition
        className="fixed inset-0 bg-zinc-950/25 transition duration-100 focus:outline-0 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in z-40"
      />

      <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="flex min-h-full items-end justify-center p-0 text-center sm:items-center sm:p-4">
          <Headless.DialogPanel
            transition
            className={clsx(
              className,
              sizes[size],
              // Móviles: modal desde abajo, altura automática con max-height
              'w-full max-h-[100vh] bg-white shadow-lg ring-1 ring-zinc-950/10',
              // Bordes redondeados solo arriba en móvil, completos en desktop
              'rounded-t-3xl sm:rounded-2xl',
              // Desktop: centrado con altura máxima
              'sm:max-h-[90vh] sm:w-full sm:max-w-lg',
              // Animaciones
              'transform transition-all duration-200 ease-out',
              'data-closed:translate-y-full data-closed:opacity-0',
              'sm:data-closed:translate-y-0 sm:data-closed:scale-95'
            )}
          >
            {children}
          </Headless.DialogPanel>
        </div>
      </div>
    </Headless.Dialog>
  )
}

export function DialogTitle({ className, ...props }) {
  return (
    <Headless.DialogTitle
      {...props}
      className={clsx(className, 'text-lg/6 font-semibold text-balance text-zinc-950 sm:text-base/6')}
    />
  )
}

export function DialogDescription({ className, ...props }) {
  return <Headless.Description as={Text} {...props} className={clsx(className, 'mt-2 text-pretty')} />
}

export function DialogBody({ className, ...props }) {
  return <div {...props} className={clsx(className, 'mt-6')} />
}

export function DialogActions({ className, ...props }) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'mt-8 flex flex-col-reverse items-center justify-end gap-3 *:w-full sm:flex-row sm:*:w-auto'
      )}
    />
  )
}
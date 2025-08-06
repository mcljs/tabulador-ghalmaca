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

      <div className="fixed inset-0 z-50">
        <div className="flex min-h-full items-center justify-center p-0 sm:p-4">
          <Headless.DialogPanel
            transition
            className={clsx(
              className,
              sizes[size],
              // Móviles: pantalla completa con scroll interno
              'h-full w-full bg-white shadow-lg ring-1 ring-zinc-950/10',
              // Desktop: modal centrado con tamaño limitado
              'sm:h-auto sm:max-h-[90vh] sm:rounded-2xl sm:shadow-xl',
              // Animaciones
              'transition duration-200 will-change-transform',
              'data-closed:translate-y-full data-closed:opacity-0 data-enter:ease-out data-leave:ease-in',
              'sm:data-closed:translate-y-0 sm:data-closed:scale-95',
              // Overflow handling
              'overflow-hidden flex flex-col'
            )}
          >
            {/* Contenedor con scroll interno */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>
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
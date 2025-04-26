import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Define explicit z-index values for consistent stacking
// Toast should have z-index higher than 10008 to appear above
const BASE_Z_INDEX = 9000;
const BACKDROP_Z_INDEX = 9001;
const DIALOG_Z_INDEX = 9002;
const PANEL_Z_INDEX = 9003;
const CLOSE_BUTTON_Z_INDEX = 9004;
const CONTENT_Z_INDEX = 9005;

const sizes = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
};

function Modal({
  open,
  setOpen,
  allowClickToClose = true,
  children,
  size = 'lg',
  className,
  title,
  description,
  ...props
}) {
  const onClose = allowClickToClose ? () => setOpen(false) : () => {};

  return (
    <Transition.Root show={open} as={Fragment} {...props}>
      <Dialog 
        as="div" 
        className="fixed inset-0" 
        style={{ zIndex: BASE_Z_INDEX }}
        onClose={onClose}
      >
        {/* Backdrop with blur effect */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div 
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm transition-opacity" 
            style={{ zIndex: BACKDROP_Z_INDEX }}
          />
        </Transition.Child>

        <div 
          className="fixed inset-0 w-screen overflow-y-auto pt-6 sm:pt-0"
          style={{ zIndex: DIALOG_Z_INDEX }}
        >
          <div className="grid min-h-full grid-rows-[1fr_auto] justify-items-center sm:grid-rows-[1fr_auto_3fr] sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-12 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-12 sm:translate-y-0"
            >
              <Dialog.Panel
                className={clsx(
                  className,
                  sizes[size],
                  'row-start-2 w-full min-w-0 rounded-t-3xl p-8 shadow-lg sm:mb-auto sm:rounded-2xl bg-white border border-slate-200'
                )}
                style={{ zIndex: PANEL_Z_INDEX }}
              >
                {/* Close button */}
                <button
                  onClick={() => setOpen(false)}
                  className="absolute right-4 top-4 text-slate-900 hover:text-slate-800 transition-colors bg-white p-2 rounded-full"
                  type="button"
                  style={{ zIndex: CLOSE_BUTTON_Z_INDEX }}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                {/* Modal content */}
                <div style={{ zIndex: CONTENT_Z_INDEX, position: 'relative' }}>
                  {(title || description) ? (
                    <>
                      {title && (
                        <Dialog.Title className="text-balance text-lg/6 font-semibold sm:text-base/6 text-slate-900">
                          {title}
                        </Dialog.Title>
                      )}
                      
                      {description && (
                        <Dialog.Description className="mt-2 text-pretty text-slate-700">
                          {description}
                        </Dialog.Description>
                      )}
                      
                      <div className="mt-6">
                        {children}
                      </div>
                    </>
                  ) : (
                    children
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

// Additional components for easy composition
export function ModalBody({ className, ...props }) {
  return <div {...props} className={clsx(className, 'mt-6')} />;
}

export function ModalActions({ className, ...props }) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'mt-8 flex flex-col-reverse items-center justify-end gap-3 *:w-full sm:flex-row sm:*:w-auto'
      )}
    />
  );
}

export default Modal;
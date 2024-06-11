import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { XMarkIcon } from '@heroicons/react/24/outline';

function Modal({
  open,
  setOpen,
  background = true,
  allowClickToClose = false,
  children,
  size = 'md',
  flat,
  closeButton,
  className,
}) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={allowClickToClose ? setOpen : () => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900 bg-opacity-90 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          {closeButton && (
            <button
              onClick={() => setOpen(false)}
              className="fixed left-2 top-2 z-50 md:left-4 md:top-4 bg-white"
            >
              <XMarkIcon />
            </button>
          )}
                   
          <div className="flex min-h-full items-center justify-center text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={clsx(
                  'align-center inline-block transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:align-middle',
                  {
                    'mt-12': closeButton,
                    'm-8 p-10': !flat,
                    'bg-slate-50': background === true,
                    'max-w-md md:w-full md:max-w-sm': size === 'sm',
                    'max-w-md md:w-full md:max-w-md': size === 'md',
                    'max-w-md md:w-full md:max-w-lg': size === 'lg',
                    'max-w-md md:w-full md:max-w-xl': size === 'xl',
                    'max-w-md md:w-full md:max-w-2xl': size === '2xl',
                    'max-w-md md:w-full md:max-w-3xl': size === '3xl',
                  },
                  className,
                )}
              >
                      <button
              onClick={() => setOpen(false)}
              className="absolute left-2 top-2 z-50 md:left-4 md:top-4"
              type="button"
            >
              <XMarkIcon className="h-6 w-6 text-black" />
            </button>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default Modal;

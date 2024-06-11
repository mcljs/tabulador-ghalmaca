import { InformationCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import React from 'react';

function Tooltip({ children, tooltipText, position = 'top', info, className }) {
  return (
    <div className={clsx('flex', className)}>
      <div className="group/tooltip relative">
        {info ? (
          <InformationCircleIcon className="w-5 h-5" />
        ) : (
          <div>{children}</div>
        )}
        {(tooltipText || info) && (
          <div
            className={clsx(
              'absolute opacity-0 bg-black w-32 right-[50%] translate-x-[50%] text-white text-center text-xs rounded-lg py-2 z-10 group-hover/tooltip:opacity-100 px-3 pointer-events-none transition-all duration-500',
              {
                'bottom-[calc(100%+5px)]': position === 'top',
                'top-[calc(100%+5px)]': position === 'bottom',
                'left-[calc(100%+5px)]': position === 'right',
                'right-[calc(100%+5px)]': position === 'left',
              },
            )}
          >
            {tooltipText}
            <svg
              className={clsx('absolute text-black h-2 w-full left-0', {
                'top-full': position === 'top',
                'bottom-full rotate-180': position === 'bottom',
              })}
              x="0px"
              y="0px"
              viewBox="0 0 255 255"
              xmlSpace="preserve"
            >
              <polygon
                className="fill-current"
                points="0,0 127.5,127.5 255,0"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tooltip;

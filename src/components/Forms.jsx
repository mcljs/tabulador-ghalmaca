import clsx from 'clsx';
import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import Tooltip from './Tooltip';


const Input = React.forwardRef(function Input(
  {
    className,
    label,
    placeholder,
    helpText,
    helpTextTop,
    size = 'sm',
    error,
    errorMessage,
    iconLeft,
    iconRight,
    type = 'text',
    min,
    max,
    value,
    onWheel,
    onChange,
    disabled,
    width = 'w-full',
    tooltipText,
  },
  ref,
) {
  return (
    <div className={clsx(width)}>
      <div className={clsx(width)}>
        {label && (
          <label
            htmlFor={label}
            className="text-sm font-medium text-gray-700 mb-1 flex"
          >
            <span>{label}</span>
            {tooltipText && <Tooltip info tooltipText={tooltipText} />}
          </label>
        )}
        {helpTextTop && (
          <p className="mt-1 text-sm leading-tight text-gray-500">
            {helpTextTop}
          </p>
        )}
        <div className="relative">
          {iconLeft && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {iconLeft}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            name={label}
            id={label}
            min={min}
            max={max}
            value={value}
            onWheel={onWheel}
            onChange={onChange}
            disabled={disabled}
            className={clsx(
              className,
              'rounded-md shadow-sm placeholder:text-black disabled:cursor-not-allowed disabled:border-yellow-700 disabled:bg-slate-900 disabled:text-gray-700 focus:z-[10] bg-white text-black border-red-600  focus:border-slate-900 focus:ring-slate-90',
              width,
              error
                ? 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500'
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
              { 'pl-10': iconLeft },
              { 'pr-10': iconRight },
              {
                'text-sm py-2': size === 'sm',
                'sm:text-md py-3': size === 'lg',
              },
            )}
            placeholder={placeholder}
          />
          {error && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
          )}
          {iconRight && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              {iconRight}
            </div>
          )}
        </div>
      </div>
      {error && (
        <div>
          <p className="mt-2 text-sm text-red-600" id={`${label}-error`}>
            {errorMessage}
          </p>
        </div>
      )}
      {helpText && (
        <p className="mt-2 text-sm text-gray-500" id="email-description">
          {helpText}
        </p>
      )}
    </div>
  );
});

/* TODO: Finish the FieldSet component with :first and :last conditions for inputs */
export function FieldSet() {
  return (
    <div>
      <div>This</div>
      <div>This</div>
    </div>
  );
}

export default Input;

export function Checkbox({ label, onChange, value, tooltipText, className }) {
  return (
    <div className="relative flex items-start mt-3">
      <div className="flex items-center h-5 mt-2">
        <input
          id={label}
          value={value}
          name={label}
          type="checkbox"
          className={clsx(
            className,
            'focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded',
          )}
          onChange={onChange}
        />
      </div>
      <div className="ml-3 text-sm">
        <label
          htmlFor={label}
          className="font-medium text-sm leading-5 text-gray-700"
        >
          <span>{label}</span>
          {tooltipText && <Tooltip info tooltipText={tooltipText} />}
        </label>
      </div>
    </div>
  );
}

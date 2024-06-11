import React from 'react';

function LoadingSpinner({ children, className }) {
  return (
    <div
      className={`flex  flex-col items-center justify-center inset-0 ${className} bg-slate-900 z-40 opacity-90 fixed`}
      style={{ zIndex: 9999999 }}
    >
      <div>
        <svg
          className="animate-spin mx-auto h-6 w-6 text-slate-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx={12}
            cy={12}
            r={10}
            stroke="currentColor"
            strokeWidth={4}
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>

      <div>
        <h2 className="text-light text-slate-300 text-center z-50">
          {children}
        </h2>{' '}
      </div>
    </div>
  );
}

export default LoadingSpinner;
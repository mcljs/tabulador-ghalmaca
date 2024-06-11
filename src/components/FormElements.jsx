import * as React from 'react';
import clsx from 'clsx';


function Label({ className, ...labelProps }) {
  return (
    <label
      {...labelProps}
      className={clsx('block text-sm font-medium text-slate-900', className)}
    />
  );
}

const Input = React.forwardRef(function Input(props, ref) {
  const className = clsx(
    'shadow-sm  block w-full sm:text-sm border-gray-300 rounded-md mt-2 ',
    props.className,
  );

  if (props.type === 'textarea') {
    return (
      <textarea
        {...props}
        className={clsx('h-auto max-h-[700px] min-h-[150px]', className)}
      />
    );
  }

  return <input {...props} className={className} ref={ref} />;
});

export function FieldContainer({
  error,
  label,
  className,
  description,
  id,
  children,
}) {
  const defaultId = React.useId();
  const inputId = id ?? defaultId;
  const errorId = `${inputId}-error`;
  const descriptionId = `${inputId}-description`;

  return (
    <div className={clsx('relative items-center', className)}>
      <div className="mb-4  flex items-baseline justify-between gap-2">
        <Label htmlFor={inputId}>{label}</Label>
        {error ? (
          <InputError id={errorId}>{error}</InputError>
        ) : description ? (
          <div id={descriptionId} className="text-primary text-lg">
            {description}
          </div>
        ) : null}
      </div>

      {children({
        inputProps: {
          id: inputId,
          'aria-describedby': error
            ? errorId
            : description
            ? descriptionId
            : undefined,
        },
      })}
    </div>
  );
}

function InputError({ children, id }) {
  if (!children) {
    return null;
  }

  return (
    <p role="alert" id={id} className="mt-2 text-sm text-red-600">
      {children}
    </p>
  );
}

const Field = React.forwardRef(function Field(
  { defaultValue, error, name, label, className, description, id, ...props },
  ref,
) {
  return (
    <FieldContainer
      id={id}
      label={label}
      className={className}
      error={error}
      description={description}
    >
      {({ inputProps }) => (
        <Input  
          ref={ref}
          required
          {...props}
          {...inputProps}
          name={name}
          autoComplete={name}
          defaultValue={defaultValue}
          className="py-3"
        />
      )}
    </FieldContainer>
  );
});

function ButtonGroup({ children }) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
      {children}
    </div>
  );
}

function ErrorPanel({ children, id }) {
  return (
    <div role="alert" className="relative mt-8 px-11 py-8" id={id}>
      <div className="absolute inset-0 rounded-lg bg-red-500 opacity-25" />
      <div className="relative text-lg font-medium text-primary-500">
        {children}
      </div>
    </div>
  );
}

export { Label, Input, InputError, Field, ButtonGroup, ErrorPanel };
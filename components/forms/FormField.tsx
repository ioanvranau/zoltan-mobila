export const inputClass =
  "w-full border border-line bg-bg-elevated px-4 py-3 text-text placeholder:text-text-dim rounded-md transition-colors duration-200 focus:border-brass focus:outline-none min-h-11";

export function FormField({
  id,
  label,
  required,
  error,
  helper,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text mb-2">
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-error">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-1.5 text-sm text-error">
          {error}
        </p>
      ) : helper ? (
        <p className="mt-1.5 text-sm text-text-dim">{helper}</p>
      ) : null}
    </div>
  );
}

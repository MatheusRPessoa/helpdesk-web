import { forwardRef, useId, type ComponentProps, type ReactNode } from "react";

interface InputProps extends ComponentProps<"input"> {
  label: string;
  error?: string;
  hint?: string;
  leading?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leading, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className="text-xxs font-bold uppercase tracking-wider text-gray-500"
        >
          {label}
        </label>

        <div className="flex items-center gap-2 border-b border-gray-400 transition focus-within:border-blue-base">
          {leading && <span className="text-sm text-gray-600">{leading}</span>}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={error ? true : undefined}
            className="w-full py-2 text-sm text-gray-600 outline-none placeholder:text-gray-400"
            {...props}
          />
        </div>

        {error ? (
          <span className="text-xxs text-red-600">{error}</span>
        ) : hint ? (
          <span className="text-xxs italic text-gray-400">{hint}</span>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";

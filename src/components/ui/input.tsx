import { forwardRef } from "react"
import type { ComponentProps } from "react"

interface InputProps extends ComponentProps<"input"> {
  label: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xxs font-bold uppercase tracking-wider text-gray-500">
          {label}
        </label>
        <input
          ref={ref}
          className="border-b border-gray-400 py-2 text-sm text-gray-600 outline-none transition placeholder:text-gray-400 focus:border-blue-base"
          {...props}
        />
        {error ? (
          <span className="text-xxs text-red-600">{error}</span>
        ) : hint ? (
          <span className="text-xxs italic text-gray-400">{hint}</span>
        ) : null}
      </div>
    )
  },
)

Input.displayName = "Input"
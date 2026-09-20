import type { ComponentProps } from "react";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary";
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const styles = {
    primary: "bg-gray-600 text-gray-100 hover:opacity-90",
    secondary: "bg-gray-300 text-gray-600 hover:opacity-90",
  };

  return (
    <button
      className={`h-11 w-full rounded-lg text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}

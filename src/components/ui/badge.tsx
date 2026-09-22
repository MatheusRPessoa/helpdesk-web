import type { ReactNode } from "react";

const variants = {
  success: "bg-green-50 text-green-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-blue-light text-blue-base",
  neutral: "bg-gray-200 text-gray-500",
};

export type BadgeVariant = keyof typeof variants;

interface BadgeProps {
  variant: BadgeVariant;
  icon?: ReactNode;
  children: ReactNode;
}

export function Badge({ variant, icon, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xxs font-bold ${variants[variant]}`}
    >
      {icon}
      {children}
    </span>
  );
}

import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

import logoIcon from "@/assets/logo-icon.svg";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/types";

const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: "ADMIN",
  TECHNICIAN: "TÉCNICO",
  CUSTOMER: "CLIENTE",
};

export interface SidebarLink {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  links: SidebarLink[];
}

export function Sidebar({ links }: SidebarProps) {
  const { user, signOut } = useAuth();

  const initials = user?.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <aside className="flex h-screen w-50 flex-col justify-between bg-blue-dark py-5">
      <div>
        <div className="mb-6 flex items-center gap-3 border-b border-gray-600/20 px-6 pb-6 pt-2">
          <img src={logoIcon} alt="" className="h-11 w-11" />
          <div className="flex flex-col">
            <span className="text-md font-bold leading-none text-gray-100">
              HelpDesk
            </span>
            <span className="text-xxs tracking-[0.2em] text-blue-light">
              {user && ROLE_LABEL[user.role]}
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-4">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-blue-base font-bold text-gray-100"
                    : "text-gray-400 hover:bg-white/5"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        onClick={signOut}
        className="flex items-center gap-3 border-t border-gray-600/20 px-6 pb-2 pt-5 text-left transition hover:bg-white/5"
      >
        {user?.avatarUrl ? (
          <img
            src={`${import.meta.env.VITE_API_URL}/files/${user.avatarUrl}`}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-base text-xxs font-bold text-gray-100">
            {initials}
          </span>
        )}
        <span className="flex flex-col overflow-hidden">
          <span className="truncate text-xs font-bold text-gray-100">
            {user?.name}
          </span>
          <span className="truncate text-xxs text-gray-400">{user?.email}</span>
        </span>
      </button>
    </aside>
  );
}

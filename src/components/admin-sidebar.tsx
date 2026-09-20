import { NavLink } from "react-router-dom";
import { ClipboardList, Wrench, Users, Briefcase } from "lucide-react";

import logoIcon from "@/assets/logo-icon.svg";
import { useAuth } from "@/hooks/use-auth";

const links = [
  { to: "/admin/tickets", label: "Chamados", icon: ClipboardList },
  { to: "/admin/technicians", label: "Técnicos", icon: Wrench },
  { to: "/admin/customers", label: "Clientes", icon: Users },
  { to: "/admin/services", label: "Serviços", icon: Briefcase },
];

export function AdminSidebar() {
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
        <div className="mb-6 flex items-center gap-3 border-b border-gray-500/20 px-6 pb-6 pt-2">
          <img src={logoIcon} alt="" className="h-11 w-11" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-100">HelpDesk</span>
            <span className="text-xxs tracking-widest text-blue-light">
              ADMIN
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-blue-base text-gray-100"
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
        className="flex items-center gap-3 border-t border-gray-500/20 px-5 pb-1 pt-5 text-left transition hover:bg-white/5"
      >
        {user?.avatarUrl ? (
          <img
            src={`${import.meta.env.VITE_API_URL}/files/${user?.avatarUrl}`}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-base text-xxs font-bold text-gray-100">
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

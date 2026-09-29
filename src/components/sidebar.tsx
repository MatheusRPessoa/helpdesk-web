import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { UserRound, LogOut } from "lucide-react";
import { ProfileModal } from "@/components/profile-modal";

import logoIcon from "@/assets/logo-icon.svg";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/types";
import { api } from "@/services/api";

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

interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  mustChangePassword: boolean;
  availabilities: {
    hour: string;
  }[];
}

export function Sidebar({ links }: SidebarProps) {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
  if (!user) {
    setProfile(null);
    return;
  }

  const fetchProfile = async () => {
    try {
      const response = await api.get<ProfileResponse>("/users/me");
      setProfile(response.data);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      setProfile(null);
    }
  };

  fetchProfile();
}, [user?.id]);

  const initials = profile?.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

    const fetchProfile = async () => {
  if (!user) {
    setProfile(null);
    return;
  }

  try {
    const response = await api.get<ProfileResponse>("/users/me");
    setProfile(response.data);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    setProfile(null);
  }
};

useEffect(() => {
  fetchProfile();
}, [user?.id]);

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

      <div className="relative border-t border-gray-600/20 px-3 pb-2 pt-4">
        <button
          type="button"
          onClick={() => setIsUserMenuOpen((prev) => !prev)}
          aria-expanded={isUserMenuOpen}
          aria-haspopup="menu"
          aria-label="Abrir opções do usuário"
          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition hover:bg-white/5"
        >
          {profile?.avatarUrl ? (
            <img
              src={`${import.meta.env.VITE_API_URL}/files/${profile.avatarUrl}`}
              alt=""
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-base text-xxs font-bold text-gray-100">
              {initials}
            </span>
          )}

          <span className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <span className="truncate text-xs font-bold text-gray-100">
              {profile?.name}
            </span>
            <span className="truncate text-xxs text-gray-400">
              {profile?.email}
            </span>
          </span>
        </button>

        {isUserMenuOpen && (
          <>
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={() => setIsUserMenuOpen(false)}
              className="fixed inset-0 z-40 cursor-default bg-black/50"
            />

            <div
              role="menu"
              className="absolute bottom-0 left-[calc(100%+8px)] z-50 w-44 overflow-hidden rounded-lg border border-gray-600/20 bg-blue-dark p-1.5 shadow-xl"
            >
              <p className="px-2.5 pb-2 pt-2 text-[9px] font-medium tracking-wider text-gray-500">
                OPÇÕES
              </p>

              <button
                type="button"
                role="menuitem"
                onClick={() => setIsProfileModalOpen(true)}
                className="flex w-full items-center gap-3 rounded-md px-2.5 py-2.5 text-left text-xs text-gray-300 transition hover:bg-white/5 hover:text-gray-100"
              >
                <UserRound size={16} className="shrink-0 text-gray-400" />
                Perfil
              </button>

              <div className="my-1 border-t border-gray-600/20" />

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  signOut();
                }}
                className="flex w-full items-center gap-3 rounded-md px-2.5 py-2.5 text-left text-xs text-red-500 transition hover:bg-red-500/10"
              >
                <LogOut size={16} className="shrink-0" />
                Sair
              </button>
            </div>
          </>
        )}

        {isProfileModalOpen && (
          <ProfileModal
            onClose={() => setIsProfileModalOpen(false)}
            onProfileUpdated={fetchProfile}
          />
        )}
      </div>
    </aside>
  );
}

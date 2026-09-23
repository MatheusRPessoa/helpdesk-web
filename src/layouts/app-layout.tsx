import { Outlet } from "react-router-dom";

import { Sidebar, type SidebarLink } from "@/components/ui/sidebar";

interface AppLayoutProps {
  role: string;
  links: SidebarLink[];
}

export function AppLayout({ role, links }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-blue-dark">
      <div className="hidden lg:block">
        <Sidebar role={role} links={links} />
      </div>

      <main className="flex-1 overflow-auto rounded-tl-[10px] bg-gray-200 px-10 py-12 lg:mt-3">
        <Outlet />
      </main>
    </div>
  );
}

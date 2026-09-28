import { Outlet } from "react-router-dom";

import { Sidebar, type SidebarLink } from "@/components/sidebar";

interface AppLayoutProps {
  links: SidebarLink[];
}

export function AppLayout({ links }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-blue-dark">
      <div className="hidden lg:block">
        <Sidebar links={links} />
      </div>

      <main className="flex-1 overflow-y-auto rounded-tl-[10px] bg-gray-200 px-10 py-12 lg:mt-3">
        <Outlet />
      </main>
    </div>
  );
}

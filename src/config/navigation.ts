import { ClipboardList, Wrench, Users, Briefcase, Plus } from "lucide-react";

import type { SidebarLink } from "@/components/sidebar";

export const ADMIN_LINKS: SidebarLink[] = [
  { to: "/admin/tickets", label: "Chamados", icon: ClipboardList },
  { to: "/admin/technicians", label: "Técnicos", icon: Wrench },
  { to: "/admin/customers", label: "Clientes", icon: Users },
  { to: "/admin/services", label: "Serviços", icon: Briefcase },
];

export const TECHNICIAN_LINKS: SidebarLink[] = [
  { to: "/technician/tickets", label: "Meus chamados", icon: ClipboardList },
];

export const CUSTOMER_LINKS: SidebarLink[] = [
  { to: "/customers/tickets", label: "Meus chamados", icon: ClipboardList },
  { to: "/customers/tickets/new", label: "Criar chamado", icon: Plus },
];

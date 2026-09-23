import { createBrowserRouter } from "react-router-dom";

import { AuthLayout } from "@/layouts/auth-layout";
import { SignIn } from "@/pages/sign-in";
import { ProtectedRoute } from "./protected-route";
import { SignUp } from "@/pages/sign-up";
import { AdminTickets } from "@/pages/admin/tickets";
import { AdminTicketDetail } from "@/pages/admin/ticket-detail";
import { AdminTechnicians } from "@/pages/admin/technicians";
import { AdminTechnicianForm } from "@/pages/admin/technician-form";
import { AdminCustomers } from "@/pages/admin/customers";
import { AdminServices } from "@/pages/admin/services";
import { AppLayout } from "@/layouts/app-layout";
import { ADMIN_LINKS, TECHNICIAN_LINKS } from "@/config/navigation";
import { TechnicianTickets } from "@/pages/technician/tickets";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <SignIn /> },
      { path: "sign-up", element: <SignUp /> },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        element: <AppLayout role="ADMIN" links={ADMIN_LINKS} />,
        children: [
          { path: "/admin/tickets", element: <AdminTickets /> },
          { path: "/admin/tickets/:id", element: <AdminTicketDetail /> },
          { path: "/admin/technicians", element: <AdminTechnicians /> },
          { path: "/admin/technicians/new", element: <AdminTechnicianForm /> },
          { path: "/admin/technicians/:id", element: <AdminTechnicianForm /> },
          { path: "/admin/customers", element: <AdminCustomers /> },
          { path: "/admin/services", element: <AdminServices /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["TECHNICIAN"]} />,
    children: [
      {
        element: <AppLayout role="TÉCNICO" links={TECHNICIAN_LINKS} />,
        children: [
          { path: "/technician/tickets", element: <TechnicianTickets /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["CUSTOMER"]} />,
    children: [
      {
        path: "/tickets",
        element: <div>Painel do Cliente</div>,
      },
    ],
  },
]);

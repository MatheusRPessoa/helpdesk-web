import { createBrowserRouter } from "react-router-dom";

<<<<<<< Updated upstream
import { AuthLayout } from "@/layouts/auth-layout";
import { SignIn } from "@/pages/sign-in";
import { ProtectedRoute } from "./protected-route";
import { SignUp } from "@/pages/sign-up";
import { AdminLayout } from "@/layouts/admin-layout";
import { AdminTickets } from "@/pages/admin/tickets";
import { AdminTicketDetail } from "@/pages/admin/ticket-detail";
import { AdminTechnicians } from "@/pages/admin/technicians";
import { AdminTechnicianForm } from "@/pages/admin/technician-form";
=======
import { AuthLayout } from "@/layouts/auth-layout"
import { SignIn } from "@/pages/sign-in"
import { ProtectedRoute } from "./protected-route"
import { SignUp } from "@/pages/sign-up"
import { AdminLayout } from "@/layouts/admin-layout"
import { AdminTickets } from "@/pages/admin/tickets"
import { AdminTicketDetail } from "@/pages/admin/ticket-detail"
import { AdminTechnicians } from "@/pages/admin/technicians"
import { AdminCustomer } from "@/pages/admin/customer"
>>>>>>> Stashed changes

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
        element: <AdminLayout />,
        children: [
          { path: "/admin/tickets", element: <AdminTickets /> },
          { path: "/admin/tickets/:id", element: <AdminTicketDetail /> },
          { path: "/admin/technicians", element: <AdminTechnicians /> },
<<<<<<< Updated upstream
          { path: "/admin/technicians", element: <AdminTechnicians /> },
          { path: "/admin/technicians/new", element: <AdminTechnicianForm /> },
          { path: "/admin/technicians/:id", element: <AdminTechnicianForm /> },
        ],
=======
          { path: "/admin/customers", element: <AdminCustomer /> },
        ]
>>>>>>> Stashed changes
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["TECHNICIAN"]} />,
    children: [
      {
        path: "/technician/tickets",
        element: <div>Painel do Técnico</div>,
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

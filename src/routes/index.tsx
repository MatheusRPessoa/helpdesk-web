import { createBrowserRouter } from "react-router-dom"

import { AuthLayout } from "@/layouts/auth-layout"
import { SignIn } from "@/pages/sign-in"
import { ProtectedRoute } from "./protected-route"
import { SignUp } from "@/pages/sign-up"
import { AdminLayout } from "@/layouts/admin-layout"
import { AdminTickets } from "@/pages/admin/tickets"
import { AdminTicketDetail } from "@/pages/admin/ticket-detail"
import { AdminTechnicians } from "@/pages/admin/technicians"
import { AdminCustomer } from "@/pages/admin/customer"

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
          { path: "/admin/customers", element: <AdminCustomer /> },
        ]
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["TECHNICIAN"]} />,
    children: [
      {
        path: "/technician/tickets",
        element: <div>Painel do Técnico</div>
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["CUSTOMER"]} />,
    children: [
      {
        path: "/tickets",
        element: <div>Painel do Cliente</div>
      },
    ],
  },
])

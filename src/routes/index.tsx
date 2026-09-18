import { createBrowserRouter } from "react-router-dom"

import { AuthLayout } from "@/layouts/auth-layout"
import { SignIn } from "@/pages/sign-in"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "/", element: <SignIn /> },
    ],
  },
])
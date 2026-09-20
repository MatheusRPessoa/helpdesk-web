import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import "./index.css";

import { router } from "@/routes";
import { AuthProvider } from "@/contexts/auth-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);

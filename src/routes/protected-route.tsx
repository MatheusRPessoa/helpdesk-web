import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/contexts/auth-context";
import type { UserRole } from "@/types";

interface ProtectedRouteProps {
    allowedRoles: UserRole[]
}

export function ProtectedRoute({ allowedRoles } : ProtectedRouteProps) {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return null
    }

    if (!user) {
        return <Navigate to="/" replace /> 
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace /> 
    }

    return <Outlet />
}

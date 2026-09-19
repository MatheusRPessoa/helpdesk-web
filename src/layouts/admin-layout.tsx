import { Outlet } from "react-router-dom"
import { AdminSidebar } from "@/components/admin-sidebar"

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-blue-dark">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      <main className="flex-1 overflow-auto rounded-tl-[10px] bg-gray-200 px-10 py-12 lg:mt-3">
        <Outlet />
      </main>
    </div>
  )
}

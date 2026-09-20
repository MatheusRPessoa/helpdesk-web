import { Outlet } from "react-router-dom";
import background from "@/assets/login-background.png";

export function AuthLayout() {
  return (
    <div
      className="flex min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="hidden lg:block lg:w-1/2" />

      <main className="flex w-full items-center justify-center bg-blue-dark px-6 py-10 lg:mt-3 lg:w-1/2 lg:rounded-tl-[10px] lg:bg-gray-200">
        <Outlet />
      </main>
    </div>
  );
}

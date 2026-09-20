import { useState } from "react";
import type { ReactNode } from "react";

import { api } from "@/services/api";
import { AuthContext, TOKEN_KEY, USER_KEY } from "@/contexts/auth-context";
import type { SignInResponse, User } from "@/types";

function loadStoredUser(): User | null {
  const storedUser = localStorage.getItem(USER_KEY);
  const storedToken = localStorage.getItem(TOKEN_KEY);

  if (!storedUser || !storedToken) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadStoredUser);

  async function signIn(email: string, password: string) {
    const { data } = await api.post<SignInResponse>("/sessions", {
      email,
      password,
    });

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);

    return data.user;
  }

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  function updateUser(updated: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    setUser(updated);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

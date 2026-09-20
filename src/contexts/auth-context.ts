import { createContext } from "react";

import type { User } from "@/types";

export const TOKEN_KEY = "@helpdesk:token";
export const USER_KEY = "@helpdesk:user";

export interface AuthContextData {
  user: User | null;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => void;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext({} as AuthContextData);

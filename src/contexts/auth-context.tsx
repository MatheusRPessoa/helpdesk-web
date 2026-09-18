import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { api } from "@/services/api";
import type { SignInResponse, User } from "@/types";

const TOKEN_KEY = "@helpdesk:token"
const USER_KEY = "@helpdesk:user"

interface AuthContextData {
    user: User | null
    isLoading: boolean
    signIn: (email: string, password: string) => Promise<User>
    signOut: () => void
    updateUser: (user: User) => void
}

const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem(USER_KEY)
        const storedToken = localStorage.getItem(TOKEN_KEY)

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser))
        }

        setIsLoading(false)
    }, [])

    async function signIn(email: string, password: string) {
        const { data } = await api.post<SignInResponse>("/sessions", {
            email,
            password,
        })

        localStorage.setItem(TOKEN_KEY, data.token)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
        setUser(data.user)

        return data.user
    }

    function signOut() {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setUser(null)
    }

    function updateUser(updated: User) {
        localStorage.setItem(USER_KEY, JSON.stringify(updated))
        setUser(updated)
    }

    return (
        <AuthContext.Provider
            value={{ user, isLoading, signIn, signOut, updateUser }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}

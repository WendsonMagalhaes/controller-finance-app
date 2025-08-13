import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface User {
    id: number
    name: string
    email: string
}

interface UserContextType {
    user: User | null
    loginUser: (user: User) => void
    logoutUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const LOCAL_STORAGE_KEY = 'app_user'

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    // Carrega usuário do localStorage quando o componente monta
    useEffect(() => {
        const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch {
                localStorage.removeItem(LOCAL_STORAGE_KEY) // Se tiver algo inválido, limpa
            }
        }
    }, [])

    function loginUser(userData: User) {
        setUser(userData)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData))
    }

    function logoutUser() {
        setUser(null)
        localStorage.removeItem(LOCAL_STORAGE_KEY)
    }

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}

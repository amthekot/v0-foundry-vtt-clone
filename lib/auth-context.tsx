"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type StoredUser = {
  id: string
  username: string
  password: string
  role: "admin" | "player"
}

// Mock users database - now stored in localStorage
const DEFAULT_USERS: StoredUser[] = [
  { id: "1", username: "admin", password: "1111", role: "admin" },
  { id: "2", username: "player1", password: "foundry", role: "player" },
  { id: "3", username: "player2", password: "foundry", role: "player" },
]

type User = {
  id: string
  username: string
  role: "admin" | "player"
}

type AuthContextType = {
  user: User | null
  login: (username: string, password: string) => boolean
  register: (username: string, password: string) => { success: boolean; error?: string }
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<StoredUser[]>([])

  // Load users and current user from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem("foundry_users")
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    } else {
      localStorage.setItem("foundry_users", JSON.stringify(DEFAULT_USERS))
      setUsers(DEFAULT_USERS)
    }

    const savedUser = localStorage.getItem("foundry_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    const foundUser = users.find((u) => u.username === username && u.password === password)

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
      }
      setUser(userData)
      localStorage.setItem("foundry_user", JSON.stringify(userData))
      return true
    }

    return false
  }

  const register = (username: string, password: string): { success: boolean; error?: string } => {
    // Check if username already exists
    const existingUser = users.find((u) => u.username.toLowerCase() === username.toLowerCase())
    if (existingUser) {
      return { success: false, error: "Это имя пользователя уже занято" }
    }

    // Validate inputs
    if (username.length < 3) {
      return { success: false, error: "Имя пользователя должно содержать минимум 3 символа" }
    }

    if (password.length < 4) {
      return { success: false, error: "Пароль должен содержать минимум 4 символа" }
    }

    // Create new user
    const newUser: StoredUser = {
      id: Date.now().toString(),
      username,
      password,
      role: "player",
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    localStorage.setItem("foundry_users", JSON.stringify(updatedUsers))

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("foundry_user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

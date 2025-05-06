"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
  requireAuth: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Simular carga inicial de usuario desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Función de inicio de sesión
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulación de llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Usuario simulado
      const mockUser: User = {
        id: "1",
        name: "Usuario de Prueba",
        email: email,
        avatar: "/placeholder.svg?height=40&width=40",
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Error de inicio de sesión:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Función de registro
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulación de llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generar un ID único para el usuario
      const userId = Date.now().toString()

      // Usuario simulado
      const mockUser: User = {
        id: userId,
        name: name,
        email: email,
        avatar: "/placeholder.svg?height=40&width=40",
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Error de registro:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Función de cierre de sesión
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  // Función para verificar autenticación y redirigir si es necesario
  const requireAuth = () => {
    if (!user && !isLoading) {
      router.push("/login")
      return false
    }
    return true
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    requireAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

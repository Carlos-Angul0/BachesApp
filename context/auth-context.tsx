"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  phone?: string // Añadido campo de teléfono
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>
  requireAuth: () => boolean
  checkEmailExists: (email: string) => Promise<boolean>
  requestPasswordReset: (email: string) => Promise<void>
  validateResetToken: (token: string) => Promise<boolean>
  resetPassword: (token: string, newPassword: string) => Promise<void>
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

  // Verificar si un email ya existe
  const checkEmailExists = async (email: string): Promise<boolean> => {
    // Simulación de llamada a API
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    // En un entorno real, esto sería una llamada a la API
    // Para la simulación, verificamos en localStorage si hay usuarios con ese email
    try {
      const storedUsers = localStorage.getItem("users")
      if (storedUsers) {
        const users = JSON.parse(storedUsers)
        return users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())
      }
    } catch (error) {
      console.error("Error al verificar email:", error)
    }
    
    return false
  }

  // Función de inicio de sesión
  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true)
    try {
      // Simulación de llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // En un entorno real, esto sería una llamada a la API
      // Para la simulación, verificamos en localStorage
      const storedUsers = localStorage.getItem("users")
      let foundUser = null
      
      if (storedUsers) {
        const users = JSON.parse(storedUsers)
        foundUser = users.find((u: any) => 
          u.email.toLowerCase() === email.toLowerCase() && u.password === password
        )
      }
      
      if (!foundUser) {
        throw new Error("INVALID_CREDENTIALS")
      }

      // Usuario autenticado
      const authenticatedUser: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
        avatar: foundUser.avatar || "/placeholder.svg?height=40&width=40",
      }

      setUser(authenticatedUser)
      
      // Si rememberMe está activado, guardamos en localStorage
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(authenticatedUser))
      } else {
        // Si no, solo guardamos en sessionStorage (se borra al cerrar el navegador)
        sessionStorage.setItem("user", JSON.stringify(authenticatedUser))
        localStorage.removeItem("user") // Aseguramos que no quede en localStorage
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Función de registro
  const register = async (name: string, email: string, password: string, phone?: string) => {
    setIsLoading(true)
    try {
      // Verificar si el email ya existe
      const emailExists = await checkEmailExists(email)
      if (emailExists) {
        throw new Error("EMAIL_EXISTS")
      }

      // Simulación de llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generar un ID único para el usuario
      const userId = Date.now().toString()

      // Usuario nuevo
      const newUser: User & { password: string } = {
        id: userId,
        name: name,
        email: email,
        phone: phone,
        avatar: "/placeholder.svg?height=40&width=40",
        password: password // En un sistema real, esto estaría hasheado
      }

      // Guardar en "base de datos" simulada (localStorage)
      const storedUsers = localStorage.getItem("users")
      const users = storedUsers ? JSON.parse(storedUsers) : []
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Usuario autenticado (sin la contraseña)
      const authenticatedUser: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        avatar: newUser.avatar,
      }

      setUser(authenticatedUser)
      localStorage.setItem("user", JSON.stringify(authenticatedUser))
    } catch (error) {
      console.error("Error de registro:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Función para solicitar restablecimiento de contraseña
  const requestPasswordReset = async (email: string) => {
    // Simulación de llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Verificar si el email existe
    const emailExists = await checkEmailExists(email)
    if (!emailExists) {
      throw new Error("EMAIL_NOT_FOUND")
    }
    
    // Generar token de restablecimiento (en un sistema real, esto sería más seguro)
    const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    
    // Guardar token en localStorage (simulación)
    const resetTokens = localStorage.getItem("resetTokens") 
      ? JSON.parse(localStorage.getItem("resetTokens") || "{}") 
      : {}
    
    resetTokens[resetToken] = {
      email,
      expires: Date.now() + 3600000, // 1 hora de validez
    }
    
    localStorage.setItem("resetTokens", JSON.stringify(resetTokens))
    
    // En un sistema real, aquí enviaríamos un email con el enlace
    console.log(`Enlace de restablecimiento: /reset-password/${resetToken}`)
    
    return true
  }

  // Función para validar un token de restablecimiento
  const validateResetToken = async (token: string) => {
    // Simulación de llamada a API
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    // Verificar si el token existe y es válido
    const resetTokens = localStorage.getItem("resetTokens") 
      ? JSON.parse(localStorage.getItem("resetTokens") || "{}") 
      : {}
    
    const tokenData = resetTokens[token]
    
    if (!tokenData) return false
    
    // Verificar si el token ha expirado
    if (tokenData.expires < Date.now()) {
      // Eliminar token expirado
      delete resetTokens[token]
      localStorage.setItem("resetTokens", JSON.stringify(resetTokens))
      return false
    }
    
    return true
  }

  // Función para restablecer la contraseña
  const resetPassword = async (token: string, newPassword: string) => {
    // Simulación de llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Verificar si el token es válido
    const isValid = await validateResetToken(token)
    if (!isValid) {
      throw new Error("INVALID_TOKEN")
    }
    
    // Obtener el email asociado al token
    const resetTokens = JSON.parse(localStorage.getItem("resetTokens") || "{}")
    const { email } = resetTokens[token]
    
    // Actualizar la contraseña del usuario
    const storedUsers = localStorage.getItem("users")
    if (storedUsers) {
      const users = JSON.parse(storedUsers)
      const userIndex = users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase())
      
      if (userIndex !== -1) {
        users[userIndex].password = newPassword
        localStorage.setItem("users", JSON.stringify(users))
      }
    }
    
    // Eliminar el token usado
    delete resetTokens[token]
    localStorage.setItem("resetTokens", JSON.stringify(resetTokens))
    
    return true
  }

  // Función de cierre de sesión
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    sessionStorage.removeItem("user")
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
    checkEmailExists,
    requestPasswordReset,
    validateResetToken,
    resetPassword,
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
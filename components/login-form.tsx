"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/context/auth-context"

export default function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validación básica
    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña")
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Por favor ingresa un correo electrónico válido")
      return
    }

    setIsLoading(true)

    try {
      // Llamar a la función de login del contexto
      await login(email, password, rememberMe)

      // Resetear contador de intentos en caso de éxito
      setAttempts(0)
      
      // Redirigir al home después del inicio de sesión exitoso
      router.push("/")
    } catch (err) {
      // Incrementar contador de intentos fallidos
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      
      // Mensaje de error personalizado según el número de intentos
      if (newAttempts >= 3) {
        setError("Demasiados intentos fallidos. ¿Olvidaste tu contraseña?")
      } else {
        setError("Correo o contraseña incorrectos. Por favor intenta de nuevo.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Contraseña</Label>
          <Link href="/forgot-password" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
        <label
          htmlFor="remember"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Recordarme
        </label>
      </div>

      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </Button>
    </form>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/context/auth-context"

export default function ForgotPasswordForm() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // Validación básica
    if (!email) {
      setError("Por favor ingresa tu correo electrónico")
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
      // Llamar a la función de recuperación de contraseña
      await requestPasswordReset(email)
      setSuccess(true)
    } catch (err: any) {
      if (err.message === "EMAIL_NOT_FOUND") {
        // No revelamos si el email existe o no por seguridad
        setSuccess(true) // Mostramos éxito incluso si el email no existe
      } else {
        setError("Error al procesar la solicitud. Por favor intenta de nuevo más tarde.")
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

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
            Revisa también tu carpeta de spam.
          </AlertDescription>
        </Alert>
      )}

      {!success && (
        <>
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

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
          </Button>
        </>
      )}
    </form>
  )
}
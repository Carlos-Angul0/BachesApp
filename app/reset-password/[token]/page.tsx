"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/context/auth-context"

export default function ResetPasswordPage() {
  const { resetPassword, validateResetToken } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isValidToken, setIsValidToken] = useState(false)
  const [isValidating, setIsValidating] = useState(true)

  const token = params.token as string

  // Validar el token cuando la página se carga
  useEffect(() => {
    const validateToken = async () => {
      try {
        const isValid = await validateResetToken(token)
        setIsValidToken(isValid)
      } catch (err) {
        setIsValidToken(false)
      } finally {
        setIsValidating(false)
      }
    }

    validateToken()
  }, [token, validateResetToken])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validación básica
    if (!password || !confirmPassword) {
      setError("Por favor completa todos los campos")
      return
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)

    try {
      // Llamar a la función de restablecimiento de contraseña
      await resetPassword(token, password)
      setSuccess(true)
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err) {
      setError("Error al restablecer la contraseña. El enlace puede haber expirado.")
    } finally {
      setIsLoading(false)
    }
  }

  // Mostrar estado de carga mientras se valida el token
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando enlace...</p>
        </div>
      </div>
    )
  }

  // Mostrar error si el token no es válido
  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Enlace inválido o expirado</h1>
          <p className="text-gray-600 mb-6">
            El enlace para restablecer tu contraseña no es válido o ha expirado. Por favor solicita un nuevo enlace.
          </p>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/forgot-password">Solicitar nuevo enlace</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <Link href="/login" className="inline-flex items-center text-sm text-gray-600 hover:text-emerald-600 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a inicio de sesión
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-emerald-600"
              >
                <path d="M19 9h2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9h2" />
                <rect width="16" height="4" x="4" y="5" rx="1" />
                <path d="M4 13h16" />
                <path d="M4 17h16" />
              </svg>
              <span className="text-2xl font-bold text-emerald-600">BachesApp</span>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Restablecer Contraseña</h1>
              <p className="text-gray-600 mt-2">Ingresa tu nueva contraseña</p>
            </div>

            {success ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Tu contraseña ha sido restablecida con éxito. Serás redirigido al inicio de sesión en unos segundos.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Nueva contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">Mínimo 8 caracteres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? "Restableciendo..." : "Restablecer Contraseña"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
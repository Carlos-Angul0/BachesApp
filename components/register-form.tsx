"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/context/auth-context"

export default function RegisterForm() {
  const router = useRouter()
  const { register, checkEmailExists } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", // Nuevo campo para número de contacto
    password: "",
    confirmPassword: "",
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [emailCheckLoading, setEmailCheckLoading] = useState(false)
  const [emailError, setEmailError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Limpiar errores específicos cuando el usuario corrige
    if (name === "email") {
      setEmailError("")
    }
  }

  // Validar formato de email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validar formato de teléfono (acepta formatos comunes colombianos)
  const isValidPhone = (phone: string) => {
    // Acepta formatos: +57XXXXXXXXXX, 57XXXXXXXXXX, XXXXXXXXXX (10 dígitos)
    const phoneRegex = /^(\+?57)?[0-9]{10}$/
    return phone === "" || phoneRegex.test(phone) // Opcional, pero si se proporciona debe ser válido
  }

  // Verificar si el email ya existe cuando el usuario termina de escribirlo
  const handleEmailBlur = async () => {
    if (!formData.email || !isValidEmail(formData.email)) return
    
    setEmailCheckLoading(true)
    try {
      const exists = await checkEmailExists(formData.email)
      if (exists) {
        setEmailError("Este correo electrónico ya está registrado")
      }
    } catch (err) {
      console.error("Error al verificar email:", err)
    } finally {
      setEmailCheckLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validación completa
    if (!formData.name || !formData.email || !formData.password) {
      setError("Por favor completa todos los campos obligatorios")
      return
    }

    if (!isValidEmail(formData.email)) {
      setError("Por favor ingresa un correo electrónico válido")
      return
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      setError("Por favor ingresa un número de teléfono válido")
      return
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones")
      return
    }

    // Verificar si el email ya existe antes de intentar registrar
    try {
      const emailExists = await checkEmailExists(formData.email)
      if (emailExists) {
        setError("Este correo electrónico ya está registrado")
        return
      }
    } catch (err) {
      console.error("Error al verificar email:", err)
    }

    setIsLoading(true)

    try {
      // Llamar a la función de registro del contexto
      await register(formData.name, formData.email, formData.password, formData.phone)

      // Redirigir al home después del registro exitoso
      router.push("/")
    } catch (err) {
      setError("Error al crear la cuenta. Por favor intenta de nuevo.")
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
        <Label htmlFor="name">Nombre completo <span className="text-red-500">*</span></Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="Tu nombre" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico <span className="text-red-500">*</span></Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="tu@ejemplo.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleEmailBlur}
          required
          className={emailError ? "border-red-500" : ""}
        />
        {emailCheckLoading && <p className="text-xs text-gray-500">Verificando disponibilidad...</p>}
        {emailError && <p className="text-xs text-red-500">{emailError}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Número de contacto</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Ej: 3001234567"
          value={formData.phone}
          onChange={handleChange}
        />
        <p className="text-xs text-gray-500">Formato: 10 dígitos, opcional</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña <span className="text-red-500">*</span></Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <p className="text-xs text-gray-500">Mínimo 8 caracteres</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar contraseña <span className="text-red-500">*</span></Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={acceptTerms}
          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          required
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Acepto los términos y condiciones <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-500">
            Al registrarte, aceptas nuestros términos de servicio y política de privacidad.
          </p>
        </div>
      </div>

      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
        {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
      </Button>
    </form>
  )
}
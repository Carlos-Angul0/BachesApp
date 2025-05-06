"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, X, ImageIcon } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useReports, type ReportSeverity, type GeoLocation } from "@/context/reports-context"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import dynamic from "next/dynamic"
import Image from "next/image"

// Importar el mapa dinámicamente para evitar errores de SSR
const LocationMap = dynamic(() => import("./location-map"), {
  ssr: false,
  loading: () => (
    <Button variant="outline" className="shrink-0" disabled>
      <span className="animate-pulse">Cargando mapa...</span>
    </Button>
  ),
})

export default function ReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAuthAlert, setShowAuthAlert] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const { user, requireAuth } = useAuth()
  const { addReport } = useReports()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: "",
    direccion: "",
    descripcion: "",
    severidad: "media" as ReportSeverity,
    comuna: "",
  })

  // Estado para la imagen
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Estado para la ubicación
  const [location, setLocation] = useState<GeoLocation | null>(null)

  // Verificar autenticación cuando el componente se monta
  useEffect(() => {
    // Solo mostrar alerta si el usuario no está autenticado
    if (!user) {
      setShowAuthAlert(true)
    } else {
      setShowAuthAlert(false)
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen válida")
      return
    }

    // Validar tamaño (10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
      alert("La imagen es demasiado grande. El tamaño máximo es 10MB")
      return
    }

    setImageFile(file)

    // Crear una URL para la vista previa
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Verificar si el usuario está autenticado
    if (!requireAuth()) {
      return // La función requireAuth ya redirige a login
    }

    setIsSubmitting(true)

    // Procesar la imagen si existe
    let imageData = "/placeholder.svg?height=300&width=400" // Imagen por defecto
    if (imageFile && imagePreview) {
      // En un entorno real, aquí subirías la imagen a un servidor
      // Para este ejemplo, usamos la URL de datos base64
      imageData = imagePreview
    }

    // Crear el nuevo reporte
    const newReport = {
      titulo: formData.titulo,
      direccion: formData.direccion,
      descripcion: formData.descripcion,
      severidad: formData.severidad as ReportSeverity,
      comuna: formData.comuna,
      usuario: {
        nombre: user?.name || "Usuario Anónimo",
        avatar: user?.avatar,
      },
      imagen: imageData,
      ubicacion: location || undefined,
    }

    // Añadir el reporte al contexto
    addReport(newReport)

    // Simular envío de formulario
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccessDialog(true)

      // Resetear el formulario
      setFormData({
        titulo: "",
        direccion: "",
        descripcion: "",
        severidad: "media",
        comuna: "",
      })
      setImagePreview(null)
      setImageFile(null)
      setLocation(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }, 1500)
  }

  const handleReportClick = () => {
    // Verificar si el usuario está autenticado
    if (!user) {
      router.push("/login")
    }
  }

  const handleViewReports = () => {
    setShowSuccessDialog(false)
    router.push("/reportes")
  }

  const handleAddAnother = () => {
    setShowSuccessDialog(false)
    // El formulario ya está reseteado, solo cerramos el diálogo
  }

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <section className="py-16 bg-white" id="reportar">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Reportar un Bache</h2>
            <p className="mt-4 text-lg text-gray-600">
              Ayúdanos a identificar los baches en las calles de Cali para su pronta reparación
            </p>
          </div>

          {showAuthAlert && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Debes iniciar sesión para poder reportar un bache.{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="font-medium underline text-blue-700 hover:text-blue-800"
                >
                  Iniciar sesión
                </button>
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Formulario de Reporte</CardTitle>
              <CardDescription>Completa todos los campos para enviar tu reporte de bache</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título del reporte</Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    placeholder="Ej: Bache profundo en Avenida 6N"
                    required
                    disabled={!user}
                    value={formData.titulo}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      placeholder="Ingresa tu nombre"
                      required
                      defaultValue={user?.name || ""}
                      disabled={true} // Siempre deshabilitado, se usa el nombre del usuario autenticado
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      required
                      defaultValue={user?.email || ""}
                      disabled={true} // Siempre deshabilitado, se usa el email del usuario autenticado
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" placeholder="(602) XXX-XXXX" disabled={!user} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comuna">Comuna</Label>
                    <Select
                      disabled={!user}
                      value={formData.comuna}
                      onValueChange={(value) => handleSelectChange("comuna", value)}
                    >
                      <SelectTrigger id="comuna">
                        <SelectValue placeholder="Selecciona la comuna" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(22)].map((_, i) => (
                          <SelectItem key={i + 1} value={`${i + 1}`}>
                            Comuna {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección exacta</Label>
                  <div className="flex gap-2">
                    <Input
                      id="direccion"
                      name="direccion"
                      placeholder="Calle, carrera, número"
                      required
                      disabled={!user}
                      value={formData.direccion}
                      onChange={handleChange}
                    />
                    {user && <LocationMap onLocationSelect={handleLocationSelect} />}
                  </div>
                  {location && (
                    <div className="text-sm text-gray-500 mt-1">
                      Coordenadas: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción del bache</Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    placeholder="Describe el tamaño, profundidad y otros detalles relevantes"
                    className="min-h-[100px]"
                    required
                    disabled={!user}
                    value={formData.descripcion}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severidad">Nivel de severidad</Label>
                  <Select
                    value={formData.severidad}
                    onValueChange={(value) => handleSelectChange("severidad", value)}
                    disabled={!user}
                  >
                    <SelectTrigger id="severidad">
                      <SelectValue placeholder="Selecciona la severidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baja">Bajo - Pequeño bache</SelectItem>
                      <SelectItem value="media">Medio - Bache notable</SelectItem>
                      <SelectItem value="alta">Alto - Bache peligroso</SelectItem>
                      <SelectItem value="critica">Crítico - Daño severo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">Fotografía (opcional)</Label>
                  <input
                    ref={fileInputRef}
                    id="photo"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    disabled={!user}
                    onChange={handleImageChange}
                  />

                  {imagePreview ? (
                    <div className="relative h-64 w-full rounded-lg overflow-hidden border border-gray-300">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Vista previa"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                        disabled={!user}
                      >
                        <X className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 h-64 ${
                        user ? "cursor-pointer hover:bg-gray-50" : "opacity-70 cursor-not-allowed"
                      }`}
                      onClick={user ? handleImageClick : () => router.push("/login")}
                    >
                      <div className="space-y-2 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-emerald-600 hover:text-emerald-500">
                            Haz clic para subir
                          </span>{" "}
                          o arrastra y suelta
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-start space-x-2">
                  <div className="flex h-5 items-center">
                    <input
                      id="terms"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                      required
                      disabled={!user}
                    />
                  </div>
                  <div className="text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700">
                      Acepto los términos y condiciones
                    </label>
                    <p className="text-gray-500">
                      La información proporcionada será utilizada únicamente para fines de mejoramiento urbano.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type={user ? "submit" : "button"}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    disabled={isSubmitting}
                    onClick={user ? undefined : handleReportClick}
                  >
                    {isSubmitting ? "Enviando..." : user ? "Enviar Reporte" : "Iniciar sesión para reportar"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Diálogo de éxito */}
          <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¡Reporte enviado con éxito!</AlertDialogTitle>
                <AlertDialogDescription>
                  Gracias por contribuir a mejorar Cali. Tu reporte ha sido registrado y será revisado por nuestro
                  equipo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={handleAddAnother}>Reportar otro bache</AlertDialogAction>
                <AlertDialogAction onClick={handleViewReports}>Ver reportes recientes</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </section>
  )
}

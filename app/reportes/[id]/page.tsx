"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, ThumbsUp, MessageSquare, Share2, Flag, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { useReports } from "@/context/reports-context"
import { useAuth } from "@/context/auth-context"
import { useRouter, useParams } from "next/navigation"
import dynamic from "next/dynamic"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Importar el mapa dinámicamente para evitar errores de SSR
const LocationMapView = dynamic(() => import("@/components/location-map-view"), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-md"></div>,
})

// Función para obtener el color de la badge según el estado
function getEstadoColor(estado: string) {
  switch (estado) {
    case "pendiente":
      return "bg-red-100 text-red-800 border-red-200"
    case "en_proceso":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "reparado":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

// Función para obtener el texto del estado
function getEstadoTexto(estado: string) {
  switch (estado) {
    case "pendiente":
      return "Pendiente"
    case "en_proceso":
      return "En proceso"
    case "reparado":
      return "Reparado"
    default:
      return "Desconocido"
  }
}

// Función para obtener el color de la badge según la severidad
function getSeveridadColor(severidad: string) {
  switch (severidad) {
    case "baja":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "media":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "alta":
      return "bg-red-100 text-red-800 border-red-200"
    case "critica":
      return "bg-purple-100 text-purple-800 border-purple-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

// Función para obtener el texto de la severidad
function getSeveridadTexto(severidad: string) {
  switch (severidad) {
    case "baja":
      return "Baja"
    case "media":
      return "Media"
    case "alta":
      return "Alta"
    case "critica":
      return "Crítica"
    default:
      return "Desconocida"
  }
}

export default function ReporteDetallePage() {
  const { getReportById, voteReport, addComment, deleteReport, canDeleteReport } = useReports()
  const { user, requireAuth } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [commentText, setCommentText] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Convertir el ID de string a número
  const reportId = params.id ? Number.parseInt(params.id as string, 10) : 0

  // Obtener el reporte
  const reporte = getReportById(reportId)

  // Verificar si el usuario puede eliminar este reporte
  const userCanDelete = canDeleteReport(reportId)

  // Si no existe el reporte, mostrar mensaje
  if (!reporte) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Reporte no encontrado</h1>
          <p className="text-gray-600 mb-6">El reporte que estás buscando no existe o ha sido eliminado.</p>
          <Button asChild>
            <Link href="/reportes">Volver a reportes</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Asegurarse de que usuario siempre exista
  const usuario = reporte.usuario || { nombre: "Usuario Anónimo", avatar: "/placeholder.svg?height=40&width=40" }

  const handleVote = () => {
    voteReport(reportId)
  }

  const handleComment = () => {
    if (!requireAuth()) {
      return // La función requireAuth ya redirige a login
    }

    if (commentText.trim() === "") {
      return
    }

    // Añadir comentario (en un sistema real, guardaríamos el texto)
    addComment(reportId)
    setCommentText("")
  }

  const handleDeleteClick = () => {
    if (!requireAuth()) {
      return // La función requireAuth ya redirige a login
    }

    // Verificar si el usuario puede eliminar este reporte
    if (!userCanDelete) {
      alert("Solo el creador del reporte puede eliminarlo")
      return
    }

    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    setIsDeleting(true)

    // Simular un pequeño retraso para mostrar el estado de carga
    setTimeout(() => {
      const success = deleteReport(reportId)

      if (success) {
        router.push("/reportes")
      } else {
        setIsDeleting(false)
        setShowDeleteDialog(false)
        alert("No tienes permiso para eliminar este reporte o ha ocurrido un error")
      }
    }, 1000)
  }

  // Datos de ejemplo para comentarios y actualizaciones
  const comentarios = [
    {
      id: 1,
      usuario: {
        nombre: "María López",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      fecha: "2025-04-16",
      texto: "Este bache es muy peligroso, casi tengo un accidente ayer. Espero que lo reparen pronto.",
      likes: 5,
    },
    {
      id: 2,
      usuario: {
        nombre: "Juan Pérez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      fecha: "2025-04-16",
      texto: "Ya he visto varios vehículos dañarse por este bache. Es urgente su reparación.",
      likes: 3,
    },
    {
      id: 3,
      usuario: {
        nombre: "Ana Gómez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      fecha: "2025-04-17",
      texto: "Acabo de pasar por ahí y han puesto una señalización, pero aún no han iniciado la reparación.",
      likes: 2,
    },
  ]

  const actualizaciones = [
    {
      fecha: "2025-04-16",
      estado: "registrado",
      descripcion: "Reporte recibido y registrado en el sistema.",
    },
    {
      fecha: "2025-04-17",
      estado: "verificado",
      descripcion: "Equipo técnico ha verificado el reporte y confirmado la severidad.",
    },
    {
      fecha: "2025-04-18",
      estado: "programado",
      descripcion: "Reparación programada para el 22 de abril de 2025.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/reportes" className="inline-flex items-center text-sm text-gray-600 hover:text-emerald-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a reportes
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{reporte.titulo}</h1>
                {userCanDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleDeleteClick}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className={getEstadoColor(reporte.estado)}>
                  {getEstadoTexto(reporte.estado)}
                </Badge>
                <Badge variant="outline" className={getSeveridadColor(reporte.severidad)}>
                  Severidad: {getSeveridadTexto(reporte.severidad)}
                </Badge>
                <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                  ID: {reporte.id}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin className="h-4 w-4" />
                <span>{reporte.direccion}</span>
              </div>

              <div className="relative h-[400px] w-full rounded-lg overflow-hidden mb-6">
                <Image
                  src={reporte.imagen || "/placeholder.svg"}
                  alt={reporte.titulo}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Descripción</h2>
                <p className="text-gray-700">{reporte.descripcion}</p>
              </div>

              {reporte.ubicacion && isClient && (
                <div className="mb-6">
                  <LocationMapView location={reporte.ubicacion} title={reporte.titulo} />
                </div>
              )}

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <Button variant="outline" className="flex items-center gap-2" onClick={handleVote}>
                    <ThumbsUp className="h-4 w-4" />
                    <span>Votar ({reporte.votos})</span>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Comentar</span>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    <span>Compartir</span>
                  </Button>
                </div>
                <Button variant="outline" className="flex items-center gap-2 text-red-600">
                  <Flag className="h-4 w-4" />
                  <span>Reportar</span>
                </Button>
              </div>

              <Separator className="my-8" />

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Comentarios ({reporte.comentarios})</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar || "/placeholder.svg?height=40&width=40"} alt="Tu avatar" />
                      <AvatarFallback>{user?.name?.substring(0, 2) || "TU"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Escribe un comentario..."
                        className="mb-2"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        disabled={!user}
                      />
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={handleComment}
                        disabled={!user || commentText.trim() === ""}
                      >
                        Comentar
                      </Button>
                    </div>
                  </div>

                  {comentarios.map((comentario) => (
                    <div key={comentario.id} className="flex gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={comentario.usuario.avatar || "/placeholder.svg"}
                          alt={comentario.usuario.nombre}
                        />
                        <AvatarFallback>{comentario.usuario.nombre.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-medium">{comentario.usuario.nombre}</h3>
                          <span className="text-sm text-gray-500">
                            {new Date(comentario.fecha).toLocaleDateString("es-CO", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{comentario.texto}</p>
                        <div className="flex items-center gap-4">
                          <button className="text-sm text-gray-500 hover:text-emerald-600 flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>Me gusta ({comentario.likes})</span>
                          </button>
                          <button className="text-sm text-gray-500 hover:text-emerald-600">Responder</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Información del reporte</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fecha de reporte</p>
                    <p>
                      {new Date(reporte.fecha).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reportado por</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={usuario.avatar || "/placeholder.svg"} alt={usuario.nombre} />
                        <AvatarFallback>{usuario.nombre.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span>{usuario.nombre}</span>
                    </div>
                  </div>
                  {reporte.comuna && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Comuna</p>
                      <p>{reporte.comuna}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Actualizaciones</h2>
                <div className="relative">
                  {actualizaciones.map((actualizacion, index) => (
                    <div key={index} className="mb-4 pl-6 relative">
                      {index < actualizaciones.length - 1 && (
                        <div className="absolute left-[9px] top-[24px] bottom-0 w-[2px] bg-gray-200"></div>
                      )}
                      <div className="absolute left-0 top-[6px] h-4 w-4 rounded-full bg-emerald-500"></div>
                      <div>
                        <p className="font-medium">
                          {new Date(actualizacion.fecha).toLocaleDateString("es-CO", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">{actualizacion.estado}</p>
                        <p className="text-sm text-gray-700 mt-1">{actualizacion.descripcion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Acciones</h2>
                <div className="space-y-3">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Seguir este reporte</Button>
                  <Button variant="outline" className="w-full">
                    Añadir actualización
                  </Button>
                  {userCanDelete && (
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      onClick={handleDeleteClick}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar reporte
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que quieres eliminar este reporte?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El reporte será eliminado permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

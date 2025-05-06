"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"

// Tipos para los reportes
export type ReportSeverity = "baja" | "media" | "alta" | "critica"
export type ReportStatus = "pendiente" | "en_proceso" | "reparado"

export type GeoLocation = {
  lat: number
  lng: number
}

export type Report = {
  id: number
  titulo: string
  direccion: string
  fecha: string
  estado: ReportStatus
  severidad: ReportSeverity
  descripcion: string
  usuario: {
    nombre: string
    avatar?: string
    id?: string // Añadimos ID de usuario para verificar propiedad
  }
  imagen?: string
  comentarios: number
  votos: number
  comuna?: string
  ubicacion?: GeoLocation
}

type ReportsContextType = {
  reports: Report[]
  addReport: (report: Omit<Report, "id" | "fecha" | "estado" | "comentarios" | "votos">) => void
  getReportById: (id: number) => Report | undefined
  voteReport: (id: number) => void
  addComment: (reportId: number) => void
  deleteReport: (id: number) => boolean
  canDeleteReport: (reportId: number) => boolean // Nueva función para verificar permisos
}

// Datos iniciales de ejemplo con las imágenes reales
const initialReports: Report[] = [
  {
    id: 1,
    titulo: "Bache profundo en Avenida 6N",
    direccion: "Avenida 6N #25-10, El Bosque",
    fecha: "2025-04-15",
    estado: "pendiente",
    severidad: "alta",
    descripcion:
      "Bache de aproximadamente 50cm de diámetro y 15cm de profundidad. Representa un peligro para motociclistas y vehículos pequeños. Se ha reportado un accidente menor en la zona.",
    usuario: {
      nombre: "Carlos Martínez",
      avatar: "/placeholder.svg?height=40&width=40",
      id: "1",
    },
    imagen: "/images/bache1.png",
    comentarios: 3,
    votos: 12,
    ubicacion: { lat: 3.4516, lng: -76.532 },
  },
  {
    id: 2,
    titulo: "Múltiples baches en Calle 5",
    direccion: "Calle 5 entre Carreras 39 y 42, San Fernando",
    fecha: "2025-04-14",
    estado: "en_proceso",
    severidad: "media",
    descripcion:
      "Serie de 5 baches consecutivos de tamaño mediano. Dificultan el tránsito fluido y causan congestión en horas pico. La vía es muy transitada por ser ruta de buses.",
    usuario: {
      nombre: "María López",
      avatar: "/placeholder.svg?height=40&width=40",
      id: "2",
    },
    imagen: "/images/bache2.png",
    comentarios: 7,
    votos: 18,
    ubicacion: { lat: 3.4372, lng: -76.5225 },
  },
  {
    id: 3,
    titulo: "Hundimiento en Avenida Roosevelt",
    direccion: "Avenida Roosevelt con Carrera 34, San Fernando",
    fecha: "2025-04-13",
    estado: "reparado",
    severidad: "critica",
    descripcion:
      "Hundimiento severo del pavimento que abarca casi todo el carril. Fue necesario cerrar parcialmente la vía. Reparado el 16 de abril por cuadrilla municipal.",
    usuario: {
      nombre: "Juan Pérez",
      avatar: "/placeholder.svg?height=40&width=40",
      id: "3",
    },
    imagen: "/images/bache3.png",
    comentarios: 15,
    votos: 32,
    ubicacion: { lat: 3.428, lng: -76.54 },
  },
  {
    id: 4,
    titulo: "Bache en entrada de Ciudad Jardín",
    direccion: "Calle 16 con Carrera 100, Ciudad Jardín",
    fecha: "2025-04-12",
    estado: "pendiente",
    severidad: "baja",
    descripcion:
      "Bache pequeño pero en crecimiento. Ubicado justo en la entrada del barrio, afecta principalmente a vehículos que entran a alta velocidad.",
    usuario: {
      nombre: "Ana Gómez",
      avatar: "/placeholder.svg?height=40&width=40",
      id: "4",
    },
    imagen: "/images/bache4.png",
    comentarios: 2,
    votos: 5,
    ubicacion: { lat: 3.3729, lng: -76.538 },
  },
  {
    id: 5,
    titulo: "Deterioro severo en Autopista Sur",
    direccion: "Autopista Sur km 2, salida sur de Cali",
    fecha: "2025-04-11",
    estado: "en_proceso",
    severidad: "alta",
    descripcion:
      "Tramo de 20 metros con deterioro severo del pavimento. Afecta principalmente a vehículos de carga pesada. Se ha programado reparación para el próximo fin de semana.",
    usuario: {
      nombre: "Roberto Sánchez",
      avatar: "/placeholder.svg?height=40&width=40",
      id: "5",
    },
    imagen: "/images/bache5.png",
    comentarios: 9,
    votos: 27,
    ubicacion: { lat: 3.395, lng: -76.51 },
  },
  {
    id: 6,
    titulo: "Bache peligroso en Avenida Colombia",
    direccion: "Avenida Colombia con Calle 10, Centro",
    fecha: "2025-04-10",
    estado: "pendiente",
    severidad: "alta",
    descripcion:
      "Bache profundo que ha causado daños a varios vehículos. Se encuentra en una vía principal con alto tráfico. Requiere atención urgente.",
    usuario: {
      nombre: "Laura Jiménez",
      avatar: "/placeholder.svg?height=40&width=40",
      id: "6",
    },
    imagen: "/images/bache6.png",
    comentarios: 11,
    votos: 23,
    ubicacion: { lat: 3.4489, lng: -76.5284 },
  },
]

const ReportsContext = createContext<ReportsContextType | undefined>(undefined)

export function ReportsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [reports, setReports] = useState<Report[]>([])

  // Cargar reportes desde localStorage al iniciar
  useEffect(() => {
    const storedReports = localStorage.getItem("reports")
    if (storedReports) {
      setReports(JSON.parse(storedReports))
    } else {
      // Si no hay reportes guardados, usar los iniciales
      setReports(initialReports)
      localStorage.setItem("reports", JSON.stringify(initialReports))
    }
  }, [])

  // Guardar reportes en localStorage cuando cambien
  useEffect(() => {
    if (reports.length > 0) {
      localStorage.setItem("reports", JSON.stringify(reports))
    }
  }, [reports])

  // Añadir un nuevo reporte
  const addReport = (report: Omit<Report, "id" | "fecha" | "estado" | "comentarios" | "votos">) => {
    const newReport: Report = {
      ...report,
      id: Date.now(), // Usar timestamp como ID único
      fecha: new Date().toISOString().split("T")[0], // Formato YYYY-MM-DD
      estado: "pendiente",
      comentarios: 0,
      votos: 0,
      usuario: {
        nombre: user?.name || "Usuario Anónimo",
        avatar: user?.avatar || "/placeholder.svg?height=40&width=40",
        id: user?.id || "anonymous", // Guardar el ID del usuario
      },
    }

    setReports((prevReports) => {
      const updatedReports = [newReport, ...prevReports]
      return updatedReports
    })
  }

  // Obtener un reporte por su ID
  const getReportById = (id: number) => {
    return reports.find((report) => report.id === id)
  }

  // Votar por un reporte
  const voteReport = (id: number) => {
    setReports((prevReports) =>
      prevReports.map((report) => (report.id === id ? { ...report, votos: report.votos + 1 } : report)),
    )
  }

  // Añadir un comentario a un reporte
  const addComment = (reportId: number) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId ? { ...report, comentarios: report.comentarios + 1 } : report,
      ),
    )
  }

  // Verificar si el usuario actual puede eliminar un reporte
  const canDeleteReport = (reportId: number) => {
    if (!user) return false

    const report = reports.find((report) => report.id === reportId)
    if (!report) return false

    // Verificar si el usuario actual es el creador del reporte
    return report.usuario.id === user.id
  }

  // Eliminar un reporte por su ID (solo si el usuario actual es el creador)
  const deleteReport = (id: number) => {
    // Verificar si el usuario puede eliminar este reporte
    if (!canDeleteReport(id)) {
      return false
    }

    // Eliminar el reporte
    setReports((prevReports) => prevReports.filter((report) => report.id !== id))
    return true
  }

  const value = {
    reports,
    addReport,
    getReportById,
    voteReport,
    addComment,
    deleteReport,
    canDeleteReport,
  }

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>
}

export function useReports() {
  const context = useContext(ReportsContext)
  if (context === undefined) {
    throw new Error("useReports debe ser usado dentro de un ReportsProvider")
  }
  return context
}

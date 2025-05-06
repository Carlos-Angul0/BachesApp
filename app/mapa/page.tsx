"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, Search } from "lucide-react"
import { useReports, type Report } from "@/context/reports-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

// Importar el mapa dinámicamente para evitar errores de SSR
const MapComponent = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => (
    <div className="h-[calc(100vh-12rem)] w-full bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
      <p className="text-gray-500">Cargando mapa...</p>
    </div>
  ),
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

export default function MapaPage() {
  const { reports } = useReports()
  const router = useRouter()
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [severityFilter, setSeverityFilter] = useState<string>("todas")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Filtrar reportes que no están reparados
  useEffect(() => {
    let filtered = reports.filter((report) => report.estado !== "reparado")

    // Aplicar filtro de severidad
    if (severityFilter !== "todas") {
      filtered = filtered.filter((report) => report.severidad === severityFilter)
    }

    // Aplicar búsqueda
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (report) =>
          report.titulo.toLowerCase().includes(query) ||
          report.direccion.toLowerCase().includes(query) ||
          report.descripcion.toLowerCase().includes(query),
      )
    }

    setFilteredReports(filtered)
  }, [reports, severityFilter, searchQuery])

  const handleMarkerClick = (report: Report) => {
    setSelectedReport(report)
  }

  const handleViewDetails = (id: number) => {
    router.push(`/reportes/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-emerald-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mapa de Baches</h1>
          <p className="mt-2 text-lg text-gray-600">
            Visualiza los baches reportados en la ciudad para planificar tus rutas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Buscar por dirección o descripción"
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-48">
                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por severidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas las severidades</SelectItem>
                        <SelectItem value="baja">Severidad baja</SelectItem>
                        <SelectItem value="media">Severidad media</SelectItem>
                        <SelectItem value="alta">Severidad alta</SelectItem>
                        <SelectItem value="critica">Severidad crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {isClient && (
                  <MapComponent
                    reports={filteredReports}
                    onMarkerClick={handleMarkerClick}
                    selectedReport={selectedReport}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Información</CardTitle>
                <CardDescription>{filteredReports.length} baches sin reparar encontrados</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedReport ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedReport.titulo}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className={getEstadoColor(selectedReport.estado)}>
                          {getEstadoTexto(selectedReport.estado)}
                        </Badge>
                        <Badge variant="outline" className={getSeveridadColor(selectedReport.severidad)}>
                          {getSeveridadTexto(selectedReport.severidad)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Dirección</p>
                      <p className="flex items-start gap-1">
                        <MapPin className="h-4 w-4 mt-0.5 text-gray-500 shrink-0" />
                        <span>{selectedReport.direccion}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Descripción</p>
                      <p className="text-sm text-gray-700">{selectedReport.descripcion}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Reportado el</p>
                      <p className="text-sm">
                        {new Date(selectedReport.fecha).toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <Separator />
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleViewDetails(selectedReport.id)}
                    >
                      Ver detalles completos
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-4">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto" />
                    <div>
                      <p className="text-gray-500">Selecciona un bache en el mapa para ver su información</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span>Severidad alta/crítica</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span>Severidad media</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span>Severidad baja</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

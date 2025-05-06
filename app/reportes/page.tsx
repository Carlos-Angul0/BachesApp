"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useReports } from "@/context/reports-context"

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

export default function ReportesPage() {
  const { reports, voteReport } = useReports()

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
          <h1 className="text-3xl font-bold text-gray-900">Reportes Recientes</h1>
          <p className="mt-2 text-lg text-gray-600">
            Consulta los últimos reportes de baches en la ciudad de Cali y su estado actual
          </p>
        </div>

        <Tabs defaultValue="todos" className="mb-8">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
            <TabsTrigger value="en_proceso">En proceso</TabsTrigger>
            <TabsTrigger value="reparados">Reparados</TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="space-y-6">
            {reports.length > 0 ? (
              reports.map((reporte) => <ReporteCard key={reporte.id} reporte={reporte} onVote={voteReport} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay reportes disponibles</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pendientes" className="space-y-6">
            {reports.filter((reporte) => reporte.estado === "pendiente").length > 0 ? (
              reports
                .filter((reporte) => reporte.estado === "pendiente")
                .map((reporte) => <ReporteCard key={reporte.id} reporte={reporte} onVote={voteReport} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay reportes pendientes</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="en_proceso" className="space-y-6">
            {reports.filter((reporte) => reporte.estado === "en_proceso").length > 0 ? (
              reports
                .filter((reporte) => reporte.estado === "en_proceso")
                .map((reporte) => <ReporteCard key={reporte.id} reporte={reporte} onVote={voteReport} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay reportes en proceso</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reparados" className="space-y-6">
            {reports.filter((reporte) => reporte.estado === "reparado").length > 0 ? (
              reports
                .filter((reporte) => reporte.estado === "reparado")
                .map((reporte) => <ReporteCard key={reporte.id} reporte={reporte} onVote={voteReport} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay reportes reparados</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-center mt-8">
          <Button variant="outline" className="mr-4">
            Cargar más reportes
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
            <Link href="/#reportar">Reportar un nuevo bache</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function ReporteCard({ reporte, onVote }: { reporte: any; onVote: (id: number) => void }) {
  const handleVote = () => {
    onVote(reporte.id)
  }

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative h-64 md:h-auto md:col-span-1">
          <Image
            src={reporte.imagen || "/placeholder.svg"}
            alt={reporte.titulo}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="p-6 md:col-span-2">
          <CardHeader className="p-0 mb-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{reporte.titulo}</CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className={getEstadoColor(reporte.estado)}>
                  {getEstadoTexto(reporte.estado)}
                </Badge>
                <Badge variant="outline" className={getSeveridadColor(reporte.severidad)}>
                  Severidad: {getSeveridadTexto(reporte.severidad)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Dirección</p>
              <p>{reporte.direccion}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Descripción</p>
              <p className="text-gray-700">{reporte.descripcion}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={reporte.usuario.avatar || "/placeholder.svg"} alt={reporte.usuario.nombre} />
                  <AvatarFallback>{reporte.usuario.nombre.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">Reportado por {reporte.usuario.nombre}</span>
              </div>
              <span className="text-sm text-gray-600">
                {new Date(reporte.fecha).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </CardContent>
          <CardFooter className="p-0 pt-4 flex justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{reporte.comentarios} comentarios</span>
              <button
                className="text-sm text-gray-600 hover:text-emerald-600 flex items-center gap-1"
                onClick={handleVote}
              >
                {reporte.votos} votos
              </button>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/reportes/${reporte.id}`}>Ver detalles</Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}

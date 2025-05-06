"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Clock, MapPin, Users } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Datos de usuarios destacados
const topUsers = [
  {
    id: 1,
    name: "Carlos Martínez",
    avatar: "/placeholder.svg?height=40&width=40",
    reports: 12,
    neighborhood: "El Poblado",
  },
  {
    id: 2,
    name: "María López",
    avatar: "/placeholder.svg?height=40&width=40",
    reports: 8,
    neighborhood: "Granada",
  },
  {
    id: 3,
    name: "Juan Pérez",
    avatar: "/placeholder.svg?height=40&width=40",
    reports: 15,
    neighborhood: "San Fernando",
  },
]

export default function StatsSection() {
  const [stats, setStats] = useState({
    totalReportes: 0,
    enProceso: 0,
    reparados: 0,
    comunasActivas: 22,
  })

  // Cargar datos desde localStorage directamente
  useEffect(() => {
    try {
      const storedReports = localStorage.getItem("reports")
      if (storedReports) {
        const reports = JSON.parse(storedReports)

        // Calcular estadísticas
        const totalReportes = reports.length
        const enProceso = reports.filter((report) => report.estado === "en_proceso").length
        const reparados = reports.filter((report) => report.estado === "reparado").length

        // Calcular comunas únicas
        const comunasSet = new Set()
        reports.forEach((report) => {
          if (report.comuna) {
            comunasSet.add(report.comuna)
          }
        })
        const comunasActivas = comunasSet.size || 22

        setStats({
          totalReportes,
          enProceso,
          reparados,
          comunasActivas,
        })
      }
    } catch (error) {
      console.error("Error al cargar reportes:", error)
    }
  }, [])

  return (
    <section className="py-16 bg-white" id="reportes">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Estadísticas y Usuarios Destacados</h2>
          <p className="mt-4 text-lg text-gray-600">Seguimiento en tiempo real de los baches reportados en Cali</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sección de usuarios destacados (1/4 del ancho) */}
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="h-5 w-5 text-emerald-500" />
                <h3 className="text-lg font-semibold">Usuarios Destacados</h3>
              </div>
              <div className="space-y-4">
                {topUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.neighborhood}</p>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      {user.reports} reportes
                    </Badge>
                  </div>
                ))}
                <div className="pt-2 text-center">
                  <Button variant="link" size="sm" asChild className="text-emerald-600">
                    <Link href="#usuarios">Ver todos →</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección de estadísticas (3/4 del ancho) */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <div className="p-3 rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{stats.totalReportes}</h3>
                <p className="text-gray-600">Baches Reportados</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <div className="p-3 rounded-full bg-yellow-100 mb-4">
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{stats.enProceso}</h3>
                <p className="text-gray-600">En Proceso</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <div className="p-3 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{stats.reparados}</h3>
                <p className="text-gray-600">Reparados</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
            <Link href="/mapa">
              <MapPin className="mr-2 h-4 w-4" />
              Ver mapa de baches
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

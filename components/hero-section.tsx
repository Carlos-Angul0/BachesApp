"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const router = useRouter()

  // Función para desplazarse suavemente al formulario de reporte
  const scrollToReportForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const reportForm = document.getElementById("reportar")
    if (reportForm) {
      reportForm.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative bg-gradient-to-b from-emerald-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Reporta baches en Cali y mejora tu ciudad</h1>
            <p className="text-lg text-gray-600">
              Ayuda a mantener las calles de Cali en buen estado reportando baches. Tu participación es clave para una
              ciudad más segura y agradable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <a href="#reportar" onClick={scrollToReportForm}>
                  Reportar un bache
                </a>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/reportes">Ver reportes recientes</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-96">
            <Image
              src="/images/hero-baches.png"
              alt="Aplicación de reporte de baches con trabajadores reparando una calle"
              fill
              className="object-contain rounded-lg"
              priority
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { ReportsProvider } from "@/context/reports-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BachesApp - Reporte de baches en Cali",
  description: "Plataforma ciudadana para el reporte y seguimiento de baches en la ciudad de Cali, Colombia.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <ReportsProvider>{children}</ReportsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

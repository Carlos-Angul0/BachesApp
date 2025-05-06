"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()

  // Añadir esta función después de la línea donde se define isMenuOpen
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
      if (isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
  }

  // No mostrar la barra de navegación en las páginas de login y registro
  if (pathname === "/login" || pathname === "/register") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
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
            className="h-6 w-6 text-emerald-600"
          >
            <path d="M19 9h2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9h2" />
            <rect width="16" height="4" x="4" y="5" rx="1" />
            <path d="M4 13h16" />
            <path d="M4 17h16" />
          </svg>
          <span className="text-xl font-bold text-emerald-600">BachesApp</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-emerald-600">
            Inicio
          </Link>
          <a
            href="#reportes"
            className="text-sm font-medium hover:text-emerald-600"
            onClick={(e) => scrollToSection(e, "reportes")}
          >
            Reportes
          </a>
          <Link href="/mapa" className="text-sm font-medium hover:text-emerald-600">
            Mapa de Baches
          </Link>
          <a
            href="#usuarios"
            className="text-sm font-medium hover:text-emerald-600"
            onClick={(e) => scrollToSection(e, "usuarios")}
          >
            Usuarios
          </a>
          <a
            href="#reportar"
            className="text-sm font-medium hover:text-emerald-600"
            onClick={(e) => scrollToSection(e, "reportar")}
          >
            Reportar
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || ""} />
                    <AvatarFallback>{user?.name?.substring(0, 2) || "US"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/mis-reportes" className="cursor-pointer">
                    <span>Mis Reportes</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" asChild>
                <Link href="/register">Registrarse</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4 bg-white">
          <nav className="flex flex-col space-y-4">
            <Link href="/" className="text-sm font-medium hover:text-emerald-600" onClick={() => setIsMenuOpen(false)}>
              Inicio
            </Link>
            <a
              href="#reportes"
              className="text-sm font-medium hover:text-emerald-600"
              onClick={(e) => scrollToSection(e, "reportes")}
            >
              Reportes
            </a>
            <Link
              href="/mapa"
              className="text-sm font-medium hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Mapa de Baches
            </Link>
            <a
              href="#usuarios"
              className="text-sm font-medium hover:text-emerald-600"
              onClick={(e) => scrollToSection(e, "usuarios")}
            >
              Usuarios
            </a>
            <a
              href="#reportar"
              className="text-sm font-medium hover:text-emerald-600"
              onClick={(e) => scrollToSection(e, "reportar")}
            >
              Reportar
            </a>
            <div className="flex flex-col space-y-2 pt-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || ""} />
                      <AvatarFallback>{user?.name?.substring(0, 2) || "US"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/perfil"
                    className="text-sm font-medium hover:text-emerald-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <Link
                    href="/mis-reportes"
                    className="text-sm font-medium hover:text-emerald-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mis Reportes
                  </Link>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" asChild>
                    <Link href="/register">Registrarse</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

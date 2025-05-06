import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
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
                className="h-6 w-6 text-emerald-400"
              >
                <path d="M19 9h2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9h2" />
                <rect width="16" height="4" x="4" y="5" rx="1" />
                <path d="M4 13h16" />
                <path d="M4 17h16" />
              </svg>
              <span className="text-xl font-bold text-emerald-400">BachesApp</span>
            </div>
            <p className="text-gray-400">
              Plataforma ciudadana para el reporte y seguimiento de baches en la ciudad de Cali, Colombia.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="#reportes" className="text-gray-400 hover:text-white">
                  Reportes
                </Link>
              </li>
              <li>
                <Link href="#usuarios" className="text-gray-400 hover:text-white">
                  Usuarios
                </Link>
              </li>
              <li>
                <Link href="#reportar" className="text-gray-400 hover:text-white">
                  Reportar Bache
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Acerca de Nosotros
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <address className="not-italic text-gray-400 space-y-2">
              <p>Alcaldía de Santiago de Cali</p>
              <p>Avenida 2N #10-70</p>
              <p>Centro Administrativo Municipal CAM</p>
              <p>Teléfono: (602) 885-5555</p>
              <p>Email: baches@cali.gov.co</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} BachesApp. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

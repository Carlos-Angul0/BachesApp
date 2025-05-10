import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import ForgotPasswordForm from "@/components/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <Link href="/login" className="inline-flex items-center text-sm text-gray-600 hover:text-emerald-600 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a inicio de sesión
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
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
                className="h-8 w-8 text-emerald-600"
              >
                <path d="M19 9h2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9h2" />
                <rect width="16" height="4" x="4" y="5" rx="1" />
                <path d="M4 13h16" />
                <path d="M4 17h16" />
              </svg>
              <span className="text-2xl font-bold text-emerald-600">BachesApp</span>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Recuperar Contraseña</h1>
              <p className="text-gray-600 mt-2">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
              </p>
            </div>

            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  )
}
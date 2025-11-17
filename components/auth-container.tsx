"use client"

import { useState } from "react"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"

export function AuthContainer() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-5xl overflow-hidden shadow-2xl bg-white rounded-xl border">
        <div className="grid md:grid-cols-2">
          {/* Left side - Branding */}
          <div className="bg-[#16a34a] p-8 md:p-12 flex flex-col justify-center text-white">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold">Wheels</h1>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold leading-tight">Comparte tu viaje universitario</h2>
                <p className="text-white/80 leading-relaxed">
                  Conecta con compañeros de tu universidad para compartir viajes de manera segura, económica y
                  sostenible.
                </p>
                <div className="space-y-3 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-white/20 p-2 rounded-lg mt-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Verificación universitaria</p>
                      <p className="text-sm text-white/70">Solo estudiantes verificados</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-white/20 p-2 rounded-lg mt-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Ahorra dinero</p>
                      <p className="text-sm text-white/70">Comparte gastos de transporte</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-white/20 p-2 rounded-lg mt-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Cuida el ambiente</p>
                      <p className="text-sm text-white/70">Reduce tu huella de carbono</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Auth Forms */}
          <div className="bg-white p-8 md:p-12">
            <div className="w-full">
              <div className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-gray-100 p-1 mb-8">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`inline-flex h-full flex-1 items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-all ${
                    activeTab === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => setActiveTab("register")}
                  className={`inline-flex h-full flex-1 items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-all ${
                    activeTab === "register" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Registrarse
                </button>
              </div>
              <div>
                {activeTab === "login" && <LoginForm />}
                {activeTab === "register" && <RegisterForm />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

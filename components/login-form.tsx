"use client"

import { useState } from "react"

export function LoginForm() {
  const [userType, setUserType] = useState<"passenger" | "driver">("passenger")
  const [correo, setCorreo] = useState("")
  const [password, setPassword] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensaje("")

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setMensaje("✅ Inicio de sesión exitoso")

        // Si quieres redirigir según el rol:
        setTimeout(() => {
          if (data.user.rol === "conductor") {
            window.location.href = "/dashboard"
          } else {
            window.location.href = "/passenger"
          }
        }, 1500)
      } else {
        setMensaje("❌ " + (data.message || "Error de autenticación"))
      }
    } catch (err) {
      console.error(err)
      setMensaje("⚠️ Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-gray-900">Bienvenido de vuelta</h3>
        <p className="text-gray-500 mt-1">Ingresa tus credenciales para continuar</p>
      </div>

      {/* Selector de tipo de usuario */}
      <div className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => setUserType("passenger")}
          type="button"
          className={`inline-flex h-full flex-1 items-center justify-center gap-2 rounded-md px-3 py-1 text-sm font-medium transition-all ${
            userType === "passenger" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Pasajero
        </button>
        <button
          onClick={() => setUserType("driver")}
          type="button"
          className={`inline-flex h-full flex-1 items-center justify-center gap-2 rounded-md px-3 py-1 text-sm font-medium transition-all ${
            userType === "driver" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Conductor
        </button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Correo Corporativo</label>
          <input
            type="email"
            placeholder="tu.nombre@universidad.edu"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <button
          type="submit"
          className="w-full h-10 bg-[#16a34a] text-white rounded-md px-6 text-sm font-medium hover:bg-[#15803d] transition-colors"
          disabled={loading}
        >
          {loading
            ? "Cargando..."
            : `Iniciar Sesión como ${userType === "passenger" ? "Pasajero" : "Conductor"}`}
        </button>

        {mensaje && (
          <p
            className={`text-center text-sm mt-2 ${
              mensaje.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {mensaje}
          </p>
        )}
      </form>

      <div className="text-center">
        <button className="text-sm text-[#16a34a] hover:underline">¿Olvidaste tu contraseña?</button>
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"

export function PassengerRegisterForm() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    idUniversidad: "",
    correo: "",
    numeroContacto: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // Manejar cambios en inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  // Manejar foto de perfil
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setPhotoPreview(null)
  }

  // Enviar datos al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          idUniversidad: formData.idUniversidad,
          correo: formData.correo,
          numeroContacto: formData.numeroContacto,
          password: formData.password,
          rol: "pasajero",
          foto: photoPreview,
        }),
      })

      // Verificar si la respuesta es HTML (error del servidor)
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        throw new Error(`El servidor no está respondiendo correctamente. Verifica que el backend esté corriendo en ${apiUrl}. Error: ${text.substring(0, 100)}`)
      }

      const data = await response.json()

      if (response.ok) {
        setMessage("✅ Usuario registrado correctamente")
        setFormData({
          nombre: "",
          apellido: "",
          idUniversidad: "",
          correo: "",
          numeroContacto: "",
          password: "",
        })
        setPhotoPreview(null)
      } else {
        setMessage(`❌ Error: ${data.message || "No se pudo registrar"}`)
      }
    } catch (error: any) {
      console.error("Error de registro:", error)
      setMessage(`❌ Error de conexión: ${error.message || "Verifica que el servidor backend esté corriendo en http://localhost:3000"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            id="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Juan"
            required
            className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
            Apellido
          </label>
          <input
            id="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder="Pérez"
            required
            className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="idUniversidad" className="block text-sm font-medium text-gray-700">
          ID Universidad
        </label>
        <input
          id="idUniversidad"
          value={formData.idUniversidad}
          onChange={handleChange}
          placeholder="202012345"
          required
          className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
          Correo Corporativo
        </label>
        <input
          id="correo"
          type="email"
          value={formData.correo}
          onChange={handleChange}
          placeholder="juan.perez@universidad.edu"
          required
          className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="numeroContacto" className="block text-sm font-medium text-gray-700">
          Número de Contacto
        </label>
        <input
          id="numeroContacto"
          type="tel"
          value={formData.numeroContacto}
          onChange={handleChange}
          placeholder="+57 300 123 4567"
          required
          className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* Foto de perfil */}
      <div className="space-y-2">
        <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
          Foto de Perfil (Opcional)
        </label>
        {photoPreview ? (
          <div className="relative">
            <img src={photoPreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute top-2 right-2 h-9 w-9 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ) : (
          <label
            htmlFor="photo"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm text-gray-500">Subir foto</span>
            <input id="photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </label>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 bg-[#16a34a] text-white rounded-md px-6 text-sm font-medium hover:bg-[#15803d] transition-colors"
      >
        {loading ? "Registrando..." : "Registrarse como Pasajero"}
      </button>

      {message && (
        <p className={`text-sm mt-2 ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>{message}</p>
      )}
    </form>
  )
}

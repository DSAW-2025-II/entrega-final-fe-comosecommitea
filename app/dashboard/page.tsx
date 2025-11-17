"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function DriverDashboard() {
  const router = useRouter()
  const [startPoint, setStartPoint] = useState("")
  const [endPoint, setEndPoint] = useState("")
  const [route, setRoute] = useState("")
  const [departureTime, setDepartureTime] = useState("")
  const [availableSeats, setAvailableSeats] = useState("")
  const [farePerPassenger, setFarePerPassenger] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [myTrips, setMyTrips] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")
    
    if (!token || !userStr) {
      router.push("/")
      return
    }

    const userData = JSON.parse(userStr)
    setUser(userData)

    // Si no es conductor, redirigir
    if (userData.rol !== "conductor") {
      router.push("/passenger")
      return
    }

    // Cargar viajes del conductor
    loadMyTrips()
  }, [router])

  const loadMyTrips = async () => {
    try {
      const trips = await api.trips.getMyTrips()
      setMyTrips(trips)
    } catch (err) {
      console.error("Error cargando viajes:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Formatear la hora para el backend
      const hora = departureTime

      const tripData = {
        inicio: startPoint,
        destino: endPoint,
        ruta: route,
        hora,
        cupos: parseInt(availableSeats),
        tarifa: parseInt(farePerPassenger) || 6000,
      }

      await api.trips.create(tripData)
      setMessage("✅ Viaje creado exitosamente")
      
      // Limpiar formulario
      setStartPoint("")
      setEndPoint("")
      setRoute("")
      setDepartureTime("")
      setAvailableSeats("")
      setFarePerPassenger("")

      // Recargar viajes
      await loadMyTrips()
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message || "No se pudo crear el viaje"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <svg className="h-6 w-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Wheels</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-sm text-muted-foreground hover:text-foreground">Mis Viajes</button>
              <button className="text-sm text-muted-foreground hover:text-foreground">Historial</button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                <svg
                  className="h-5 w-5 text-secondary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Form Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Registrar Nuevo Viaje</h2>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                Completa la información de tu viaje para conectar con pasajeros
              </p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="space-y-5">
                {/* Route Section */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Información de Ruta
                  </h3>

                  <div className="space-y-2">
                    <label htmlFor="startPoint" className="text-sm font-medium text-foreground">
                      Punto de Inicio
                    </label>
                    <input
                      id="startPoint"
                      type="text"
                      value={startPoint}
                      onChange={(e) => setStartPoint(e.target.value)}
                      placeholder="Ej: Universidad Nacional, Bogotá"
                      className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="endPoint" className="text-sm font-medium text-foreground">
                      Punto Final
                    </label>
                    <input
                      id="endPoint"
                      type="text"
                      value={endPoint}
                      onChange={(e) => setEndPoint(e.target.value)}
                      placeholder="Ej: Centro Comercial Andino"
                      className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="route" className="text-sm font-medium text-foreground">
                      Ruta
                    </label>
                    <textarea
                      id="route"
                      value={route}
                      onChange={(e) => setRoute(e.target.value)}
                      placeholder="Describe la ruta que tomarás (opcional)"
                      rows={3}
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                    />
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Trip Details Section */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Detalles del Viaje
                  </h3>

                  <div className="space-y-2">
                    <label htmlFor="departureTime" className="text-sm font-medium text-foreground">
                      Hora de Salida
                    </label>
                    <input
                      id="departureTime"
                      type="datetime-local"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground shadow-sm transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="availableSeats" className="text-sm font-medium text-foreground">
                        Puestos Disponibles
                      </label>
                      <input
                        id="availableSeats"
                        type="number"
                        min="1"
                        max="8"
                        value={availableSeats}
                        onChange={(e) => setAvailableSeats(e.target.value)}
                        placeholder="4"
                        className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="farePerPassenger" className="text-sm font-medium text-foreground">
                        Tarifa por Pasajero
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          $
                        </span>
                        <input
                          id="farePerPassenger"
                          type="number"
                          min="0"
                          step="1000"
                          value={farePerPassenger}
                          onChange={(e) => setFarePerPassenger(e.target.value)}
                          placeholder="5000"
                          className="h-11 w-full rounded-lg border border-input bg-background pl-8 pr-4 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {loading ? "Publicando..." : "Publicar Viaje"}
                </button>

                {message && (
                  <p className={`text-sm text-center ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
                    {message}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Resumen</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Viajes Activos</p>
                      <p className="text-2xl font-bold text-foreground">{myTrips.filter(t => t.estado === "disponible").length}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Viajes</p>
                      <p className="text-2xl font-bold text-foreground">{myTrips.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mis Viajes Recientes */}
            {myTrips.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Mis Viajes</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {myTrips.slice(0, 5).map((trip) => (
                    <div key={trip._id} className="rounded-lg border border-border bg-background p-3">
                      <p className="text-sm font-semibold text-foreground">{trip.inicio} → {trip.destino}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {trip.cuposDisponibles}/{trip.cupos} cupos • ${trip.tarifa?.toLocaleString()}
                      </p>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                        trip.estado === "disponible" ? "bg-green-100 text-green-800" : 
                        trip.estado === "lleno" ? "bg-red-100 text-red-800" : 
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {trip.estado}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips Card */}
            <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h3 className="font-semibold text-foreground">Consejos</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Publica tus viajes con anticipación para más reservas</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Mantén tu vehículo limpio y en buen estado</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Sé puntual y comunícate con tus pasajeros</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

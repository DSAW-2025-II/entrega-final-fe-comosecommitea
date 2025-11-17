"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function PassengerDashboard() {
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState<"available" | "bookings">("available")
  const [trips, setTrips] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingTrips, setLoadingTrips] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState<any>(null)
  const [bookingData, setBookingData] = useState({ cuposReservados: 1, puntoRecogida: "" })
  const [message, setMessage] = useState<string | null>(null)

  const filters = useState({
    inicio: "",
    cuposDisponibles: "",
  })[0]

  const [filterState, setFilterState] = useState({
    inicio: "",
    cuposDisponibles: "",
  })

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }

    loadTrips()
    loadBookings()
  }, [router])

  const loadTrips = async () => {
    setLoadingTrips(true)
    try {
      const filters: any = {}
      if (filterState.inicio) filters.inicio = filterState.inicio
      if (filterState.cuposDisponibles) filters.cuposDisponibles = parseInt(filterState.cuposDisponibles)
      
      const tripsData = await api.trips.getAll(filters)
      setTrips(tripsData)
    } catch (err) {
      console.error("Error cargando viajes:", err)
      setMessage("Error cargando viajes")
    } finally {
      setLoadingTrips(false)
    }
  }

  const loadBookings = async () => {
    try {
      const bookingsData = await api.bookings.getMyBookings()
      setBookings(bookingsData)
    } catch (err) {
      console.error("Error cargando reservas:", err)
    }
  }

  const handleFilterApply = () => {
    loadTrips()
    setShowFilters(false)
  }

  const handleOpenBookingModal = (trip: any) => {
    setSelectedTrip(trip)
    setBookingData({ cuposReservados: 1, puntoRecogida: trip.inicio })
    setShowBookingModal(true)
  }

  const handleBooking = async () => {
    if (!selectedTrip) return

    if (!bookingData.puntoRecogida) {
      setMessage("❌ Debes especificar un punto de recogida")
      return
    }

    if (bookingData.cuposReservados > selectedTrip.cuposDisponibles) {
      setMessage(`❌ Solo hay ${selectedTrip.cuposDisponibles} cupos disponibles`)
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      await api.bookings.create({
        tripId: selectedTrip._id,
        cuposReservados: bookingData.cuposReservados,
        puntoRecogida: bookingData.puntoRecogida,
      })

      setMessage("✅ Reserva creada exitosamente")
      setShowBookingModal(false)
      await loadTrips()
      await loadBookings()
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message || "No se pudo crear la reserva"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("¿Estás seguro de cancelar esta reserva?")) return

    try {
      await api.bookings.cancel(bookingId)
      setMessage("✅ Reserva cancelada")
      await loadTrips()
      await loadBookings()
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message || "No se pudo cancelar la reserva"}`)
    }
  }

  const formatTime = (dateTime: string) => {
    try {
      const date = new Date(dateTime)
      return date.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
    } catch {
      return dateTime
    }
  }

  const formatDate = (dateTime: string) => {
    try {
      const date = new Date(dateTime)
      return date.toLocaleDateString("es-CO", { day: "numeric", month: "short" })
    } catch {
      return dateTime
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
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
              <button 
                onClick={() => {
                  localStorage.removeItem("token")
                  localStorage.removeItem("user")
                  router.push("/")
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cerrar Sesión
              </button>
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
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground">Encuentra tu Viaje</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Viaja seguro y económico con compañeros universitarios verificados
          </p>
        </div>

        {message && (
          <div className={`mb-4 rounded-lg p-3 ${
            message.startsWith("✅") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}>
            {message}
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="mb-6 flex items-center gap-4">
          <div className="inline-flex rounded-lg bg-muted p-1">
            <button
              onClick={() => setActiveTab("available")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "available"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Viajes Disponibles
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "bookings"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mis Reservas ({bookings.filter(b => b.estado !== "cancelado").length})
            </button>
          </div>

          {/* Filter Button */}
          {activeTab === "available" && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="ml-auto flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary/50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filtros
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && activeTab === "available" && (
          <div className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Personalizar Búsqueda</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Punto de Salida</label>
                <input
                  type="text"
                  value={filterState.inicio}
                  onChange={(e) => setFilterState({ ...filterState, inicio: e.target.value })}
                  placeholder="Buscar ubicación..."
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Cantidad de Cupos Disponibles (mínimo)</label>
                <input
                  type="number"
                  min="1"
                  value={filterState.cuposDisponibles}
                  onChange={(e) => setFilterState({ ...filterState, cuposDisponibles: e.target.value })}
                  placeholder="1"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={() => {
                    setFilterState({ inicio: "", cuposDisponibles: "" })
                    loadTrips()
                  }}
                  className="h-10 flex-1 rounded-lg border border-input bg-background text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary/50"
                >
                  Limpiar
                </button>
                <button
                  onClick={handleFilterApply}
                  className="h-10 flex-1 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Tabs */}
        {activeTab === "available" && (
          <div className="space-y-4">
            {loadingTrips ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Cargando viajes...</p>
              </div>
            ) : trips.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
                <p className="text-muted-foreground">No hay viajes disponibles</p>
              </div>
            ) : (
              trips.map((trip) => (
                <div
                  key={trip._id}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                    {/* Trip Info */}
                    <div className="space-y-4">
                      {/* Route */}
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-2 pt-1">
                          <div className="flex h-3 w-3 items-center justify-center rounded-full border-2 border-primary bg-primary" />
                          <div className="h-12 w-0.5 bg-border" />
                          <div className="flex h-3 w-3 items-center justify-center rounded-full border-2 border-accent bg-background" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Origen</p>
                            <p className="text-lg font-semibold text-foreground">{trip.inicio}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Destino</p>
                            <p className="text-lg font-semibold text-foreground">{trip.destino}</p>
                          </div>
                        </div>
                      </div>

                      {/* Route Details */}
                      {trip.ruta && (
                        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
                          <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                            />
                          </svg>
                          <span className="text-sm text-muted-foreground">Ruta: {trip.ruta}</span>
                        </div>
                      )}

                      {/* Trip Details */}
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div>
                            <p className="text-xs text-muted-foreground">Salida</p>
                            <p className="text-sm font-semibold text-foreground">
                              {formatDate(trip.hora)} - {formatTime(trip.hora)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <div>
                            <p className="text-xs text-muted-foreground">Puestos</p>
                            <p className="text-sm font-semibold text-foreground">{trip.cuposDisponibles} disponibles</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div>
                            <p className="text-xs text-muted-foreground">Tarifa</p>
                            <p className="text-sm font-semibold text-foreground">${trip.tarifa?.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Driver Info & Action */}
                    <div className="space-y-4">
                      <div className="rounded-lg border border-border bg-secondary/30 p-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Conductor
                        </p>
                        <div className="mb-3 flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <svg
                              className="h-7 w-7 text-primary"
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
                          <div>
                            <p className="font-semibold text-foreground">
                              {trip.conductor?.nombre} {trip.conductor?.apellido}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <span>{trip.conductor?.numeroContacto}</span>
                          </div>
                          {trip.conductor?.marca && trip.conductor?.modelo && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                                />
                              </svg>
                              <span>{trip.conductor.marca} {trip.conductor.modelo}</span>
                            </div>
                          )}
                          {trip.conductor?.placaVehiculo && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 7h18M5 7V5a2 2 0 012-2h10a2 2 0 012 2v2m1 0v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7m3 4h.01m3 0h.01"
                                />
                              </svg>
                              <span>Placa: {trip.conductor.placaVehiculo}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenBookingModal(trip)}
                        disabled={trip.estado === "lleno" || trip.cuposDisponibles === 0}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reservar Viaje
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-4">
            {bookings.filter(b => b.estado !== "cancelado").length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
                <div className="mx-auto max-w-md">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                    <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">No tienes reservas activas</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Cuando reserves un viaje, aparecerá aquí con toda la información y detalles del conductor.
                  </p>
                </div>
              </div>
            ) : (
              bookings
                .filter(b => b.estado !== "cancelado")
                .map((booking) => (
                  <div
                    key={booking._id}
                    className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-4">
                          <p className="text-lg font-semibold text-foreground">
                            {booking.trip?.inicio} → {booking.trip?.destino}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatDate(booking.trip?.hora)} - {formatTime(booking.trip?.hora)}
                          </p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Cupos reservados:</span> {booking.cuposReservados}</p>
                          <p><span className="font-medium">Punto de recogida:</span> {booking.puntoRecogida}</p>
                          <p><span className="font-medium">Tarifa total:</span> ${(booking.trip?.tarifa * booking.cuposReservados)?.toLocaleString()}</p>
                          {booking.trip?.conductor && (
                            <p>
                              <span className="font-medium">Conductor:</span> {booking.trip.conductor.nombre} {booking.trip.conductor.apellido} - {booking.trip.conductor.numeroContacto}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="ml-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {showBookingModal && selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-semibold text-foreground">Reservar Viaje</h3>
            
            <div className="mb-4 space-y-2">
              <p className="text-sm text-muted-foreground">Ruta:</p>
              <p className="font-semibold text-foreground">{selectedTrip.inicio} → {selectedTrip.destino}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Cantidad de cupos a reservar
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedTrip.cuposDisponibles}
                  value={bookingData.cuposReservados}
                  onChange={(e) => setBookingData({ ...bookingData, cuposReservados: parseInt(e.target.value) || 1 })}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Cupos disponibles: {selectedTrip.cuposDisponibles}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Punto de recogida
                </label>
                <input
                  type="text"
                  value={bookingData.puntoRecogida}
                  onChange={(e) => setBookingData({ ...bookingData, puntoRecogida: e.target.value })}
                  placeholder="Ej: Universidad Nacional, entrada principal"
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleBooking}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? "Reservando..." : "Confirmar Reserva"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

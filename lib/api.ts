// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = {
  baseURL: API_BASE_URL,
  
  async request(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Error desconocido" }));
      throw new Error(error.message || `Error ${response.status}`);
    }

    return response.json();
  },

  // Auth endpoints
  auth: {
    login: (correo: string, password: string) =>
      api.request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ correo, password }),
      }),
    register: (data: any) =>
      api.request("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // User endpoints
  users: {
    getMe: () => api.request("/api/users/me"),
    updateProfile: (data: any) =>
      api.request("/api/users/me", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    changeRole: (newRole: string) =>
      api.request("/api/users/change-role", {
        method: "POST",
        body: JSON.stringify({ newRole }),
      }),
  },

  // Trip endpoints
  trips: {
    getAll: (filters?: { inicio?: string; cuposDisponibles?: number }) => {
      const params = new URLSearchParams();
      if (filters?.inicio) params.append("inicio", filters.inicio);
      if (filters?.cuposDisponibles) params.append("cuposDisponibles", filters.cuposDisponibles.toString());
      return api.request(`/api/trips?${params.toString()}`);
    },
    getById: (id: string) => api.request(`/api/trips/${id}`),
    create: (data: any) =>
      api.request("/api/trips", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getMyTrips: () => api.request("/api/trips/my/trips"),
    update: (id: string, data: any) =>
      api.request(`/api/trips/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    cancel: (id: string) =>
      api.request(`/api/trips/${id}`, {
        method: "DELETE",
      }),
  },

  // Booking endpoints
  bookings: {
    create: (data: { tripId: string; cuposReservados: number; puntoRecogida: string }) =>
      api.request("/api/bookings", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getMyBookings: () => api.request("/api/bookings/my"),
    cancel: (bookingId: string) =>
      api.request(`/api/bookings/${bookingId}/cancel`, {
        method: "PUT",
      }),
  },
};


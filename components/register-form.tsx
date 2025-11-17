"use client"

import { useState } from "react"
import { PassengerRegisterForm } from "../components/passenger-register-form";
import { DriverRegisterForm } from "../components/driver-register-form";
export function RegisterForm() {
  const [userType, setUserType] = useState<"passenger" | "driver">("passenger")

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-gray-900">Crear cuenta</h3>
        <p className="text-gray-500 mt-1">Únete a la comunidad Wheels</p>
      </div>

      <div>
        <div className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setUserType("passenger")}
            className={`inline-flex h-full flex-1 items-center justify-center gap-2 rounded-md px-3 py-1 text-sm font-medium transition-all ${
              userType === "passenger" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Pasajero
          </button>
          <button
            onClick={() => setUserType("driver")}
            className={`inline-flex h-full flex-1 items-center justify-center gap-2 rounded-md px-3 py-1 text-sm font-medium transition-all ${
              userType === "driver" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            Conductor
          </button>
        </div>

        <div className="mt-6">
          {userType === "passenger" && <PassengerRegisterForm />}
          {userType === "driver" && <DriverRegisterForm />}
        </div>
      </div>
    </div>
  )
}

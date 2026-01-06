/**
 * OwnerDashboardScreen.tsx
 * 
 * Pantalla principal (Dashboard) para el dueño de mascotas.
 * Muestra acciones rápidas, lista de mascotas y próximos turnos.
 */

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Plus, Calendar, FileText, ChevronRight, LogOut, MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Screen, Pet, Branch, Appointment } from "../App";

interface OwnerDashboardScreenProps {
  onNavigate: (screen: Screen, petId?: string) => void;
  onLogout: () => void;
  userName: string;
  selectedBranch: Branch;
  pets: Pet[];
  appointments: Appointment[];
}

export function OwnerDashboardScreen({
  onNavigate,
  onLogout,
  userName,
  selectedBranch,
  pets,
  appointments
}: OwnerDashboardScreenProps) {
  return (
    <div className="h-full flex flex-col bg-emerald-50">
      {/* Header */}
      <div className="bg-emerald-600 px-6 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-white">Hola, {userName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="size-4 text-emerald-100" />
              <p className="text-emerald-100">{selectedBranch.name}</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="ghost"
            className="text-white hover:bg-emerald-700 rounded-xl h-10 px-3"
          >
            <LogOut className="size-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Quick Actions */}
        <div>
          <h2 className="text-emerald-900 mb-3">Acciones Rápidas</h2>
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => onNavigate("petList")}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 rounded-xl border-emerald-300 bg-white hover:bg-emerald-50 hover:border-emerald-400"
            >
              <Plus className="size-5 text-emerald-600" />
              <span className="text-emerald-800">Agregar Mascota</span>
            </Button>
            <Button
              onClick={() => onNavigate("appointment")}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 rounded-xl border-emerald-300 bg-white hover:bg-emerald-50 hover:border-emerald-400"
            >
              <Calendar className="size-5 text-emerald-600" />
              <span className="text-emerald-800">Agendar Turno</span>
            </Button>
            <Button
              onClick={() => onNavigate("medicalHistory")}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 rounded-xl border-emerald-300 bg-white hover:bg-emerald-50 hover:border-emerald-400"
            >
              <FileText className="size-5 text-emerald-600" />
              <span className="text-emerald-800">Historial</span>
            </Button>
          </div>
        </div>

        {/* My Pets */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-emerald-900">Mis Mascotas</h2>
            <button
              onClick={() => onNavigate("petList")}
              className="text-emerald-600 hover:text-emerald-800"
            >
              Ver todas
            </button>
          </div>
          <div className="space-y-3">
            {pets.slice(0, 2).map((pet) => (
              <Card
                key={pet.id}
                className="p-4 rounded-xl border-emerald-200 bg-white hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onNavigate("petProfile", pet.id)}
              >
                <div className="flex items-center gap-4">
                  <ImageWithFallback
                    src={pet.image}
                    alt={pet.name}
                    className="size-16 rounded-full object-cover border-2 border-emerald-100"
                  />
                  <div className="flex-1">
                    <h3 className="text-emerald-900">{pet.name}</h3>
                    <p className="text-emerald-700">{pet.species} • {pet.age} años</p>
                  </div>
                  <ChevronRight className="size-5 text-emerald-400" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <h2 className="text-emerald-900 mb-3">Próximos Turnos</h2>
          {appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="p-4 rounded-xl border-emerald-200 bg-white">
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 rounded-lg p-3">
                      <Calendar className="size-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-emerald-900">{appointment.petName}</h3>
                      <p className="text-emerald-700">{appointment.date} • {appointment.time}</p>
                      <p className="text-emerald-600">{appointment.vetName}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 rounded-xl border-emerald-200 bg-white text-center">
              <p className="text-emerald-600">No tenés turnos próximos</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

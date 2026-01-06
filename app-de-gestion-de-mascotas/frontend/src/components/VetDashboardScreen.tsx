/**
 * VetDashboardScreen.tsx
 * 
 * Pantalla principal (Dashboard) para el veterinario.
 * Muestra estadísticas del día, acciones rápidas y lista de turnos de hoy.
 */

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Calendar, FileText, LogOut, Clock, User, MapPin, Stethoscope } from "lucide-react";
import type { Screen, Branch, Appointment } from "../App";

interface VetDashboardScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  vetName: string;
  selectedBranch: Branch;
  appointments: Appointment[];
}

export function VetDashboardScreen({
  onNavigate,
  onLogout,
  vetName,
  selectedBranch,
  appointments
}: VetDashboardScreenProps) {
  return (
    <div className="h-full flex flex-col bg-emerald-50">
      {/* Header */}
      <div className="bg-emerald-600 px-6 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-white">Dr. {vetName}</h1>
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
        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 rounded-xl border-emerald-200 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-lg p-3">
                <Calendar className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-emerald-600">Hoy</p>
                <h3 className="text-emerald-900">{appointments.length} turnos</h3>
              </div>
            </div>
          </Card>
          <Card className="p-4 rounded-xl border-emerald-200 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-lg p-3">
                <FileText className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-emerald-600">Atendidos</p>
                <h3 className="text-emerald-900">8 pacientes</h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-emerald-900 mb-3">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => onNavigate("registerDiagnosis")}
              className="h-20 flex flex-col items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700"
            >
              <Stethoscope className="size-5" />
              <span>Registrar Diagnóstico</span>
            </Button>
            <Button
              onClick={() => onNavigate("medicalHistory")}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 rounded-xl border-emerald-300 bg-white hover:bg-emerald-50"
            >
              <FileText className="size-5 text-emerald-600" />
              <span className="text-emerald-800">Ver Historial</span>
            </Button>
          </div>
        </div>

        {/* Today's Appointments */}
        <div>
          <h2 className="text-emerald-900 mb-3">Turnos de Hoy</h2>
          {appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="p-4 rounded-xl border-emerald-200 bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 rounded-lg p-3">
                      <Clock className="size-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-emerald-900">{appointment.petName}</h3>
                        <span className={`text-emerald-600 px-2 py-1 rounded-lg text-sm ${appointment.status === "Confirmado"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                          }`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-700 mb-1">
                        <User className="size-4" />
                        <span>{appointment.ownerName}</span>
                      </div>
                      <p className="text-emerald-700">{appointment.time}</p>
                      <p className="text-emerald-600">{appointment.reason}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 rounded-xl border-emerald-200 bg-white text-center">
              <p className="text-emerald-600">No hay turnos programados para hoy</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

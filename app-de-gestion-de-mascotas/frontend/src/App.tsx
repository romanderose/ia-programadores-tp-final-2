/**
 * App.tsx
 * 
 * Componente raíz que maneja el enrutamiento manual (navegación) y el estado global de la sesión.
 * Gestiona qué pantalla se muestra al usuario según su rol y acción actual.
 */

import { useState } from "react";
import { Login } from "./components/Login";
import { Registro } from "./components/Registro";
import { DashboardDueno } from "./components/DashboardDueno";
import { AgendarTurnoStep1 } from "./components/AgendarTurnoStep1";
import { SeleccionSucursal } from "./components/SeleccionSucursal";
import { ElegirVeterinario } from "./components/ElegirVeterinario";
import { ElegirHorario } from "./components/ElegirHorario";
import { ConfirmarTurno } from "./components/ConfirmarTurno";
import { Mascotas } from "./components/Mascotas";
import { HistorialClinico } from "./components/HistorialClinico";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

export type UserRole = "dueno" | "veterinario" | null;

export type Screen =
  | "login"
  | "registro"
  | "dashboard-dueno"
  | "mascotas"
  | "mascotas-create"
  | "historial"
  | "agendar-step1"
  | "seleccion-sucursal"
  | "elegir-veterinario"
  | "elegir-horario"
  | "confirmar-turno"
  | "dashboard"
  | "petList"
  | "petProfile"
  | "medicalHistory"
  | "registerDiagnosis"
  | "appointment";

export interface Mascota {
  id: string;
  nombre: string;
  tipo: string;
  raza: string;
  edad: string;
  foto?: string;
}

export interface Sucursal {
  id: string;
  nombre: string;
  direccion: string;
  horario: string;
}

export interface Veterinario {
  id: string;
  nombre: string;
  especialidad: string;
  sucursalId: string;
  foto?: string;
}

export interface Turno {
  id: string;
  mascotaId: string;
  veterinarioId: string;
  sucursalId: string;
  fecha: string;
  hora: string;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string | number;
  image?: string;
  birthDate?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  schedule: string;
}

export interface Appointment {
  id: string;
  petName: string;
  ownerName: string;
  status: string;
  time: string;
  reason: string;
  date: string;
  vetName: string;
}

function AppContent() {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("login");
  const [userRole, setUserRole] = useState<UserRole>(null);
  const { colors } = useTheme();

  // Estado para el flujo de agendamiento
  const [selectedMascota, setSelectedMascota] = useState<
    string | null
  >(null);
  const [selectedSucursal, setSelectedSucursal] = useState<
    string | null
  >(null);
  const [selectedVeterinario, setSelectedVeterinario] =
    useState<string | null>(null);
  const [selectedFecha, setSelectedFecha] = useState<
    string | null
  >(null);
  const [selectedHora, setSelectedHora] = useState<
    string | null
  >(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === "dueno") {
      setCurrentScreen("dashboard-dueno");
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentScreen("login");
    // Reset appointment flow
    setSelectedMascota(null);
    setSelectedSucursal(null);
    setSelectedVeterinario(null);
    setSelectedFecha(null);
    setSelectedHora(null);
  };

  const handleStartAppointment = () => {
    setSelectedMascota(null);
    setSelectedSucursal(null);
    setSelectedVeterinario(null);
    setSelectedFecha(null);
    setSelectedHora(null);
    setCurrentScreen("agendar-step1");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return <Login onLogin={handleLogin} onNavigateToRegister={() => setCurrentScreen("registro")} />;

      case "registro":
        return <Registro onBack={() => setCurrentScreen("login")} />;

      case "dashboard-dueno":
        return (
          <DashboardDueno
            onNavigate={setCurrentScreen}
            onStartAppointment={handleStartAppointment}
            onLogout={handleLogout}
          />
        );

      case "mascotas":
        return (
          <Mascotas
            onBack={() => setCurrentScreen("dashboard-dueno")}
            initialMode="list"
          />
        );

      case "mascotas-create":
        return (
          <Mascotas
            onBack={() => setCurrentScreen("dashboard-dueno")}
            initialMode="create"
          />
        );

      case "historial":
        return (
          <HistorialClinico
            onBack={() => setCurrentScreen("dashboard-dueno")}
          />
        );

      case "agendar-step1":
        return (
          <AgendarTurnoStep1
            selectedMascota={selectedMascota}
            onSelectMascota={setSelectedMascota}
            onNext={() =>
              setCurrentScreen("seleccion-sucursal")
            }
            onBack={() => setCurrentScreen("dashboard-dueno")}
          />
        );

      case "seleccion-sucursal":
        return (
          <SeleccionSucursal
            onSelectSucursal={(sucursalId) => {
              setSelectedSucursal(sucursalId);
              setCurrentScreen("elegir-veterinario");
            }}
            onBack={() => setCurrentScreen("agendar-step1")}
          />
        );

      case "elegir-veterinario":
        return (
          <ElegirVeterinario
            sucursalId={selectedSucursal!}
            onSelectVeterinario={(vetId) => {
              setSelectedVeterinario(vetId);
              setCurrentScreen("elegir-horario");
            }}
            onBack={() =>
              setCurrentScreen("seleccion-sucursal")
            }
          />
        );

      case "elegir-horario":
        return (
          <ElegirHorario
            veterinarioId={selectedVeterinario!}
            sucursalId={selectedSucursal!}
            onSelectHorario={(fecha, hora) => {
              setSelectedFecha(fecha);
              setSelectedHora(hora);
              setCurrentScreen("confirmar-turno");
            }}
            onBack={() =>
              setCurrentScreen("elegir-veterinario")
            }
          />
        );

      case "confirmar-turno":
        return (
          <ConfirmarTurno
            mascotaId={selectedMascota!}
            veterinarioId={selectedVeterinario!}
            sucursalId={selectedSucursal!}
            fecha={selectedFecha!}
            hora={selectedHora!}
            onConfirm={() =>
              setCurrentScreen("dashboard-dueno")
            }
            onBack={() => setCurrentScreen("elegir-horario")}
          />
        );

      default:
        return <Login onLogin={handleLogin} onNavigateToRegister={() => setCurrentScreen("registro")} />;
    }
  };

  return (
    <div className={`min-h-screen ${colors.background} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">{renderScreen()}</div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
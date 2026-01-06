import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, FileText, Plus, Calendar } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Screen, Pet } from "../App";

interface PetProfileScreenProps {
  onNavigate: (screen: Screen, petId?: string) => void;
  pet: Pet;
}

export function PetProfileScreen({ onNavigate, pet }: PetProfileScreenProps) {
  return (
    <div className="h-full flex flex-col bg-emerald-50">
      {/* Header */}
      <div className="bg-emerald-600 px-6 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("petList")}
            className="text-white hover:bg-emerald-700 rounded-lg p-1"
          >
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="text-white">Perfil de Mascota</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Pet Photo and Name */}
        <div className="flex flex-col items-center">
          <ImageWithFallback
            src={pet.image}
            alt={pet.name}
            className="size-32 rounded-full object-cover mb-4 border-4 border-white shadow-lg"
          />
          <h1 className="text-emerald-900">{pet.name}</h1>
          <p className="text-emerald-700">{pet.species}</p>
        </div>

        {/* Basic Information */}
        <Card className="p-5 rounded-xl border-emerald-200 bg-white shadow-sm">
          <h2 className="text-emerald-900 mb-4">Información Básica</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-emerald-100">
              <span className="text-emerald-700">Especie</span>
              <span className="text-emerald-900">{pet.species}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-emerald-100">
              <span className="text-emerald-700">Raza</span>
              <span className="text-emerald-900">{pet.breed}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-emerald-100">
              <span className="text-emerald-700">Edad</span>
              <span className="text-emerald-900">{pet.age} años</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-emerald-700">Fecha de Nacimiento</span>
              <span className="text-emerald-900">{pet.birthDate}</span>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => onNavigate("medicalHistory", pet.id)}
            className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-3 shadow-md"
          >
            <FileText className="size-5" />
            Historial Clínico
          </Button>
          <Button
            variant="outline"
            className="w-full h-14 rounded-xl border-emerald-300 bg-white hover:bg-emerald-50 flex items-center justify-center gap-3"
          >
            <Plus className="size-5 text-emerald-600" />
            <span className="text-emerald-800">Nuevo Registro</span>
          </Button>
          <Button
            onClick={() => onNavigate("appointment")}
            variant="outline"
            className="w-full h-14 rounded-xl border-emerald-300 bg-white hover:bg-emerald-50 flex items-center justify-center gap-3"
          >
            <Calendar className="size-5 text-emerald-600" />
            <span className="text-emerald-800">Agendar Turno</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

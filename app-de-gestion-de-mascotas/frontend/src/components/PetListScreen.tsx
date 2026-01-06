/**
 * PetListScreen.tsx
 * 
 * Pantalla de listado de mascotas del usuario.
 * Permite navegar al perfil de cada mascota o agregar una nueva.
 */

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Screen, Pet } from "../App";

interface PetListScreenProps {
  onNavigate: (screen: Screen, petId?: string) => void;
  pets: Pet[];
}

export function PetListScreen({ onNavigate, pets }: PetListScreenProps) {
  return (
    <div className="h-full flex flex-col bg-emerald-50">
      {/* Header */}
      <div className="bg-emerald-600 px-6 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-white hover:bg-emerald-700 rounded-lg p-1"
          >
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="text-white">Mis Mascotas</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-4">
          {pets.map((pet) => (
            <Card key={pet.id} className="p-5 rounded-xl border-emerald-200 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <ImageWithFallback
                  src={pet.image}
                  alt={pet.name}
                  className="size-20 rounded-full object-cover border-2 border-emerald-100"
                />
                <div className="flex-1">
                  <h2 className="text-emerald-900">{pet.name}</h2>
                  <p className="text-emerald-700">{pet.species}</p>
                  <p className="text-emerald-600">{pet.age} años</p>
                </div>
              </div>
              <Button
                onClick={() => onNavigate("petProfile", pet.id)}
                variant="outline"
                className="w-full rounded-xl border-emerald-300 bg-white hover:bg-emerald-50"
              >
                Ver perfil
              </Button>
            </Card>
          ))}

          {/* Add Pet Card */}
          <Card className="p-5 rounded-xl border-dashed border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer">
            <button className="w-full flex flex-col items-center justify-center gap-3 py-6">
              <div className="bg-emerald-200 rounded-full p-4">
                <Plus className="size-8 text-emerald-700" />
              </div>
              <span className="text-emerald-800">Agregar nueva mascota</span>
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

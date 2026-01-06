import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft, MapPin } from "lucide-react";
import { Card } from "./ui/card";
import type { Screen, Pet, Branch } from "../App";

interface AppointmentScreenProps {
  onNavigate: (screen: Screen) => void;
  pets: Pet[];
  selectedBranch: Branch;
}

export function AppointmentScreen({ onNavigate, pets, selectedBranch }: AppointmentScreenProps) {
  const [selectedPet, setSelectedPet] = useState("");
  const [selectedVet, setSelectedVet] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  // Veterinarios filtrados por sucursal
  const veterinariansByBranch: Record<string, Array<{ id: string; name: string }>> = {
    "1": [
      { id: "1", name: "Dr. García" },
      { id: "2", name: "Dra. Martínez" }
    ],
    "2": [
      { id: "3", name: "Dr. Rodríguez" },
      { id: "4", name: "Dra. López" }
    ],
    "3": [
      { id: "5", name: "Dr. Fernández" },
      { id: "6", name: "Dra. Pérez" }
    ]
  };

  const veterinarians = veterinariansByBranch[selectedBranch.id] || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Turno confirmado exitosamente");
    onNavigate("dashboard");
  };

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
          <h1 className="text-white">Agendar Turno</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Branch Info */}
        <Card className="p-4 rounded-xl border-emerald-200 bg-white shadow-sm mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="size-5 text-emerald-600" />
            <div>
              <p className="text-emerald-600">Sucursal</p>
              <h3 className="text-emerald-900">{selectedBranch.name}</h3>
            </div>
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Select Pet */}
          <div className="space-y-2">
            <Label htmlFor="pet" className="text-emerald-900">
              Seleccionar Mascota
            </Label>
            <Select value={selectedPet} onValueChange={setSelectedPet} required>
              <SelectTrigger className="h-12 rounded-xl border-emerald-200 bg-white">
                <SelectValue placeholder="Elegí una mascota" />
              </SelectTrigger>
              <SelectContent>
                {pets.map((pet) => (
                  <SelectItem key={pet.id} value={pet.id}>
                    {pet.name} ({pet.species})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Select Veterinarian */}
          <div className="space-y-2">
            <Label htmlFor="vet" className="text-emerald-900">
              Seleccionar Veterinario
            </Label>
            <Select value={selectedVet} onValueChange={setSelectedVet} required>
              <SelectTrigger className="h-12 rounded-xl border-emerald-200 bg-white">
                <SelectValue placeholder="Elegí un veterinario" />
              </SelectTrigger>
              <SelectContent>
                {veterinarians.map((vet) => (
                  <SelectItem key={vet.id} value={vet.id}>
                    {vet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-emerald-900">
              Fecha
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="h-12 rounded-xl border-emerald-200 bg-white"
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="time" className="text-emerald-900">
              Hora
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="h-12 rounded-xl border-emerald-200 bg-white"
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-emerald-900">
              Motivo de la Consulta
            </Label>
            <Textarea
              id="reason"
              placeholder="Describí el motivo de la visita..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="min-h-[100px] rounded-xl border-emerald-200 bg-white"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-md"
          >
            Confirmar Turno
          </Button>
        </form>
      </div>
    </div>
  );
}

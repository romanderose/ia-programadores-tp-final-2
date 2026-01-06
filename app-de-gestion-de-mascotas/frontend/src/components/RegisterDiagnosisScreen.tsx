/**
 * RegisterDiagnosisScreen.tsx
 * 
 * Pantalla para que el veterinario registre un nuevo diagnóstico.
 * Incluye formulario para seleccionar mascota, ingresar diagnóstico, tratamiento y adjuntar archivos.
 */

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft, Upload, FileText } from "lucide-react";
import type { Screen, Pet } from "../App";

interface RegisterDiagnosisScreenProps {
  onNavigate: (screen: Screen) => void;
  pets: Pet[];
}

export function RegisterDiagnosisScreen({ onNavigate, pets }: RegisterDiagnosisScreenProps) {
  const [selectedPet, setSelectedPet] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Diagnóstico registrado exitosamente");
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
          <h1 className="text-white">Registrar Diagnóstico</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Select Pet */}
          <div className="space-y-2">
            <Label htmlFor="pet" className="text-emerald-900">
              Mascota Atendida
            </Label>
            <Select value={selectedPet} onValueChange={setSelectedPet} required>
              <SelectTrigger className="h-12 rounded-xl border-emerald-200 bg-white">
                <SelectValue placeholder="Elegí la mascota" />
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

          {/* Diagnosis */}
          <div className="space-y-2">
            <Label htmlFor="diagnosis" className="text-emerald-900">
              Diagnóstico
            </Label>
            <Input
              id="diagnosis"
              type="text"
              placeholder="Ej: Vacunación anual, Control de rutina..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
              className="h-12 rounded-xl border-emerald-200 bg-white"
            />
          </div>

          {/* Treatment */}
          <div className="space-y-2">
            <Label htmlFor="treatment" className="text-emerald-900">
              Tratamiento
            </Label>
            <Textarea
              id="treatment"
              placeholder="Describí el tratamiento indicado, medicación, recomendaciones..."
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              required
              className="min-h-[120px] rounded-xl border-emerald-200 bg-white"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file" className="text-emerald-900">
              Adjuntar Archivo (Opcional)
            </Label>
            <div className="relative">
              <input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file"
                className="flex items-center justify-center gap-3 h-12 rounded-xl border-2 border-dashed border-emerald-300 bg-white hover:bg-emerald-50 cursor-pointer transition-colors"
              >
                <Upload className="size-5 text-emerald-600" />
                <span className="text-emerald-800">
                  {fileName || "Seleccionar archivo"}
                </span>
              </label>
            </div>
            {fileName && (
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-100 px-3 py-2 rounded-lg">
                <FileText className="size-4" />
                <span className="text-emerald-800">{fileName}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-md"
          >
            Guardar Diagnóstico
          </Button>
        </form>
      </div>
    </div>
  );
}

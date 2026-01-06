/**
 * MedicalHistoryScreen.tsx
 * 
 * Pantalla que muestra el historial clínico de una mascota.
 * Permite visualizar diagnósticos pasados y agregar nuevos registros.
 */

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Plus, Paperclip } from "lucide-react";
import type { Screen, Pet } from "../App";

interface MedicalHistoryScreenProps {
  onNavigate: (screen: Screen, petId?: string) => void;
  pet: Pet;
}

export function MedicalHistoryScreen({ onNavigate, pet }: MedicalHistoryScreenProps) {
  const medicalRecords = [
    {
      id: "1",
      date: "2025-11-15",
      diagnosis: "Vacunación anual",
      treatment: "Vacuna antirrábica y polivalente. Control general satisfactorio. Peso: 28kg.",
      attachments: 1,
      vet: "Dr. García"
    },
    {
      id: "2",
      date: "2025-09-20",
      diagnosis: "Control de rutina",
      treatment: "Examen físico completo. Estado general excelente. Se recomienda continuar con la alimentación actual.",
      attachments: 0,
      vet: "Dra. Martínez"
    },
    {
      id: "3",
      date: "2025-06-10",
      diagnosis: "Desparasitación",
      treatment: "Administración de antiparasitario interno. Recomendación de repetir en 3 meses.",
      attachments: 0,
      vet: "Dr. García"
    },
    {
      id: "4",
      date: "2025-03-05",
      diagnosis: "Otitis leve",
      treatment: "Limpieza de oído. Prescripción de gotas óticas por 7 días. Control en 10 días.",
      attachments: 2,
      vet: "Dra. López"
    }
  ];

  return (
    <div className="h-full flex flex-col bg-emerald-50">
      {/* Header */}
      <div className="bg-emerald-600 px-6 py-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => onNavigate("petProfile", pet.id)}
            className="text-white hover:bg-emerald-700 rounded-lg p-1"
          >
            <ArrowLeft className="size-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-white">Historial Clínico</h1>
            <p className="text-emerald-100">{pet.name}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {medicalRecords.map((record) => (
          <Card key={record.id} className="p-5 rounded-xl border-emerald-200 bg-white shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-emerald-900">{record.diagnosis}</h3>
                <p className="text-emerald-600">{record.date}</p>
              </div>
              {record.attachments > 0 && (
                <div className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                  <Paperclip className="size-4" />
                  <span className="text-emerald-700">{record.attachments}</span>
                </div>
              )}
            </div>
            <p className="text-emerald-800 mb-3">{record.treatment}</p>
            <p className="text-emerald-600">{record.vet}</p>
          </Card>
        ))}
      </div>

      {/* Add Button */}
      <div className="p-6 bg-white border-t border-emerald-200">
        <Button className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-3 shadow-md">
          <Plus className="size-5" />
          Agregar Entrada
        </Button>
      </div>
    </div>
  );
}

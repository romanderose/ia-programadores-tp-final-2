import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { MapPin, Clock } from "lucide-react";
import type { Branch } from "../App";

interface BranchSelectionScreenProps {
  branches: Branch[];
  onSelectBranch: (branchId: string) => void;
}

export function BranchSelectionScreen({ branches, onSelectBranch }: BranchSelectionScreenProps) {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-emerald-600 px-6 py-8 rounded-b-3xl shadow-lg">
        <h1 className="text-white text-center">Elegí una sucursal</h1>
        <p className="text-emerald-100 text-center mt-2">Seleccioná la más cercana a vos</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="space-y-4">
          {branches.map((branch) => (
            <Card key={branch.id} className="p-5 rounded-2xl border-emerald-200 bg-white shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-emerald-900 mb-3">{branch.name}</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-emerald-700">{branch.address}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="size-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-emerald-700">{branch.schedule}</p>
                </div>
              </div>

              <Button
                onClick={() => onSelectBranch(branch.id)}
                className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700"
              >
                Seleccionar
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

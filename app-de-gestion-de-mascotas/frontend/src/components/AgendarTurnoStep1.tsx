import { ChevronLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface AgendarTurnoStep1Props {
  selectedMascota: string | null;
  onSelectMascota: (mascotaId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

import { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';

interface Mascota {
  id: string;
  nombre: string;
  tipo: string;
  raza: string;
  foto?: string;
}

export function AgendarTurnoStep1({
  selectedMascota,
  onSelectMascota,
  onNext,
  onBack
}: AgendarTurnoStep1Props) {
  const { colors } = useTheme();
  const [mascotas, setMascotas] = useState<Mascota[]>([]);

  useEffect(() => {
    apiService.getMascotas().then(data => {
      // adapt string id to number if needed, but ConfirmarTurno sends whatever.
      // API returns numeric IDs usually, but let's just use what we get.
      // The previous interfaces used string for ID, let's cast or keep consistent
      setMascotas(data.map((m: any) => ({ ...m, id: String(m.id) })));
    });
  }, []);

  const handleNext = () => {
    if (selectedMascota) {
      onNext();
    }
  };

  return (
    <div className={`${colors.cardBg} rounded-3xl shadow-sm p-6 w-full min-h-[600px]`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className={`p-2 ${colors.secondary} ${colors.secondaryHover} rounded-xl transition-colors`}
        >
          <ChevronLeft className={`w-6 h-6 ${colors.text}`} />
        </button>
        <div>
          <h1 className={colors.text}>Agendar Turno</h1>
          <p className={colors.textSecondary}>Paso 1 de 4</p>
        </div>
      </div>

      {/* Selector de Mascota */}
      <div className="mb-8">
        <h2 className={`${colors.text} mb-4`}>Selecciona tu mascota</h2>
        <div className="space-y-3">
          {mascotas.map((mascota) => (
            <button
              key={mascota.id}
              onClick={() => onSelectMascota(mascota.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${selectedMascota === mascota.id
                  ? `${colors.primary} text-white shadow-lg`
                  : `${colors.inputBg} ${colors.secondaryHover} border ${colors.inputBorder}`
                }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${selectedMascota === mascota.id ? 'bg-white/20' : colors.secondary
                }`}>
                {mascota.foto || '🐕'}
              </div>
              <div className="flex-1 text-left">
                <h3 className={selectedMascota === mascota.id ? 'text-white' : colors.text}>
                  {mascota.nombre}
                </h3>
                <p className={selectedMascota === mascota.id ? 'text-white/80' : colors.textSecondary}>
                  {mascota.raza}
                </p>
              </div>
              {selectedMascota === mascota.id && (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className={`mb-8 p-4 ${colors.inputBg} rounded-2xl border ${colors.inputBorder}`}>
        <p className={colors.text}>
          A continuación deberás elegir la sucursal, veterinario y horario disponible.
        </p>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!selectedMascota}
        className={`w-full py-4 rounded-xl transition-all ${selectedMascota
            ? `${colors.primary} ${colors.primaryHover} text-white shadow-lg`
            : `${colors.disabled} ${colors.disabledText} cursor-not-allowed`
          }`}
      >
        Elegir sucursal
      </button>
    </div>
  );
}
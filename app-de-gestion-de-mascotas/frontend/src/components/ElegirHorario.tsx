import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ElegirHorarioProps {
  veterinarioId: string;
  sucursalId: string;
  onSelectHorario: (fecha: string, hora: string) => void;
  onBack: () => void;
}

// Helper to get next 3 days
const getNextDays = () => {
  const dates = [];
  const today = new Date();
  // Start from tomorrow
  for (let i = 1; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

const nextDays = getNextDays();

// Mock dynamic schedules
const generateHorarios = () => {
  const baseHorarios = ['09:00', '09:30', '10:00', '11:00', '14:00', '15:30', '16:00', '17:00'];
  const schedules: Record<string, Record<string, string[]>> = {};

  const vetIds = ['vet-1', 'vet-2', 'vet-3', 'vet-4', 'vet-5', 'vet-6', 'vet-7'];

  vetIds.forEach(vetId => {
    schedules[vetId] = {};
    nextDays.forEach((date, index) => {
      // Randomize slightly for realism
      if (index % 2 === 0 && vetId === 'vet-1') {
        schedules[vetId][date] = baseHorarios.slice(0, 5);
      } else {
        schedules[vetId][date] = baseHorarios;
      }
    });
  });

  return schedules;
};

const horariosDisponibles = generateHorarios();

const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export function ElegirHorario({ veterinarioId, onSelectHorario, onBack }: ElegirHorarioProps) {
  const fechasDisponibles = Object.keys(horariosDisponibles[veterinarioId] || {});
  const [selectedFecha, setSelectedFecha] = useState(fechasDisponibles[0] || '');
  const [selectedHora, setSelectedHora] = useState<string | null>(null);
  const { colors } = useTheme();

  const horarios = horariosDisponibles[veterinarioId]?.[selectedFecha] || [];

  const handleConfirm = () => {
    if (selectedFecha && selectedHora) {
      onSelectHorario(selectedFecha, selectedHora);
    }
  };

  const formatFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr + 'T00:00:00');
    const dia = diasSemana[fecha.getDay()];
    const diaNum = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    return { dia, diaNum, mes };
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
          <h1 className={colors.text}>Horarios Disponibles</h1>
          <p className={colors.textSecondary}>Paso 4 de 4</p>
        </div>
      </div>

      {/* Date Selector */}
      <div className="mb-6">
        <h2 className={`${colors.text} mb-4`}>Seleccioná una fecha</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {fechasDisponibles.map((fecha) => {
            const { dia, diaNum, mes } = formatFecha(fecha);
            return (
              <button
                key={fecha}
                onClick={() => {
                  setSelectedFecha(fecha);
                  setSelectedHora(null);
                }}
                className={`flex-shrink-0 flex flex-col items-center gap-1 p-3 rounded-xl transition-all min-w-[70px] ${selectedFecha === fecha
                    ? `${colors.primary} text-white shadow-lg`
                    : `${colors.inputBg} ${colors.secondaryHover} border ${colors.inputBorder}`
                  }`}
              >
                <span className={selectedFecha === fecha ? 'text-white/80' : colors.textSecondary}>
                  {dia}
                </span>
                <span className={selectedFecha === fecha ? 'text-white' : colors.text}>
                  {diaNum}
                </span>
                <span className={selectedFecha === fecha ? 'text-white/80' : colors.textSecondary}>
                  {mes}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div className="mb-8">
        <h2 className={`${colors.text} mb-4`}>Horarios disponibles</h2>
        <div className="grid grid-cols-3 gap-3 max-h-[280px] overflow-y-auto">
          {horarios.map((hora) => (
            <button
              key={hora}
              onClick={() => setSelectedHora(hora)}
              className={`py-3 px-4 rounded-xl transition-all ${selectedHora === hora
                  ? `${colors.primary} text-white shadow-lg`
                  : `${colors.inputBg} ${colors.secondaryHover} ${colors.text} border ${colors.inputBorder}`
                }`}
            >
              {hora}
            </button>
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        disabled={!selectedHora}
        className={`w-full py-4 rounded-xl transition-all ${selectedHora
            ? `${colors.primary} ${colors.primaryHover} text-white shadow-lg`
            : `${colors.disabled} ${colors.disabledText} cursor-not-allowed`
          }`}
      >
        Continuar a confirmación
      </button>
    </div>
  );
}
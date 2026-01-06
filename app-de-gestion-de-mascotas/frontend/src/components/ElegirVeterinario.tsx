import { ChevronLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ElegirVeterinarioProps {
  sucursalId: string;
  onSelectVeterinario: (veterinarioId: string) => void;
  onBack: () => void;
}

const veterinarios = [
  {
    id: 'vet-1',
    nombre: 'Dr. Carlos García',
    especialidad: 'Medicina General',
    sucursalId: 'aldo-bonzi',
    foto: '👨‍⚕️'
  },
  {
    id: 'vet-2',
    nombre: 'Dra. María Rodríguez',
    especialidad: 'Cirugía',
    sucursalId: 'aldo-bonzi',
    foto: '👩‍⚕️'
  },
  {
    id: 'vet-3',
    nombre: 'Dr. Juan Martínez',
    especialidad: 'Cardiología',
    sucursalId: 'lomas-zamora',
    foto: '👨‍⚕️'
  },
  {
    id: 'vet-4',
    nombre: 'Dra. Ana López',
    especialidad: 'Medicina General',
    sucursalId: 'lomas-zamora',
    foto: '👩‍⚕️'
  },
  // Ensure we match data in ConfirmarTurno logic if hardcoded there too.
  // Actually ConfirmarTurno has its own hardcoded list. That is a problem for consistency.
  // But the user asked to "actualizá esa información" in the appointment flow first.
  {
    id: 'vet-5',
    nombre: 'Dr. Pablo Fernández',
    especialidad: 'Dermatología',
    sucursalId: 'lomas-zamora',
    foto: '👨‍⚕️'
  },
  {
    id: 'vet-6',
    nombre: 'Dra. Laura Gómez',
    especialidad: 'Medicina General',
    sucursalId: 'vicente-lopez',
    foto: '👩‍⚕️'
  },
  {
    id: 'vet-7',
    nombre: 'Dr. Sebastián Torres',
    especialidad: 'Oftalmología',
    sucursalId: 'vicente-lopez',
    foto: '👨‍⚕️'
  }
];

const sucursalesNombres: Record<string, string> = {
  'aldo-bonzi': 'Aldo Bonzi',
  'lomas-zamora': 'Lomas de Zamora',
  'vicente-lopez': 'Vicente López'
};

export function ElegirVeterinario({ sucursalId, onSelectVeterinario, onBack }: ElegirVeterinarioProps) {
  const veterinariosFiltrados = veterinarios.filter(vet => vet.sucursalId === sucursalId);
  const sucursalNombre = sucursalesNombres[sucursalId] || '';
  const { colors } = useTheme();

  return (
    <div className={`${colors.cardBg} rounded-3xl shadow-sm p-6 w-full min-h-[600px]`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className={`p-2 ${colors.secondary} ${colors.secondaryHover} rounded-xl transition-colors`}
        >
          <ChevronLeft className={`w-6 h-6 ${colors.text}`} />
        </button>
        <div>
          <h1 className={colors.text}>Elegir Veterinario</h1>
          <p className={colors.textSecondary}>Paso 3 de 4</p>
        </div>
      </div>

      {/* Sucursal Info */}
      <div className={`mb-6 p-3 ${colors.primary} rounded-xl`}>
        <p className="text-white">
          Sucursal: <span>{sucursalNombre}</span>
        </p>
      </div>

      {/* Veterinarios List */}
      <div className="space-y-3">
        {veterinariosFiltrados.map((veterinario) => {
          return (
            <div
              key={veterinario.id}
              className={`p-4 ${colors.inputBg} rounded-2xl hover:shadow-md transition-all border ${colors.inputBorder}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 ${colors.primary} rounded-xl flex items-center justify-center text-2xl`}>
                  {veterinario.foto}
                </div>
                <div className="flex-1">
                  <h3 className={colors.text}>{veterinario.nombre}</h3>
                  <p className={colors.textSecondary}>{veterinario.especialidad}</p>
                </div>
              </div>

              <button
                onClick={() => onSelectVeterinario(veterinario.id)}
                className={`w-full ${colors.primary} ${colors.primaryHover} text-white py-3 rounded-xl hover:shadow-lg transition-all`}
              >
                Seleccionar veterinario
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
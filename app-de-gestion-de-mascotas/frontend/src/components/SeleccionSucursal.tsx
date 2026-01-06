/**
 * SeleccionSucursal.tsx
 * 
 * Paso 2 del flujo de reserva de turnos: Selección de Sucursal.
 * Muestra un listado de las sedes veterinarias disponibles con su dirección y horario.
 */

import { ChevronLeft, MapPin, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SeleccionSucursalProps {
  onSelectSucursal: (sucursalId: string) => void;
  onBack: () => void;
}

const sucursales = [
  {
    id: 'aldo-bonzi',
    nombre: 'Sucursal Central (Aldo Bonzi)',
    direccion: 'Av. Cristianía 1234, B1785 Aldo Bonzi',
    horario: 'Lunes a Viernes: 08:30 - 20:00 hs'
  },
  {
    id: 'lomas-zamora',
    nombre: 'Sucursal Sur (Lomas de Zamora)',
    direccion: 'Av. Hipólito Yrigoyen 8765, Lomas',
    horario: 'Lunes a Sábados: 09:00 - 19:30 hs'
  },
  {
    id: 'vicente-lopez',
    nombre: 'Sucursal Norte (Vicente López)',
    direccion: 'Av. Maipú 4321, Vicente López',
    horario: 'Lunes a Viernes: 09:00 - 21:00 hs'
  }
];

export function SeleccionSucursal({ onSelectSucursal, onBack }: SeleccionSucursalProps) {
  const { colors } = useTheme();

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
          <h1 className={colors.text}>Seleccionar Sucursal</h1>
          <p className={colors.textSecondary}>Paso 2 de 4</p>
        </div>
      </div>

      {/* Sucursales List */}
      <div className="space-y-4">
        {sucursales.map((sucursal) => {
          return (
            <div
              key={sucursal.id}
              className={`p-5 ${colors.inputBg} rounded-2xl hover:shadow-md transition-all border ${colors.inputBorder}`}
            >
              <h3 className={`${colors.text} mb-3`}>{sucursal.nombre}</h3>

              <div className="flex items-start gap-2 mb-3">
                <MapPin className={`w-4 h-4 ${colors.textSecondary} mt-0.5 flex-shrink-0`} />
                <p className={colors.text}>{sucursal.direccion}</p>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Clock className={`w-4 h-4 ${colors.textSecondary}`} />
                <p className={colors.text}>{sucursal.horario}</p>
              </div>

              <button
                onClick={() => onSelectSucursal(sucursal.id)}
                className={`w-full ${colors.primary} ${colors.primaryHover} text-white py-3 rounded-xl hover:shadow-lg transition-all`}
              >
                Seleccionar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
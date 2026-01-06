import { ChevronLeft, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/apiService';
import { useState } from 'react';

interface ConfirmarTurnoProps {
  mascotaId: string;
  veterinarioId: string;
  sucursalId: string;
  fecha: string;
  hora: string;
  onConfirm: () => void;
  onBack: () => void;
}

import { useEffect } from 'react';

// Removing hardcoded mascotas
// const mascotas = ...

const veterinarios: Record<string, any> = {
  'vet-1': { nombre: 'Dr. Carlos García', especialidad: 'Medicina General' },
  'vet-2': { nombre: 'Dra. María Rodríguez', especialidad: 'Cirugía' },
  'vet-3': { nombre: 'Dr. Juan Martínez', especialidad: 'Cardiología' },
  'vet-4': { nombre: 'Dra. Ana López', especialidad: 'Medicina General' },
  'vet-5': { nombre: 'Dr. Pablo Fernández', especialidad: 'Dermatología' },
  'vet-6': { nombre: 'Dra. Laura Gómez', especialidad: 'Medicina General' },
  'vet-7': { nombre: 'Dr. Sebastián Torres', especialidad: 'Oftalmología' }
};

const sucursales: Record<string, any> = {
  'aldo-bonzi': { nombre: 'Sucursal Central (Aldo Bonzi)', direccion: 'Av. Cristianía 1234' },
  'lomas-zamora': { nombre: 'Sucursal Sur (Lomas de Zamora)', direccion: 'Av. Hipólito Yrigoyen 8765' },
  'vicente-lopez': { nombre: 'Sucursal Norte (Vicente López)', direccion: 'Av. Maipú 4321' }
};

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export function ConfirmarTurno({
  mascotaId,
  veterinarioId,
  sucursalId,
  fecha,
  hora,
  onConfirm,
  onBack
}: ConfirmarTurnoProps) {
  // const mascota = mascotas[mascotaId];
  const veterinario = veterinarios[veterinarioId] || { nombre: 'Veterinario', especialidad: '' };
  const sucursal = sucursales[sucursalId] || { nombre: 'Sucursal', direccion: '' };
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [mascotaDetails, setMascotaDetails] = useState<any>(null);

  useEffect(() => {
    // Fetch real pet details to display name/breed
    apiService.getMascotas().then((data) => {
      const found = data.find((m: any) => String(m.id) === String(mascotaId));
      if (found) setMascotaDetails(found);
    }).catch(err => console.error(err));
  }, [mascotaId]);

  const formatFecha = (fechaStr: string) => {
    const date = new Date(fechaStr + 'T00:00:00');
    const dia = diasSemana[date.getDay()];
    const diaNum = date.getDate();
    const mes = meses[date.getMonth()];
    return `${dia} ${diaNum} de ${mes}`;
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await apiService.createTurno({
        mascota_id: mascotaId,
        veterinario: veterinario.nombre, // Send name as string
        fecha: fecha,
        hora: hora,
        sucursal: sucursal.nombre // Send name as string
      });
      onConfirm();
    } catch (error) {
      console.error(error);
      alert('Error al confirmar turno');
    } finally {
      setLoading(false);
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
          <h1 className={colors.text}>Confirmar Turno</h1>
          <p className={colors.textSecondary}>Revisá los detalles</p>
        </div>
      </div>

      {/* Resumen */}
      <div className="space-y-4 mb-8">
        {/* Mascota */}
        <div className={`p-4 ${colors.inputBg} rounded-2xl border ${colors.inputBorder}`}>
          <p className={`${colors.textSecondary} mb-2`}>Mascota</p>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${colors.primary} rounded-xl flex items-center justify-center text-2xl`}>
              {mascotaDetails?.foto || '🐕'}
            </div>
            <div>
              <h3 className={colors.text}>{mascotaDetails?.nombre || 'Cargando...'}</h3>
              <p className={colors.textSecondary}>{mascotaDetails?.raza || ''}</p>
            </div>
          </div>
        </div>

        {/* Veterinario */}
        <div className={`p-4 ${colors.inputBg} rounded-2xl border ${colors.inputBorder}`}>
          <p className={`${colors.textSecondary} mb-2`}>Veterinario</p>
          <h3 className={colors.text}>{veterinario.nombre}</h3>
          <p className={colors.textSecondary}>{veterinario.especialidad}</p>
        </div>

        {/* Sucursal */}
        <div className={`p-4 ${colors.inputBg} rounded-2xl border ${colors.inputBorder}`}>
          <p className={`${colors.textSecondary} mb-2`}>Sucursal</p>
          <h3 className={colors.text}>{sucursal.nombre}</h3>
          <p className={colors.textSecondary}>{sucursal.direccion}</p>
        </div>

        {/* Fecha y Hora */}
        <div className={`p-4 ${colors.primary} text-white rounded-2xl shadow-lg`}>
          <p className="text-white/80 mb-2">Fecha y horario</p>
          <h3 className="text-white">{formatFecha(fecha)}</h3>
          <p className="text-white/90">{hora} hs</p>
        </div>
      </div>

      {/* Info */}
      <div className={`mb-8 p-4 ${colors.inputBg} rounded-2xl border ${colors.inputBorder}`}>
        <p className={colors.text}>
          ✓ Te enviaremos un recordatorio 24 horas antes del turno a tu email.
        </p>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        disabled={loading}
        className={`w-full ${colors.primary} ${colors.primaryHover} text-white py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg ${loading ? 'opacity-70' : ''}`}
      >
        <Check className="w-5 h-5" />
        {loading ? 'Confirmando...' : 'Confirmar turno'}
      </button>
    </div>
  );
}
import { Screen } from '../App';
import { Calendar, Plus, FileText, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeSelector } from './ThemeSelector';

interface DashboardDuenoProps {
  onNavigate: (screen: Screen) => void;
  onStartAppointment: () => void;
  onLogout: () => void;
}

import { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';

// Interfaces simplificadas
interface Mascota {
  id: number;
  nombre: string;
  raza: string;
  foto?: string;
}

interface Turno {
  id: number;
  nombre_mascota: string; // Viene del JOIN
  veterinario: string;
  fecha: string;
  hora: string;
  sucursal: string;
}

export function DashboardDueno({ onNavigate, onStartAppointment, onLogout }: DashboardDuenoProps) {
  const { colors } = useTheme();
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.username || '');
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [petsData, turnosData] = await Promise.all([
        apiService.getMascotas(),
        apiService.getTurnos()
      ]);
      setMascotas(petsData);
      setTurnos(turnosData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  return (
    <div className={`${colors.cardBg} rounded-3xl shadow-sm p-6 w-full min-h-[600px]`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <h1 className={colors.text}>{userName ? `Hola, ${userName}` : 'Mi Panel'}</h1>
          <p className={colors.textSecondary}>Bienvenido de nuevo</p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSelector />
          <button
            onClick={handleLogout}
            className={`p-2 ${colors.textSecondary} hover:text-red-500 transition-colors`}
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mascotas List */}
      <div className="mb-8">
        <h2 className={`${colors.text} mb-4`}>{userName ? `Mascotas de ${userName}` : 'Mis Mascotas'}</h2>
        {loading ? (
          <p className={colors.textSecondary}>Cargando...</p>
        ) : mascotas.length === 0 ? (
          <div className={`p-4 ${colors.inputBg} rounded-2xl text-center border ${colors.inputBorder}`}>
            <p className={colors.textSecondary}>No tienes mascotas registradas.</p>
            <button
              onClick={() => onNavigate('mascotas-create')}
              className={`mt-2 text-sm ${colors.primary} underline`}
            >
              ¡Agrega una ahora!
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {mascotas.map((mascota) => (
              <div
                key={mascota.id}
                className={`flex items-center gap-4 p-4 ${colors.inputBg} rounded-2xl hover:shadow-md transition-all cursor-pointer border ${colors.inputBorder}`}
                onClick={() => onNavigate('mascotas')}
              >
                <div className={`w-12 h-12 ${colors.primary} rounded-xl flex items-center justify-center text-2xl`}>
                  {mascota.foto || '🐕'}
                </div>
                <div className="flex-1">
                  <h3 className={colors.text}>{mascota.nombre}</h3>
                  <p className={colors.textSecondary}>{mascota.raza}</p>
                </div>
                <svg className={`w-5 h-5 ${colors.textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Próximos Turnos */}
      <div className="mb-8">
        <h2 className={`${colors.text} mb-4`}>Próximos Turnos</h2>
        {loading ? (
          <p className={colors.textSecondary}>Cargando...</p>
        ) : turnos.length === 0 ? (
          <p className={colors.textSecondary}>No tienes turnos agendados.</p>
        ) : (
          <div className="space-y-3">
            {turnos.map((turno) => (
              <div
                key={turno.id}
                className={`p-4 ${colors.inputBg} rounded-2xl border ${colors.inputBorder}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className={colors.text}>{turno.nombre_mascota}</h3>
                    <p className={colors.textSecondary}>{turno.veterinario}</p>
                  </div>
                  <span className={`${colors.textSecondary} ${colors.secondary} px-3 py-1 rounded-lg`}>
                    {turno.sucursal}
                  </span>
                </div>
                <div className={`flex items-center gap-2 ${colors.text}`}>
                  <Calendar className={`w-4 h-4 ${colors.textSecondary}`} />
                  <span>{new Date(turno.fecha).toLocaleDateString()} • {turno.hora}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onNavigate('mascotas-create')}
          className={`flex flex-col items-center gap-2 p-4 ${colors.inputBg} rounded-2xl hover:shadow-md transition-all border ${colors.inputBorder}`}
        >
          <div className={`w-10 h-10 ${colors.primary} rounded-xl flex items-center justify-center`}>
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span className={`${colors.text} text-center text-sm`}>Agregar mascota</span>
        </button>

        <button
          onClick={() => onNavigate('historial')}
          className={`flex flex-col items-center gap-2 p-4 ${colors.inputBg} rounded-2xl hover:shadow-md transition-all border ${colors.inputBorder}`}
        >
          <div className={`w-10 h-10 ${colors.primary} rounded-xl flex items-center justify-center`}>
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className={`${colors.text} text-center text-sm`}>Historial clínico</span>
        </button>

        <button
          onClick={onStartAppointment}
          className={`flex flex-col items-center gap-2 p-4 ${colors.primary} ${colors.primaryHover} rounded-2xl hover:shadow-lg transition-all`}
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-center text-sm">Agendar turno</span>
        </button>
      </div>
    </div>
  );
}
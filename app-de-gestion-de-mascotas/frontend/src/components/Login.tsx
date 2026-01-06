import { useState } from 'react';
import { UserRole } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeSelector } from './ThemeSelector';
// Importamos la función que ahora hace el fetch real al puerto 3001
import { loginUser } from '../services/authService';

interface LoginProps {
  onLogin: (role: UserRole) => void;
  onNavigateToRegister: () => void;
}

export function Login({ onLogin, onNavigateToRegister }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'dueno' | 'veterinario'>('dueno');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Para mostrar estado de carga
  const { colors } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      /**
       * LLAMADA AL SERVICIO
       * Esta función envía el username y password a tu servidor Node.
       * El servidor buscará el usuario en MySQL y comparará los hashes de las claves.
       */
      const result = await loginUser(username, password);
      
      if (result.success) {
        // Si el login es exitoso, notificamos a la App principal el rol elegido
        onLogin(selectedRole);
      } else {
        // Mostramos el mensaje de error que viene del backend (ej: "Usuario no encontrado")
        setError(result.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      // Si el servidor de Node está apagado o hay un problema de red
      setError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false); // Liberamos el botón
    }
  };

  return (
    <div className={`${colors.cardBg} rounded-3xl shadow-sm p-8 w-full`}>
      {/* Selector de tema arriba a la derecha */}
      <div className="flex justify-end mb-4">
        <ThemeSelector />
      </div>

      {/* Cabecera / Logo */}
      <div className="text-center mb-8">
        <div className={`w-16 h-16 ${colors.primary} rounded-2xl mx-auto mb-4 flex items-center justify-center`}>
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
        </div>
        <h1 className={colors.text}>ABLOVI</h1>
        <p className={colors.textSecondary}>Gestión de Mascotas</p>
      </div>

      {/* Selector de Rol (Dueño o Veterinario) */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSelectedRole('dueno')}
            className={`py-3 px-4 rounded-xl transition-all ${
              selectedRole === 'dueno'
                ? `${colors.primary} text-white shadow-lg`
                : `${colors.secondary} ${colors.textSecondary} ${colors.secondaryHover}`
            }`}
          >
            Dueño de mascota
          </button>
          <button
            type="button"
            disabled // Actualmente deshabilitado
            className={`py-3 px-4 rounded-xl transition-all opacity-40 cursor-not-allowed ${colors.disabled} ${colors.disabledText}`}
          >
            Veterinario
          </button>
        </div>
      </div>

      {/* Formulario de Login */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className={`block ${colors.text} mb-2`}>
            Nombre de usuario
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl ${colors.inputBg} border ${colors.inputBorder} ${colors.text} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
            placeholder="Ingresa tu usuario"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className={`block ${colors.text} mb-2`}>
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl ${colors.inputBg} border ${colors.inputBorder} ${colors.text} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
            placeholder="••••••••"
            required
          />
        </div>

        {/* Mensaje de Error visual */}
        {error && (
          <div className="text-red-500 text-center mt-2 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Botón de acción - Se bloquea mientras isLoading es true */}
        <button
          type="submit"
          className={`w-full ${colors.primary} ${colors.primaryHover} text-white py-3 rounded-xl transition-all shadow-lg mt-6 ${
            isLoading ? 'opacity-70 cursor-wait' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      {/* Link para navegar al registro */}
      <div className="text-center mt-6">
        <button 
          onClick={(e) => {
            e.preventDefault();
            onNavigateToRegister(); // Cambia la vista al componente de Registro
          }}
          className={`${colors.textSecondary} hover:opacity-80 transition-opacity text-sm underline underline-offset-4`}
        >
          ¿No tienes cuenta? Registrate
        </button>
      </div>
    </div>
  );
}
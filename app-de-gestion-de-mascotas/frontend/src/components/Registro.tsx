/**
 * Registro.tsx
 * 
 * Componente de pantalla de registro de nuevos usuarios.
 * Valida que el usuario no exista y que las contraseñas coincidan antes de crear la cuenta.
 */

import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeSelector } from './ThemeSelector';
import { ArrowLeft } from 'lucide-react';
// IMPORTANTE: Estas funciones ahora deben realizar peticiones HTTP (fetch) a tu servidor Node
import { registerUser, checkUsernameExists } from '../services/authService';

interface RegistroProps {
  onBack: () => void;
}

export function Registro({ onBack }: RegistroProps) {
  // Estados para controlar los valores de los inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState(''); // Estado para mostrar mensajes de error al usuario
  const [isLoading, setIsLoading] = useState(false); // Estado para deshabilitar el botón mientras se procesa
  const { colors } = useTheme();

  // Lógica de validación visual: las contraseñas deben ser iguales y no estar vacías
  const passwordsMatch = password === repeatPassword && password !== '';
  const showValidation = password !== '' && repeatPassword !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    setError('');

    // Validación previa: si no coinciden las claves, ni siquiera intentamos ir a la base de datos
    if (!passwordsMatch) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true); // Bloqueamos el botón de registro

    try {
      /**
       * PASO 1: Consultar la disponibilidad del nombre de usuario.
       * Esta función debe ejecutar un 'SELECT * FROM usuarios WHERE username = ?' en tu backend.
       */
      const exists = await checkUsernameExists(username);
      if (exists) {
        setError('El nombre de usuario ya está en uso');
        setIsLoading(false);
        return;
      }

      /**
       * PASO 2: Intentar el registro.
       * Enviamos los datos al backend para que haga el 'INSERT INTO usuarios ...'.
       * Es fundamental que el backend reciba la contraseña y le aplique un hash (con bcrypt) antes de guardarla.
       */
      const result = await registerUser(username, password);

      if (result.success) {
        // Si el backend responde OK (status 200/201), avisamos y volvemos al Login
        alert(result.message || 'Usuario registrado exitosamente');
        onBack();
      } else {
        // Si el backend detectó un error (ej: error de conexión de DB), lo mostramos
        setError(result.message || 'Error al registrar usuario');
      }
    } catch (error) {
      // Manejo de errores de red o servidor caído
      setError('Error de conexión con el servidor de base de datos');
    } finally {
      setIsLoading(false); // Liberamos el botón
    }
  };

  return (
    <div className={`${colors.cardBg} rounded-3xl shadow-sm p-8 w-full`}>
      {/* Cabecera con selector de tema y botón de volver */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className={`${colors.textSecondary} hover:opacity-80 transition-opacity flex items-center gap-2`}
        >
          <ArrowLeft size={20} />
          Volver
        </button>
        <ThemeSelector />
      </div>

      {/* Identidad visual de la app */}
      <div className="text-center mb-8">
        <div className={`w-16 h-16 ${colors.primary} rounded-2xl mx-auto mb-4 flex items-center justify-center`}>
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
        </div>
        <h1 className={colors.text}>Crear cuenta</h1>
        <p className={colors.textSecondary}>Registro de nuevo usuario</p>
      </div>

      {/* Formulario de Registro */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className={`block ${colors.text} mb-2`}>
            Nombre de usuario
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Actualiza el estado al escribir
            className={`w-full px-4 py-3 rounded-xl ${colors.inputBg} border ${colors.inputBorder} ${colors.text} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
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
            required
          />
        </div>

        <div>
          <label htmlFor="repeatPassword" className={`block ${colors.text} mb-2`}>
            Repetir contraseña
          </label>
          <input
            type="password"
            id="repeatPassword"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl ${colors.inputBg} border ${colors.inputBorder} ${colors.text} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
            required
          />
        </div>

        {/* Mensaje visual de validación de contraseñas */}
        {showValidation && (
          <div className={`text-center mt-2 ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
            {passwordsMatch
              ? '✓ Las contraseñas coinciden'
              : '✗ Las contraseñas no coinciden'}
          </div>
        )}

        {/* Mostrar errores que vengan del backend o de validación */}
        {error && (
          <div className="text-center mt-2 text-red-500">
            {error}
          </div>
        )}

        {/* El botón se deshabilita si los datos son inválidos o si ya hay una petición en curso */}
        <button
          type="submit"
          disabled={!passwordsMatch || isLoading}
          className={`w-full py-3 rounded-xl transition-all shadow-lg mt-6 ${passwordsMatch
              ? `${colors.primary} ${colors.primaryHover} text-white`
              : `${colors.disabled} ${colors.disabledText} cursor-not-allowed opacity-50`
            }`}
        >
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
}
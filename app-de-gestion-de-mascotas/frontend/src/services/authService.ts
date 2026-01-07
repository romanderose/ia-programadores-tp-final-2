/**
 * authService.ts
 * 
 * Servicio dedicado exclusivamente a la autenticación (Login, Registro, Logout).
 * Se comunica con las rutas /api/auth del backend.
 */

// authService.ts - Servicio de autenticación
// Este archivo es el "puente" entre tu pantalla de Registro (Frontend) y tu Servidor (Backend).

// Definimos la URL de tu API de Node.js. 
// Si tu servidor corre en otro puerto (ej: 5000), cámbialo aquí.
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api') + '/auth';
console.log('DEBUG: API_URL in authService is:', API_URL);

interface User {
  username: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string; // Nuevo campo para el token
}

/**
 * Valida las credenciales del usuario consultando la base de datos MySQL.
 */
export async function loginUser(username: string, password: string): Promise<AuthResponse> {
  try {
    // Enviamos una petición POST al servidor con el usuario y clave
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    // Si el servidor responde que todo está OK (status 200)
    if (response.ok) {
      // Guardar el token en el LocalStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return { success: true, user: data.user, token: data.token };
    } else {
      // Si el servidor rebota la entrada (ej: clave incorrecta)
      return { success: false, message: data.message || 'Error al iniciar sesión' };
    }
  } catch (error) {
    // Si el servidor de Node ni siquiera está encendido
    return { success: false, message: 'No se pudo conectar con el servidor' };
  }
}

/**
 * Registra un nuevo usuario en la tabla 'usuarios' de MySQL.
 */
export async function registerUser(username: string, password: string): Promise<AuthResponse> {
  try {
    // Enviamos los datos del nuevo usuario al endpoint de registro
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Registro exitoso en la BD
      return { success: true, message: 'Usuario registrado exitosamente' };
    } else {
      // El backend puede enviar errores como "El usuario ya existe"
      return { success: false, message: data.message || 'Error al registrar usuario' };
    }
  } catch (error) {
    return { success: false, message: 'Error de conexión con la base de datos' };
  }
}

/**
 * Verifica en tiempo real si un nombre de usuario ya está ocupado en MySQL.
 */
export async function checkUsernameExists(username: string): Promise<boolean> {
  try {
    // Hacemos una petición GET enviando el nombre como parámetro en la URL
    const response = await fetch(`${API_URL}/check-username?username=${username}`);
    const data = await response.json();

    // El backend debería devolver un booleano (true si existe, false si no)
    return data.exists;
  } catch (error) {
    console.error('Error verificando disponibilidad:', error);
    return false; // Ante la duda, dejamos que intente registrar
  }
}
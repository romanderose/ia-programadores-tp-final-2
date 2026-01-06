# Servicios de ABLOVI

## Integración de Base de Datos

Este directorio contiene los servicios que interactúan con la autenticación y otros datos de la aplicación.

### authService.ts

Este archivo centraliza toda la lógica de autenticación. Actualmente usa un usuario de prueba (`admin/admin`), pero está preparado para integrarse con una base de datos.

#### Pasos para integrar tu base de datos:

1. **Configuración de la API**
   - Crea endpoints en tu backend para:
     - `POST /api/auth/login` - Validar credenciales
     - `POST /api/auth/register` - Registrar nuevo usuario
     - `GET /api/auth/check-username` - Verificar si un usuario existe

2. **Modificar authService.ts**
   - Abre el archivo `/services/authService.ts`
   - Busca los comentarios `TODO: Cuando tengas la base de datos, reemplazar con:`
   - Descomenta el código de ejemplo y ajústalo según tu API
   - Elimina el código de usuario de prueba (`admin/admin`)

3. **Ejemplo de integración con Supabase** (si usas Supabase):
   ```typescript
   import { createClient } from '@supabase/supabase-js'
   
   const supabase = createClient(
     process.env.SUPABASE_URL,
     process.env.SUPABASE_ANON_KEY
   )
   
   export async function loginUser(username: string, password: string) {
     const { data, error } = await supabase
       .from('users')
       .select('*')
       .eq('username', username)
       .eq('password', password) // En producción usa hash!
       .single()
     
     if (error || !data) {
       return { success: false, message: 'Credenciales incorrectas' }
     }
     
     return { success: true, user: data }
   }
   ```

4. **Seguridad importante**
   - NUNCA guardes contraseñas en texto plano
   - Usa bcrypt o similar para hashear contraseñas
   - Implementa tokens JWT o sessions para mantener la sesión
   - Valida y sanitiza todos los inputs

5. **Estructura de datos sugerida para la tabla `users`**:
   ```sql
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     username VARCHAR(50) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

## Usuario de prueba actual

**Usuario:** `admin`  
**Contraseña:** `admin`

Este usuario será reemplazado cuando implementes la base de datos.

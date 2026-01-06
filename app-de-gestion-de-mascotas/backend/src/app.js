/**
 * app.js
 * 
 * Punto de entrada principal de la aplicación Backend.
 * Configura el servidor Express, cors, y las rutas de la API.
 */

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json()); // Vital para que Node entienda el JSON que envías

// Usar las rutas de usuarios
app.use('/api/auth', authRoutes);

// Usar las rutas principales (Mascotas, Turnos, Historial)
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`⚙ Servidor corriendo en http://localhost:${PORT}`);
});
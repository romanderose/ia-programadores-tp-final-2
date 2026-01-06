/**
 * db.js
 * 
 * Módulo de conexión a la base de datos MySQL.
 * Utiliza un pool de conexiones para manejar múltiples peticiones de manera eficiente.
 */

const mysql = require('mysql2');
require('dotenv').config();

// Creamos el pool de conexiones
// Un 'pool' mantiene conexiones abiertas listas para usar, evitando abrir/cerrar conexión en cada petición
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pets_app',
    waitForConnections: true,
    connectionLimit: 10
});

// Convertimos a promesas para usar async/await
const promisePool = pool.promise();

// --- PRUEBA DE CONEXIÓN INICIAL ---
// Intentamos pedir una conexión al pool para ver si MySQL responde
// EJECUCIÓN CONDICIONAL: En CI (GitHub Actions) no intentamos conectar para evitar fallos
if (!process.env.CI) {
    promisePool.getConnection()
        .then(connection => {
            console.log('✅ [MySQL] Conexión establecida con éxito.');
            console.log(`   Base de datos: ${process.env.DB_NAME || 'pets_app'}`);
            // Liberamos la conexión de prueba inmediatamente
            connection.release();
        })
        .catch(error => {
            console.error('❌ [MySQL] ERROR DE CONEXIÓN:');
            console.error(`   Detalle: ${error.message}`);
            console.log('   Asegúrate de que XAMPP/WAMP esté encendido y la DB creada.');
        });
}

module.exports = promisePool;
const mysql = require('mysql2');
require('dotenv').config();

// Creamos el pool de conexiones
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

module.exports = promisePool;
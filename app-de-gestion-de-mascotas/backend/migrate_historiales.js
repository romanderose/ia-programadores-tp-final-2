const db = require('./src/db');

async function migrateHistoriales() {
    try {
        console.log('Creando nuevas tablas para historiales clínicos...');

        // Table: historiales_clinicos (one per pet)
        await db.query(`
            CREATE TABLE IF NOT EXISTS historiales_clinicos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                mascota_id INT NOT NULL UNIQUE,
                usuario_id INT NOT NULL,
                nota_inicial TEXT NOT NULL,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Tabla "historiales_clinicos" creada.');

        // Table: eventos_clinicos (multiple events per history)
        await db.query(`
            CREATE TABLE IF NOT EXISTS eventos_clinicos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                historial_id INT NOT NULL,
                fecha DATE NOT NULL,
                tipo ENUM('Vacuna', 'Dieta', 'Actividad', 'Conducta', 'Control') NOT NULL,
                detalle TEXT NOT NULL,
                estado ENUM('Normal', 'Alerta', 'Seguimiento finalizado') NOT NULL,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (historial_id) REFERENCES historiales_clinicos(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Tabla "eventos_clinicos" creada.');

        console.log('\n✅ ¡Migración completada con éxito!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error durante la migración:', error);
        process.exit(1);
    }
}

migrateHistoriales();

const db = require('./src/db');

async function createTables() {
    try {
        console.log('Inicializando tablas de la base de datos...');

        // Table: usuarios
        await db.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabla "usuarios" lista.');

        // Table: mascotas
        await db.query(`
            CREATE TABLE IF NOT EXISTS mascotas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                nombre VARCHAR(100) NOT NULL,
                tipo VARCHAR(50),
                raza VARCHAR(100),
                edad VARCHAR(50),
                peso VARCHAR(50),
                foto LONGTEXT,
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Tabla "mascotas" lista.');

        // Table: turnos
        await db.query(`
            CREATE TABLE IF NOT EXISTS turnos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                mascota_id INT NOT NULL,
                veterinario VARCHAR(100),
                fecha DATE NOT NULL,
                hora VARCHAR(10) NOT NULL,
                sucursal VARCHAR(100),
                estado VARCHAR(50) DEFAULT 'Pendiente',
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Tabla "turnos" lista.');

        // Table: historial_clinico (LEGACY)
        await db.query(`
            CREATE TABLE IF NOT EXISTS historial_clinico (
                id INT AUTO_INCREMENT PRIMARY KEY,
                mascota_id INT NOT NULL,
                veterinario VARCHAR(100),
                fecha DATE NOT NULL,
                tipo VARCHAR(100),
                diagnostico TEXT,
                sucursal VARCHAR(100),
                FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Tabla "historial_clinico" lista.');

        // Table: registros_clinicos (LEGACY - DEPRECATED)
        await db.query(`
            CREATE TABLE IF NOT EXISTS registros_clinicos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                mascota_id INT NOT NULL,
                usuario_id INT NOT NULL,
                nota_inicial TEXT NOT NULL,
                fecha DATE NOT NULL,
                tipo ENUM('Vacuna', 'Dieta', 'Actividad', 'Conducta', 'Control') NOT NULL,
                detalle TEXT NOT NULL,
                estado ENUM('Normal', 'Alerta', 'Seguimiento finalizado') NOT NULL,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Tabla "registros_clinicos" lista.');

        // Table: historiales_clinicos (CURRENT)
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
        console.log('✅ Tabla "historiales_clinicos" lista.');

        // Table: eventos_clinicos (CURRENT)
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
        console.log('✅ Tabla "eventos_clinicos" lista.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creando tablas:', error);
        process.exit(1);
    }
}

createTables();

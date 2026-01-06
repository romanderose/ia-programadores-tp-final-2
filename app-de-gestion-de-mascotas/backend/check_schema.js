const db = require('./src/db');

async function checkSchema() {
    try {
        console.log('Verificando esquema de la base de datos...');
        const [tables] = await db.query('SHOW TABLES');
        const tableNames = tables.map(row => Object.values(row)[0]);
        console.log('Tablas encontradas:', tableNames);

        for (const table of tableNames) {
            console.log(`\nEsquema para la tabla: ${table}`);
            const [columns] = await db.query(`DESCRIBE ${table}`);
            console.log(columns.map(col => `${col.Field} (${col.Type})`).join(', '));
        }
        process.exit(0);
    } catch (error) {
        console.error('Error verificando el esquema:', error);
        process.exit(1);
    }
}

checkSchema();

const db = require('./backend/src/db');

async function checkSchema() {
    try {
        console.log('Checking database schema...');
        const [tables] = await db.query('SHOW TABLES');
        const tableNames = tables.map(row => Object.values(row)[0]);
        console.log('Tables found:', tableNames);

        for (const table of tableNames) {
            console.log(`\nSchema for table: ${table}`);
            const [columns] = await db.query(`DESCRIBE ${table}`);
            console.log(columns.map(col => `${col.Field} (${col.Type})`).join(', '));
        }
        process.exit(0);
    } catch (error) {
        console.error('Error checking schema:', error);
        process.exit(1);
    }
}

checkSchema();

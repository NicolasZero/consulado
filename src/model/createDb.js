import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import sqlite from 'sqlite3'

// constantes
const __dirname = dirname(fileURLToPath(import.meta.url));

// Conecta a la base de datos
export const db = new sqlite.Database(join(__dirname,"data","data.db"), sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
});

// crea la tabla
const sql = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    password TEXT NOT NULL
);`;

db.run(sql, (err) => {
    if (err) {
        console.error(err.message);
    }
});
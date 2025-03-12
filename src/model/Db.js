import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import sqlite from 'sqlite3'

// constantes
const __dirname = dirname(fileURLToPath(import.meta.url));

console.log(__dirname)

// Conecta a la base de datos
export const db = new sqlite.Database(join(__dirname,"..","data","data.db"), sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message)
})

// crea la tabla
export const createdb = () => {
    const sql = `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        password TEXT NOT NULL
    );`
    
    db.run(sql, (err) => err ? console.error(err.message) : '')
}

// export const query = (sql, params) => new Promise((resolve, reject) => db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows)))

export const close = () => db.close((err) => err ? console.error(err.message) : '')

export const selectAll = async (sql) => {
    try {
        return await db.all(sql, params, (err, rows) => err ? console.error(err.message) : rows) 
    } catch (error) {
        console.error(error)
    }
}

export const select = async (sql, params) => {
    try {
        return await db.all(sql, params, (err, rows) => err ? console.error(err.message) : rows) 
    } catch (error) {
        console.error(error)
    }
}

export const insert = async (sql, params = []) => {
    try {
        return await db.run(sql, params, (err, rows) => err ? console.error(err.message) : rows) 
    } catch (error) {
        console.error(error)
    }
}
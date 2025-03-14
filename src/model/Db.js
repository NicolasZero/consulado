import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import sqlite from 'sqlite3'

const sqlite3 = sqlite.verbose()

// consts
const __dirname = dirname(fileURLToPath(import.meta.url));
const url = join(__dirname,"..","data","data.db")

// Conecta a la base de datos
export const connect = () => {
    return new sqlite3.Database(url, sqlite3.OPEN_READWRITE, (err) => err ? console.error(err.message):console.log('Conectado a la base de datos'))
}
import express from 'express';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import { Server } from 'socket.io';
import { createServer } from 'http';
import sqlite from 'sqlite3'


// Rutas
import router from './routes/router.js';

// constantes
const __dirname = dirname(fileURLToPath(import.meta.url));
// console.log();

// base de dato
const db = new sqlite.Database(join(__dirname,"data","data.db"), sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
});

// para modificaciones
// const sql = `INSERT INTO users (name, password) VALUES ('admin', 'admin123');`;
// const sql = `UPDATE users SET name = 'operator', password = '12345678' WHERE id = 2;`;
// const sql = `DELETE FROM users WHERE id = 2;`;

// db.run(sql, (err) => {
//     if (err) {
//         console.error(err.message);
//     }
// });

// para consultas
// const sql = `SELECT * FROM users;`;
// db.all(sql, (err, rows) => {
//     if (err) {
//         console.error(err.message);
//     }
//     console.log(rows);
// })


const app = express();
const server = createServer(app);
const io = new Server(server);

// websocket
io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on('chat message', (msg) => {
        const username = socket.handshake.auth.username ?? 'anonymous'
        console.log({msg,username})
        io.emit('chat message', {msg,username})
    })
})

// const __dirname = dirname(fileURLToPath(import.meta.url));

// process.loadEnvFile('.env')
// const {PORT:port = 8080} = process.env;
const port = 8080

app.set('view engine', 'ejs');
app.set('views', join(__dirname,'views'));
app.use(express.static(join(__dirname,'public')));

app.use(router);

server.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})
import express from 'express';

// para el manejo de rutas
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

// Socket io / websockets
import { Server } from 'socket.io';
import { createServer } from 'http';

// Base de datos
import sqlite from 'sqlite3'

// Rutas
import router from './routes/router.js';

// constantes
const __dirname = dirname(fileURLToPath(import.meta.url));

// conectarse a la base de dato
// const db = new sqlite.Database(join(__dirname,"data","data.db"), sqlite.OPEN_READWRITE, (err) => {
//     if (err) {
//         console.error(err.message);
//     }
// });

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

// process.loadEnvFile('.env')
// const {PORT:port = 8080} = process.env;
const port = 8080

const app = express();
const server = createServer(app);
const io = new Server(server);

// websocket
const socketMap = {};
io.on('connection', (socket) => {
    console.log('a user connected: ', socket.id)
    let socketRoom

    socket.on('disconnect', () => console.log(`user disconnected: ${socket.id}, ${socketMap[socket.id]}`))

    socket.on('join', (data) => {
        const {user, room} = data
        socket.join(room)
        socketRoom = room
        socketMap[socket.id] = user
        console.log(`User: "${user}" joined room: "${room}"`)
        // console.log(`User: "${socket.id}" joined room: "${room}"`)
    })

    socket.on('chat', (data) => {
        io.to(socketRoom).emit('chat', {username: socketMap[socket.id], message: data.msg})
        // console.log(`Enviado msg: ${data.msg} al room: ${data.room}`)
        console.log(`Enviado msg: ${data.msg} al room: ${socketRoom}`)
    })

    socket.on('switch', (data) => {
        const { prevRoom, nextRoom } = data;
        if (prevRoom) socket.leave(prevRoom);
        if (nextRoom) socket.join(nextRoom);
        socketRoom = nextRoom;
    })
})

app.set('view engine', 'ejs'); //Definir que las vistas usan EJS
app.set('views', join(__dirname,'views')); //Definir la ubicación de las vistas
app.use(express.static(join(__dirname,'public'))); //Definir la ubicación de los archivos estáticos

app.use(router);

server.listen(port, () => console.log(`Listening at http://localhost:${port}`))
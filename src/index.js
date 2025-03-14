import express from 'express';

// para el manejo de rutas
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

// Socket io / websockets
import { Server } from 'socket.io';
import { createServer } from 'node:http';

// Base de datos
import sqlite from 'sqlite3'

// Rutas
import router from './routes/router.js';

import {allOptions, roles} from './const/const.js'

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
const rooms = {}
// const users = {}
io.on('connection', (socket) => {
    console.log('a user connected: ', socket.id)
    // console.log(socket.handshake.auth)
    let socketRoom

    socket.on('disconnect', () => {
        console.log(`user disconnected: ${socket.id}`)
        // console.log(socket.handshake.auth)
        if (socket.handshake.auth.ic) {
            delete rooms[socket.handshake.auth.ic]
            socket.broadcast.emit('rooms', rooms)
        }
    })

    socket.on('rooms', (params) => {
        // console.log(params);
        if (params === allOptions) {
            socket.emit('rooms', rooms)
        }
    })

    socket.on('join', (room) => {
        const user = socket.handshake.auth.username
        socket.join(room)
        socketRoom = room
        // socketMap[socket.id] = user
        console.log(`User: "${user}" joined room: "${room}"`)
        // console.log(`User: "${socket.id}" joined room: "${room}"`)
    })

    socket.on('room', (data)=>{
        const {ic} = data
        if (rooms[ic]) {
            console.log(`Room ${ic} already exists`);
        }else{
            socketRoom = ic
            rooms[ic] = data
            socket.broadcast.emit('rooms', rooms)
            socket.join(ic)
            console.log(`Room ${ic} created`);
        }
    })

    // socket.on('leave', (data) => {
    //     const {user, room} = data
    //     socket.leave(room)
    //     console.log(`User: "${user}" left room: "${room}"`)
    // })

    socket.on('chat', (message) => {
        const username = socket.handshake.auth.username
        io.to(socketRoom).emit('chat', {username, message})
        // console.log(`Enviado msg: ${data.msg} al room: ${data.room}`)
        console.log(`Enviado msg: ${message} al room: ${socketRoom}`)
    })

    socket.on('switch', (data) => {
        const { prevRoom, nextRoom } = data;
        if (prevRoom) socket.leave(prevRoom);
        if (nextRoom) socket.join(nextRoom);
        socketRoom = nextRoom;
        console.log(`Switched room from ${prevRoom} to ${nextRoom}`);
    })
})

//middlewares
app.use(express.json())

app.set('view engine', 'ejs'); //Definir que las vistas usan EJS
app.set('views', join(__dirname,'views')); //Definir la ubicación de las vistas
app.use(express.static(join(__dirname,'public'))); //Definir la ubicación de los archivos estáticos

app.use(router);

server.listen(port, () => console.log(`Listening at http://localhost:${port}`))
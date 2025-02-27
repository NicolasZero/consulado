import express from 'express';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import { Server } from 'socket.io';
import { createServer } from 'http';
import sqlite from 'sqlite3'


// Rutas
import router from './routes/router.js';
import { Socket } from 'dgram';

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


const app = express();
const server = createServer(app);
const io = new Server(server);

const rooms = {}

const socketMap = {}
// websocket
io.on('connection', (socket) => {
    console.log('a user connected: ', socket.id)
    let socketRoom;

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    // socket.on('join', (room) => {
    //     socket.join(room)
    //     socketRoom = room
    socket.on('join', (data) => {
        socket.join(data.room)
        socketRoom = data.room
        // socketMap[socket.id] = data.username
        console.log(`Socket: "${socket.id}" joined room: "${data.room}"`)
    })

    // socket.on('chat', (data) => {
    //     io.to(socketRoom).emit('chat', data.message);
    // });

    socket.on('chat', (data) => {
        io.to(socketRoom).emit('chat', {
            username: data.user,
            message: data.msg
        });
        console.log(`Enviado msg: ${data.msg} al room: ${socketRoom}`);
        
    });

    // socket.on('room', (room) => {
    //     console.log(`Socket: "${socket.id}" joined room: "${room}"`)
    //     socket.join(room)
    // })

    // socket.on('chat', (data) => {
    //     const {msg, room} = data
    //     console.log(`msg: "${msg}", room: "${room}"`)
    //     io.to(room).emit('chat', msg)
    // })





    // socket.on('room', (channel) => {
    //     io.emit(channel)
    // })

    // socket.emit('rooms', io.sockets.adapter.rooms)
    // socket.emit('rooms', rooms)

    // socket.on('join room', ({room,username}) => {
        // socket.join(room)
        // socket.room = room

        // si no existe la sala la creamos
        // if (!rooms[room]) {
        //     rooms[room] = {
        //         admin: socket.id,
        //         users: {}
        //     }
        // }

        // agregamos el usuario a la sala
        // rooms[room].users[socket.id] = {username}

        // enviamos la lista de salas
        // socket.emit('rooms', rooms)

        // socket.emit('joined room', {room,username})
    // })

    // socket.on('change channel', (channel) => {
    //     socket.join(`channel-${channel}`);
    //     // console.log(channel);
    // })

    // socket.join('channel-1');

    // socket.on('channel-1', (msg) => {
    //     // socket.join(`channel-${channel}`);
    //     // console.log(channel);
    // })

    // socket.on('chat message', (msg) => {
    //     const username = socket.handshake.auth.username ?? 'anonymous'
    //     // console.log({msg,username})
    //     io.emit('chat message', {msg,username})
    // })
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
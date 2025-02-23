import express from 'express';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import { Server } from 'socket.io';
import { createServer } from 'http';

// Rutas
import router from './routes/router.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg)
        io.emit('chat message', msg)
    })
})

// process.loadEnvFile('.env')

const __dirname = dirname(fileURLToPath(import.meta.url));

// const {PORT:port = 3000} = process.env;
const port = 8080

app.set('view engine', 'ejs');
app.set('views', join(__dirname,'views'));
app.use(express.static(join(__dirname,'public')));

app.use(router);

server.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})
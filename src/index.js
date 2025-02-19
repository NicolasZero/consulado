// const express = require('express');
import express from 'express';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import router from './routes/router.js';

process.loadEnvFile('.env.example')

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

const {PORT:port = 3000} = process.env;

app.set('view engine', 'ejs');
app.set('views', join(__dirname,'views'));
app.use(express.static(join(__dirname,'public')));

app.use(router);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})
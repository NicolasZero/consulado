import fs from 'fs'
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// const home = (req, res) => {
//     res.render('home', {title: 'Consulado contigo',page:"home"})
// }

const home = (req, res) => {
    const pathRouter = join(__dirname,"..","data","questions.json")
    
    // Lee el archivo
    fs.readFile(pathRouter, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo', err)
            return res.render('home', {title: 'Consulado contigo',page:"home",data:[]})
        }
        
        const questions = JSON.parse(data).questions

        // renderiza la vista
        return res.render('home', {title: 'Consulado contigo',page:"home", data:questions})
    })
}

export default {home} 
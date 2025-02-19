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
    fs.readFile(pathRouter, 'utf8', (err, file) => {
        if (err) {
            console.error('Error al leer el archivo', err)
            return res.render('500', {title: 'Error 500'})
        }
        
        const data = JSON.parse(file).questions

        // renderiza la vista
        return res.render('home', {title: 'Consulado contigo',page:"home", data})
    })
}

const cities = (req, res) => {
    const pathRouter = join(__dirname,"..","data","cities.json")

    const cityToSearch = req.params.city || ''

    if (cityToSearch.length > 2) {
        return res.render('cities', {title: 'Consulado contigo',page:"cities", data:[], country:""})
    }
    
    // Lee el archivo
    fs.readFile(pathRouter, 'utf8', (err, file) => {
        if (err) {
            console.error('Error al leer el archivo', err)
            return res.render('500', {title: 'Error 500'})
        }
        
        const country = JSON.parse(file).country
        
        // busca la ciudad
        const data = country.filter(city => city.id === cityToSearch)

        // renderiza la vista
        return res.render('cities', {title: 'Consulado contigo',page:"cities", data, country:cityToSearch})
    })
}

const consulates = (req, res) => {
    const pathRouter = join(__dirname,"..","data","cities.json")

    const cityToSearch = req.params.city || ''

    if (cityToSearch.length > 2) {
        return res.render('cities', {title: 'Consulado contigo',page:"cities", data:[], country:""})
    }
    
    // Lee el archivo
    fs.readFile(pathRouter, 'utf8', (err, file) => {
        if (err) {
            console.error('Error al leer el archivo', err)
            return res.render('500', {title: 'Error 500'})
        }
        
        const country = JSON.parse(file).country
        
        // busca la ciudad
        const data = country.filter(city => city.id === cityToSearch)

        // renderiza la vista
        return res.render('cities', {title: 'Consulado contigo',page:"cities", data, country:cityToSearch})
    })
}

export default {home,cities,consulates} 
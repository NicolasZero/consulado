import { count, log } from 'console';
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

    const countryId = req.params.country || ''

    if (countryId.length > 2) {
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
        const data = country.filter(country => country.id === countryId)

        // renderiza la vista
        return res.render('cities', {title: 'Consulado contigo',page:"cities", data, country:countryId})
    })
}

const consulates = (req, res) => {
    const pathRouter = join(__dirname,"..","data","consulates.json")

    const countryId = req.params.country || ''

    if (countryId.length > 2) {
        return res.render('consulates', {title: 'Consulado contigo',page:"consulates", data:[], country:""})
    }
    
    // Lee el archivo
    fs.readFile(pathRouter, 'utf8', (err, file) => {
        if (err) {
            console.error('Error al leer el archivo', err)
            return res.render('500', {title: 'Error 500'})
        }
        
        const country = JSON.parse(file).country
        
        // busca la ciudad
        const data = country.filter(country => country.id === countryId)
        
        // renderiza la vista
        return res.render('consulates', {title: 'Consulado contigo',page:"consulates", data, country:countryId})
    })
}

const supportNetwork = (req, res) => {
    const pathRouter = join(__dirname,"..","data","networks.json")
    const {city, country} = req.params

    if (!Number(city) || country.length > 2) {
        return res.render('404', {title: 'Page no found'})
    }
    
    // Lee el archivo
    fs.readFile(pathRouter, 'utf8', (err, file) => {
        if (err) {
            console.error('Error al leer el archivo', err)
            return res.render('500', {title: 'Error 500'})
        }
        
        const json = JSON.parse(file).country
        
        // filtra por pais
        const cities = json.find(e => e.id === country)
        
        if (!cities) {
            return res.render('404', {title: 'Page no found'})
        }
        
        // busca la ciudad
        const data = cities.cities.find(e => e.id == city)

        if (!data) {
            return res.render('404', {title: 'Page no found'})
        }

        // renderiza la vista
        return res.render('networks', {title: 'Consulado contigo',page:"cities",data,country,cities})
    })
}

export default {home,cities,consulates,supportNetwork} 
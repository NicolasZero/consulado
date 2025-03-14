import fs from 'node:fs'
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

// import {selectAll} from '../model/Db.js'

const title = 'Consulado contigo'

const __dirname = dirname(fileURLToPath(import.meta.url));

// const home = (req, res) => {
//     res.render('home', {title,page:"home"})
// }

const chat = (req, res) => {
    res.render('chat', {title:`${title} - Atencion en vivo` ,page:"chat"})
}

const login = (req, res) => {
    res.render('login', {title:`${title} - login`,page:"login"})
}

const operator = (req, res) => {
    res.render('operator', {title:`${title} - administracion`,page:"operator"})
}

const warningSigns = (req, res) => {
    res.render('warningSigns', {title:`${title} - Señales de alerta`,page:"warningSigns"})
}

const genderViolence = (req, res) => {
    res.render('genderViolence', {title:`${title} - administracion`,page:"genderViolence"})
}


const orientation = (req, res) => {
    res.render('orientation', {title:`${title} - administracion`,page:"orientation"})
}


const home = (req, res) => {
    const pathRouter = join(__dirname,"..","data","questions.json")
    
    // Lee el archivo
    fs.readFile(pathRouter, 'utf8', (err, file) => {
        if (err) {
            console.error('Error al leer el archivo', err)
            return res.status(500).render('500', {title: 'Error 500'})
        }
        
        const data = JSON.parse(file).questions

        // renderiza la vista
        return res.render('home', {title,page:"home", data})
    })
}

const networks = (req, res) => {
    const pathRouter = join(__dirname,"..","data","cities.json")

    const countryId = req.params.country || ''

    if (countryId.length > 2) {
        return res.render('cities', {title:`${title} - Redes de apoyo`,page:"cities", data:[], country:""})
    }
    
    // Lee el archivo
    fs.readFile(pathRouter, 'utf8', (err, file) => {
        if (err) {
            console.error('Error al leer el archivo', err)
            return res.status(500).render('500', {title: 'Error 500'})
        }
        
        const country = JSON.parse(file).country
        
        // busca la ciudad
        const data = country.filter(country => country.id === countryId)

        // renderiza la vista
        return res.render('cities', {title:`${title} - Redes de apoyo`,page:"cities", data, country:countryId})
    })
}

const consulates = (req, res) => {
    const pathRouter = join(__dirname,"..","data","consulates.json")

    const countryId = req.params.country || ''

    if (countryId.length > 2) {
        return res.render('consulates', {title:`${title} - Consulados`,page:"consulates", data:[], country:""})
    }
    
    // Lee el archivo
    fs.readFile(pathRouter, 'utf8', (err, file) => {
        if (err) {
            console.error('Error al leer el archivo', err)
            return res.status(500).render('500', {title: 'Error 500'})
        }
        
        const country = JSON.parse(file).country
        
        // busca la ciudad
        const data = country.filter(country => country.id === countryId)
        
        // renderiza la vista
        return res.render('consulates', {title:`${title} - Consulados`,page:"consulates", data, country:countryId})
    })
}

const supportNetwork = (req, res) => {
    const pathRouter = join(__dirname,"..","data","networks.json")
    const {city, country} = req.params

    if (!Number(city) || country.length > 2) {
        return res.status(404).render('404', {title: 'Page no found'})
    }
    
    // Lee el archivo
    fs.readFile(pathRouter, 'utf8', (err, file) => {
        if (err) {
            console.error('Error al leer el archivo', err)
            return res.status(500).render('500', {title: 'Error 500'})
        }
        
        const json = JSON.parse(file).country
        
        // filtra por pais
        const cities = json.find(e => e.id === country)
        
        if (!cities) {
            return res.status(404).render('404', {title: 'Page no found'})
        }
        
        // busca la ciudad
        const data = cities.cities.find(e => e.id == city)

        if (!data) {
            return res.status(404).render('404', {title: 'Page no found'})
        }

        // renderiza la vista
        return res.render('networks', {title:`${title} - Redes de apoyo`,page:"cities",data,country,cities})
    })
}

export default {
    home,
    networks,
    consulates,
    supportNetwork,
    chat,
    operator,
    login,
    orientation,
    warningSigns,
    genderViolence
} 
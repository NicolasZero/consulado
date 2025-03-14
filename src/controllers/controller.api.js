import crypto from "node:crypto";
import bcrypt from 'bcrypt'
import {connect} from '../model/Db.js'

// iniciar sesion
const login = async (req, res) => {
    try {
        const db = connect()
        const {username, password} = req.body
        // Valida los datos
        if (!username || !password) {
            return res.status(400).json({status: 'error', message: 'El usuario o la contraseña no pueden estar vacíos'})
        }

        if (username.length < 3 || password.length < 8) {
            return res.status(400).json({status: 'error',message: 'El usuario o la contraseña no cumplen con el mínimo de caracteres'})
        }

        const sql = `SELECT * FROM users WHERE name = ?`

        db.get(sql, [username], (err, row) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({status: 'error', message: 'Error al iniciar sesión'})
            }

            if (!row || row.length === 0) {
                return res.status(400).json({status: 'error', message: 'El usuario o la constraseña es incorrecta'})
            }

            if (!bcrypt.compareSync(password, row.password)) {
                return res.status(400).json({status: 'error',message: 'El usuario o la contraseña es incorrecta'})
            }

            return res.status(200).json({status: 'success', message: 'Sesión iniciada', data: row})
        })

        // cierra la conexión
        db.close(err => err ? console.error(err) : console.log('Conección cerrada'))
    } catch (error) {
        console.log(error);
        res.status(500).json({status: 'error', message: 'Error en el servidor'})
    }
}

// Registra un nuevo usuario
const register = (req, res) => {
    try {
        const db = connect()

        // Variables
        let sql = ''
        
        // Recibe los datos
        const {username, password} = req.body

        // Valida los datos
        if (!username || !password) {
            return res.status(400).json({status: 'error', message: 'Faltan datos'})
        }

        if (username.length < 3 || password.length < 8) {
            return res.status(400).json({status: 'error',message: 'El usuario debe tener más de 2 caracteres y la contraseña 8 o más'})
        }

        // sql para buscar si el usuario ya existe
        sql = `SELECT * FROM users WHERE name = ?`

        db.get(sql, [username], (err, row) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({status: 'error', message: 'Error al crear el usuario'})
            }

            // Si el usuario ya existe
            if (row) {
                console.log(row)
                return res.status(400).json({status: 'error', message: 'El usuario ya existe'})
            }
            // Si el usuario no existe prosigue a crearlo

            // Encripta la contraseña
            const hashedPassword = bcrypt.hashSync(password, 10)

            // Genera el id
            const id = crypto.randomUUID()

            // Sql para insertar
            sql = `INSERT INTO users (id, name, password) VALUES (?, ?, ?)`

            db.run(sql, [id, username, hashedPassword], (err) => {
                if (err) { 
                    console.error(err.message)
                    return res.status(500).json({status: 'error', message: 'Error al crear el usuario'})
                }
                return res.status(200).json({status: 'success', message: 'Usuario creado'})
            })
        })
        
        // Cierra la conexión
        db.close(err => err ? console.error(err) : console.log('Conección cerrada'))
    } catch (error) {
        console.error(error)
        res.status(500).json({status: 'error', message: 'Error en el servidor'})
    }
}

// Crea la base de datos (si no existe)
const createdb = (req, res) => {
    try {
        const db = connect()

        const sql = `CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            password TEXT NOT NULL
        );`

        db.run(sql, (err) => {
            if (err) {
                // throw err // El sistema permanece parado si uso throw
                console.error(err.message)
                return res.status(500).json({status: 'error', message: 'Error al crear la base de datos'})
            }
            return res.status(200).json({status: 'success', message: 'Base de datos creada'})
        })
        db.close(err => err ? console.error(err) : console.log('Conección cerrada'))
    } catch (error) {
        // console.error(error)
        res.status(500).json({status: 'error', message: 'Error en el servidor'})
    }
}

const deleteUser = (req, res) => {
    try {
        const db = connect()

        db.run(`DELETE FROM users WHERE id = ?`, [req.params.id], (err) => {
            if (err) {
                console.error(err.message)
                return res.status(500).json({status: 'error', message: 'Error al eliminar el usuario'})
            }
            return res.status(200).json({status: 'success', message: 'Usuario eliminado'})
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({status: 'error', message: 'Error en el servidor'})
    }
}

export default {
    login, 
    register,
    createdb,
    deleteUser
}
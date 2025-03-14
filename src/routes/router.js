import { request, Router } from "express";
import controllerView from '../controllers/controller.router.js'
import controllerApi from '../controllers/controller.api.js'

const router = Router();

// ===== Views =====//
router.get("/", controllerView.home)
router.get("/networks/:country?", controllerView.networks)
router.get("/consulates/:country?", controllerView.consulates)
router.get("/support_networks/:country/:city", controllerView.supportNetwork)
router.get("/chat", controllerView.chat)
router.get("/login", controllerView.login)
router.get("/operator", controllerView.operator)
router.get("/gender_violence", controllerView.genderViolence)
router.get("/orientation", controllerView.orientation)
router.get("/warning_signs", controllerView.warningSigns)

// ===== Easter eggs =====//
router.get('/hermosa', (req, res) => {res.status(200).render('easterEgg')})

// ===== API =====//
router.post('/api/auth/login', controllerApi.login)
router.post('/api/auth/register', controllerApi.register)

// dev
router.post('/api/dev/createdb', controllerApi.createdb)
router.delete('/api/dev/user/:id', controllerApi.deleteUser)

// ===== Errors =====//
router.get('/500', (req, res) => {res.status(500).render('500', {title: 'Error 500'})})
// 404
router.get('*', (req, res) => {res.status(404).render('404', {title: 'Page no found'})})

export default router
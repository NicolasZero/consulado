import { request, Router } from "express";
import controller from '../controllers/controller.router.js'

const router = Router();

// ===== Views =====//
router.get("/", controller.home)
router.get("/networks/:country?", controller.cities)
router.get("/consulates/:country?", controller.consulates)
router.get("/support_networks/:country/:city", controller.supportNetwork)
router.get("/chat", controller.chat)
router.get("/login", controller.login)
router.get("/operator", controller.operator)
router.get("/gender_violence", controller.genderViolence)
router.get("/orientation", controller.orientation)
router.get("/warning_signs", controller.warningSigns)
router.get('/500', (req, res) => {res.status(500).render('500', {title: 'Error 500'})})
router.get('/hermosa', (req, res) => {res.status(200).render('easterEgg')})

// 404
router.get('*', (req, res) => {res.status(404).render('404', {title: 'Page no found'})})

export default router
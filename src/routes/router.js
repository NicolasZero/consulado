import { request, Router } from "express";
import controller from '../controllers/controller.router.js'

const router = Router();

// ===== Views =====//
router.get("/", controller.home)
router.get("/cities/:country?", controller.cities)
router.get("/consulates/:country?", controller.consulates)
router.get("/support_networks/:country/:city", controller.supportNetwork)
router.get("/chat", controller.chat)
router.get('/500', (req, res) => {res.render('500', {title: 'Error 500'})})

// 404
router.get('*', (req, res) => {res.render('404', {title: 'Page no found'})})

export default router
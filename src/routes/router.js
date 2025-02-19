import { request, Router } from "express";
import controller from '../controllers/controller.router.js'

const router = Router();

// ===== Views =====//
router.get("/", controller.home)
// 404
router.get('*', (req, res) => {res.render('404', {title: 'Page no found'})})

export default router
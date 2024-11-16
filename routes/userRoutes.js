import express from 'express'
import { Login, signup } from '../controllers/authController.js';

const router = express.Router()

router.post('/',signup);

router.post('/login',Login);


export default router
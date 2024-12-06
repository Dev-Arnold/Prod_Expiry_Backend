import express from 'express'
import { forgot_password, Login, reset_password, signup } from '../controllers/authController.js';
import authorize from "../middlewares/aurhorize.js";

const router = express.Router();

router.post('/', authorize(["Admin"]), signup);

router.post('/login',Login);

router.post('/forgot-password',forgot_password);

router.post('/reset-password/:token',reset_password)

export default router;
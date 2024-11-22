import express from 'express'
import { Login, signup } from '../controllers/authController.js';
import authorize from "../middlewares/aurhorize.js";

const router = express.Router();

router.post('/', authorize(["Admin"]), signup);

router.post('/login',Login);


export default router
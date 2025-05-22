import express from "express";

import {dashboard, login, logout, refreshToken, register, tokentest} from "../controller/userController.js"
import authMiddleware from './../middleware/Auth.js';

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.get('/verify', tokentest);
router.post('/logout', logout);
// router.get('/dashboard', dashboard);

router.get('/dashboard', authMiddleware, dashboard)
router.post("/refresh-token", refreshToken);

export default router;

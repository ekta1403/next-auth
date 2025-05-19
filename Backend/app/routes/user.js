import express from "express";

import {login, register, tokentest} from "../controller/userController.js"
const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.get('/verify', tokentest);


export default router;

import express from "express";

import { login, logout, register, isLoggedIn} from "../controller/auth.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/is_logged_in', isLoggedIn);

export default router;
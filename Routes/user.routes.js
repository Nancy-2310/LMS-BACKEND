import { Router } from "express";
import { getProfile, login, logout, register } from "../Controllers/user.controller";

const router = Router();

router.post('/register', register);
router.get('/me', getProfile);
router.post('/login',login);
router.get('/logout', logout);

export default router;
